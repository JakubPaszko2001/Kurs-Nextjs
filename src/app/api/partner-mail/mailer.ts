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
  return { filename: `rozdzial-${n}.pdf`, content: fs.readFileSync(p) };
}

export function sendMailAsync(tx: Transporter, mail: SendMailOptions) {
  return new Promise<SentMessageInfo>((resolve, reject) => {
    tx.sendMail(mail, (err, info) => (err ? reject(err) : resolve(info)));
  });
}

/** Buduje i wysyła mail z rozdziałem o numerze `n`. */
export async function sendChapterMail(
  tx: Transporter,
  to: string,
  n: number,
  cadenceDays: number
) {
  const attach = chapterAttachment(n);
  const chapterTitle =
    chapters.find((c) => c.id === n)?.title ?? `Rozdział ${n}`;
  const text = `Cześć!

Partner poprosił o wysyłkę rozdziałów przewodnika co ${cadenceDays} dni.
W załączniku Rozdział ${n}. Kolejny przyjdzie automatycznie.

Miłej lektury!`;

  const info = await sendMailAsync(tx, {
    from: process.env.MAIL_FROM || `Przewodnik <noreply@localhost>`,
    to,
    subject: chapterTitle,
    text,
    attachments: attach ? [attach] : undefined,
  });

  if ((tx as any).options?.streamTransport) {
    console.log(
      "=== MAIL PREVIEW (not sent) ===\n" + (info as any).message?.toString?.()
    );
  }
  return info;
}
