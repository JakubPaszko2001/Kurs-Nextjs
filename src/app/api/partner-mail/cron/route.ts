// src/app/api/partner-mail/cron/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer, { type Transporter, type SendMailOptions, type SentMessageInfo } from "nodemailer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_CHAPTERS = 3;

function makeTransport(): Transporter {
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    }) as unknown as Transporter;
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

function chapterAttachment(n: number) {
  const p = path.join(process.cwd(), "public", "protected", "chapters", `${n}.pdf`);
  if (!fs.existsSync(p)) return null;
  return { filename: `rozdzial-${n}.pdf`, content: fs.readFileSync(p) };
}

// 👇 helper: promise wrapper na callbackową wersję sendMail
function sendMailAsync(tx: Transporter, mail: SendMailOptions) {
  return new Promise<SentMessageInfo>((resolve, reject) => {
    tx.sendMail(mail, (err, info) => (err ? reject(err) : resolve(info)));
  });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // DEV fast mode
  const fast = req.nextUrl.searchParams.get("fast") === "1";
  const fastMinutes = Math.max(1, Number(req.nextUrl.searchParams.get("minutes") || "1"));
  const force = req.nextUrl.searchParams.get("force") === "1";

  const now = new Date().toISOString();

  let query = supabase
    .from("partner_mailings")
    .select("*")
    .eq("status", "active");

  if (!force) {
    query = query.lte("next_send_at", now);
  }

  const { data: rows, error } = await query.limit(50);

  if (error) {
    console.error("[partner-mail:cron] select error", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  if (!rows?.length) return NextResponse.json({ processed: 0 });

  const tx: Transporter = makeTransport();
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
      const info = await sendMailAsync(tx, {
        from: process.env.MAIL_FROM || `Przewodnik <noreply@localhost>`,
        to: row.partner_email,
        subject,
        text,
        attachments: attach ? [attach] : undefined,
      });

      if ((tx as any).options?.streamTransport) {
        console.log("=== MAIL PREVIEW (not sent) ===\n" + (info as any).message?.toString?.());
      }

      processed += 1;

      if (n >= MAX_CHAPTERS) {
        await supabase
          .from("partner_mailings")
          .update({ status: "finished" })
          .eq("id", row.id);
      } else {
        const next = new Date();
        if (fast) next.setMinutes(next.getMinutes() + fastMinutes);
        else next.setDate(next.getDate() + Number(row.cadence_days || 3));

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

  return NextResponse.json({ processed });
}
