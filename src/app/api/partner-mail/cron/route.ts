// src/app/api/partner-mail/cron/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type Transporter } from "nodemailer";
import {
  makeTransport,
  smtpConfigured as isSmtpConfigured,
  sendChapterMail,
  MAX_CHAPTERS,
} from "../mailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // Autoryzacja: albo ?key=CRON_SECRET, albo nagłówek
  // Authorization: Bearer CRON_SECRET (Vercel Cron wysyła go automatycznie).
  const queryKey = req.nextUrl.searchParams.get("key");
  const authHeader = req.headers.get("authorization");
  const bearerKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const provided = queryKey || bearerKey;
  if (!process.env.CRON_SECRET || provided !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // DEV fast mode
  const fast = req.nextUrl.searchParams.get("fast") === "1";
  const fastMinutes = Math.max(1, Number(req.nextUrl.searchParams.get("minutes") || "1"));
  const force = req.nextUrl.searchParams.get("force") === "1";

    // Okno tolerancji: cron może odpalić się rano, a termin wypadać później
  // tego samego dnia. Wybieramy też rekordy, których termin minie w ciągu
  // najbliższych `TOLERANCE_MS`, żeby mail nie czekał do następnej doby.
  // Na Vercel Hobby (cron 1x/dzień) sensowne jest ~24h; na Pro (co godzinę)
  // wystarczy ~2h.
  const TOLERANCE_MS = Number(
    process.env.CRON_TOLERANCE_HOURS ?? "24"
  ) * 60 * 60 * 1000;
  const threshold = new Date(Date.now() + TOLERANCE_MS).toISOString();

  let query = supabase
    .from("partner_mailings")
    .select("*")
    .eq("status", "active");

  if (!force) {
    // rekordy, których termin już minął LUB minie w oknie tolerancji
    query = query.lte("next_send_at", threshold);
  }

  // najdawniej zaległe mają priorytet
  query = query.order("next_send_at", { ascending: true });

  const { data: rows, error } = await query.limit(200);

  if (error) {
    console.error("[partner-mail:cron] select error", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  if (!rows?.length) return NextResponse.json({ processed: 0 });

    const tx: Transporter = makeTransport();
  const smtpConfigured = isSmtpConfigured();
  let processed = 0;

  for (const row of rows) {
    const n = Math.max(1, Number(row.current_chapter || 1));

    try {
      await sendChapterMail(
        tx,
        row.partner_email,
        n,
        Number(row.cadence_days || 3),
        row.unsubscribe_token
      );
      processed += 1;

      if (n >= MAX_CHAPTERS) {
        await supabase
          .from("partner_mailings")
          .update({ status: "finished" })
          .eq("id", row.id);
      } else {
        // Następny termin liczymy od POPRZEDNIEGO zaplanowanego terminu
        // (a nie od momentu odpalenia crona) — to eliminuje dryf i sprawia,
        // że każdy mail leci dokładnie co `cadence_days` dni, o stałej godzinie.
        const base = row.next_send_at ? new Date(row.next_send_at) : new Date();
        const next = new Date(base);
        if (fast) {
          // tryb dev: przyspieszamy, ale zachowujemy kolejność
          next.setMinutes(next.getMinutes() + fastMinutes);
        } else {
          next.setDate(next.getDate() + Number(row.cadence_days || 3));
        }

        // Twardy limit: maksymalnie raz dziennie (min. 24h od wysyłki).
        if (!fast) {
          const minNext = new Date(Date.now() + 24 * 60 * 60 * 1000);
          if (next.getTime() < minNext.getTime()) {
            next.setTime(minNext.getTime());
          }
        }

        await supabase
          .from("partner_mailings")
          .update({
            current_chapter: n + 1,
            next_send_at: next.toISOString(),
          })
          .eq("id", row.id);
      }
    } catch (e) {
      console.error("[partner-mail:cron] send error:", e);
      // tu możesz dopisać zapis do tabeli logów
    }
  }

    return NextResponse.json({
    processed,
    smtpConfigured,
    warning: smtpConfigured
      ? undefined
      : "SMTP nie jest skonfigurowane — maile NIE zostały wysłane (tylko podgląd w logach). Ustaw SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.",
  });
}

