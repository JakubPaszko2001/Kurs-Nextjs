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

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const queryKey = req.nextUrl.searchParams.get("key");
  const authHeader = req.headers.get("authorization");
  const bearerKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const provided = queryKey || bearerKey;
  if (!process.env.CRON_SECRET || provided !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Tryb dev: przyspiesza kolejne wysyłki (do testów). Nadal respektuje kolejność.
  const fast = req.nextUrl.searchParams.get("fast") === "1";
  const fastMinutes = Math.max(1, Number(req.nextUrl.searchParams.get("minutes") || "1"));
  const force = req.nextUrl.searchParams.get("force") === "1";

  // Okno tolerancji: cron może odpalić się rano, a termin wypadać później
  // tego samego dnia (<= 24h). NIE służy do wysyłania częściej niż raz dziennie.
  const TOLERANCE_MS = Number(process.env.CRON_TOLERANCE_HOURS ?? "24") * 60 * 60 * 1000;
  const threshold = new Date(Date.now() + TOLERANCE_MS).toISOString();

  let query = supabase.from("partner_mailings").select("*").eq("status", "active");

  if (!force) {
    query = query.lte("next_send_at", threshold);
  }

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
  let skipped = 0;
  const errors: { id: any; to: string; error: string }[] = [];

  for (const row of rows) {
    const n = Math.max(1, Number(row.current_chapter || 1));

    // TWARDY LIMIT: maks. 1 wiadomość na 24h na rekord.
    // Sprawdzamy last_sent_at (a nie tylko next_send_at), żeby wielokrotne
    // odpalenia crona w ciągu doby nie wysłały drugiej wiadomości.
    if (!fast && row.last_sent_at) {
      const sinceLast = Date.now() - new Date(row.last_sent_at).getTime();
      if (sinceLast < DAY_MS) {
        skipped += 1;
        continue;
      }
    }

    try {
      await sendChapterMail(
        tx,
        row.partner_email,
        n,
        Number(row.cadence_days || 3),
        row.unsubscribe_token
      );
      processed += 1;

      const nowIso = new Date().toISOString();

      if (n >= MAX_CHAPTERS) {
        await supabase
          .from("partner_mailings")
          .update({ status: "finished", last_sent_at: nowIso })
          .eq("id", row.id);
      } else {
        // Następny termin liczymy od POPRZEDNIEGO zaplanowanego terminu
        // (a nie od momentu odpalenia crona) — eliminuje dryf.
        const base = row.next_send_at ? new Date(row.next_send_at) : new Date();
        const next = new Date(base);
        if (fast) {
          next.setMinutes(next.getMinutes() + fastMinutes);
        } else {
          next.setDate(next.getDate() + Number(row.cadence_days || 3));
          // Twardy limit: min. 24h od TERAZ.
          const minNext = new Date(Date.now() + DAY_MS);
          if (next.getTime() < minNext.getTime()) next.setTime(minNext.getTime());
        }

        await supabase
          .from("partner_mailings")
          .update({
            current_chapter: n + 1,
            next_send_at: next.toISOString(),
            last_sent_at: nowIso,
          })
          .eq("id", row.id);
      }
    } catch (e) {
      console.error("[partner-mail:cron] send error:", e);
      errors.push({
        id: row.id,
        to: row.partner_email,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({
    processed,
    skipped,
    smtpConfigured,
    ...(errors.length ? { errors } : {}),
    warning: smtpConfigured
      ? undefined
      : "SMTP nie jest skonfigurowane — maile NIE zostały wysłane (tylko podgląd w logach). Ustaw SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.",
  });
}
