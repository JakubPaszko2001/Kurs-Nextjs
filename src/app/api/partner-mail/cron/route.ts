import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_CHAPTERS = 3;

/**
 * Transporter poczty:
 * - jeśli brak SMTP_HOST → tryb testowy (streamTransport) i mail leci do konsoli
 * - jeśli masz SMTP_* w env → wysyła normalnie
 */
function makeTransport() {
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
      : undefined,
  });
}

/**
 * Załącznik PDF rozdziału z public/protected/chapters/{n}.pdf
 */
function chapterAttachment(n: number) {
  const p = path.join(process.cwd(), "public", "protected", "chapters", `${n}.pdf`);
  if (!fs.existsSync(p)) return null;
  return { filename: `rozdzial-${n}.pdf`, content: fs.readFileSync(p) };
}

export async function GET(req: NextRequest) {
  // Proste zabezpieczenie kluczem
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // DEV fast mode: co X minut zamiast dni (np. &fast=1&minutes=1)
  const fast = req.nextUrl.searchParams.get("fast") === "1";
  const fastMinutes = Math.max(1, Number(req.nextUrl.searchParams.get("minutes") || "1"));

  const now = new Date().toISOString();

  const { data: rows, error } = await supabase
    .from("partner_mailings")
    .select("*")
    .eq("status", "active")
    .lte("next_send_at", now)
    .limit(50);

  if (error) {
    console.error("[partner-mail:cron] select error", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  if (!rows?.length) return NextResponse.json({ processed: 0 });

  const tx = makeTransport();
  let processed = 0;

  for (const row of rows) {
    const n = Math.max(1, Number(row.current_chapter || 1));
    const attach = chapterAttachment(n);

    const subject = `Rozdział ${n} — Wasz plan krok po kroku`;
    const text =
`Cześć!

Partner poprosił o wysyłkę rozdziałów przewodnika co ${row.cadence_days} dni.
W załączniku Rozdział ${n}. Kolejny przyjdzie automatycznie.

Miłej lektury!`;

    try {
      const info = await tx.sendMail({
        from: process.env.MAIL_FROM || `Przewodnik <noreply@localhost>`,
        to: row.partner_email,
        subject,
        text,
        attachments: attach ? [attach] : undefined,
      });

      // Jeśli streamTransport (brak SMTP) — pokaż treść w konsoli
      if ((tx as any).options?.streamTransport) {
        console.log("=== MAIL PREVIEW (not sent) ===\n" + info.message.toString());
      }

      processed += 1;

      // Aktualizacja harmonogramu
      if (n >= MAX_CHAPTERS) {
        // ostatni rozdział: zakończ harmonogram
        await supabase
          .from("partner_mailings")
          .update({ status: "finished" })
          .eq("id", row.id);
      } else {
        // kolejny termin
        const next = new Date();
        if (fast) {
          next.setMinutes(next.getMinutes() + fastMinutes); // DEV: co X minut
        } else {
          next.setDate(next.getDate() + Number(row.cadence_days || 3)); // PROD: co X dni
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
      console.error("[partner-mail:cron] send error", e);
      // tu można dodać retry / zapis błędu do dodatkowej tabeli logów
    }
  }

  return NextResponse.json({ processed });
}
