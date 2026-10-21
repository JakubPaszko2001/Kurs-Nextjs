// src/app/api/partner-mail/mailer.ts
import nodemailer, {
  type Transporter,
  type SendMailOptions,
  type SentMessageInfo,
} from "nodemailer";
import fs from "fs";
import path from "path";
import { chapters } from "../../userpage/chapters";

export const MAX_CHAPTERS = chapters.length;

export function makeTransport(): Transporter {
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    }) as unknown as Transporter;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
      : undefined,
  });
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST);
}

export function chapterAttachment(n: number) {
  const chapter = chapters.find((c) => c.id === n);
  if (!chapter) return null;
  const p = path.join(process.cwd(), "public", chapter.pdf.replace(/^\//, ""));
  if (!fs.existsSync(p)) return null;
  // Neutralna nazwa załącznika — nie zdradza tematyki.
  return { filename: `material-czesc-${n}.pdf`, content: fs.readFileSync(p) };
}

export function sendMailAsync(tx: Transporter, mail: SendMailOptions) {
  return new Promise<SentMessageInfo>((resolve, reject) => {
    tx.sendMail(mail, (err, info) => (err ? reject(err) : resolve(info)));
  });
}

export function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  );
}

/**
 * Buduje i wysyła mail z rozdziałem o numerze `n`.
 * Temat jest celowo dyskretny („Materiał – część N”) i nie ujawnia tematyki.
 * Każda wiadomość zawiera link do zatrzymania kolejnych wiadomości.
 */
export async function sendChapterMail(
  tx: Transporter,
  to: string,
  n: number,
  _cadenceDays: number,
  unsubscribeToken?: string | null
) {
  const attach = chapterAttachment(n);
  const total = chapters.length;
  const base = appBaseUrl();
  const stopUrl = unsubscribeToken
    ? `${base}/stop/${unsubscribeToken}`
    : `${base}/stop`;

  const text = `Cześć!

W załączniku materiał – część ${n} z ${total}.
Kolejna część przyjdzie automatycznie (maksymalnie raz dziennie).

Jeśli nie chcesz otrzymywać kolejnych wiadomości, kliknij:
${stopUrl}

Miłej lektury!`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937">
    <p>Cześć!</p>
    <p>W załączniku <strong>materiał – część ${n} z ${total}</strong>.<br/>
    Kolejna część przyjdzie automatycznie (maksymalnie raz dziennie).</p>
    <p style="margin:24px 0">
      <a href="${stopUrl}"
         style="display:inline-block;padding:10px 18px;background:#e11d48;color:#fff;text-decoration:none;border-radius:10px;font-weight:700">
        Zatrzymaj kolejne wiadomości
      </a>
    </p>
    <p style="font-size:12px;color:#6b7280">
      Jeśli przycisk nie działa, skopiuj link:
      <a href="${stopUrl}" style="color:#6b7280">${stopUrl}</a>
    </p>
    <p>Miłej lektury!</p>
  </div>`;

  const info = await sendMailAsync(tx, {
    from: process.env.MAIL_FROM || `Materiały <noreply@localhost>`,
    to,
    subject: `Materiał – część ${n}`,
    text,
    html,
    attachments: attach ? [attach] : undefined,
  });

  if ((tx as any).options?.streamTransport) {
    console.log(
      "=== MAIL PREVIEW (not sent) ===\n" + (info as any).message?.toString?.()
    );
  }
  return info;
}

