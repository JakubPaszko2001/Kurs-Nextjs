// src/app/api/password/forgot/route.ts
// Wysyła link do resetu hasła. Zawsze zwraca ok (nie zdradza, czy e-mail istnie).
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { generateResetToken, hashToken } from "../../../lib/password";
import { makeTransport, sendMailAsync, appBaseUrl } from "../../partner-mail/mailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RESET_TTL_MIN = 60; // link ważny 60 minut

const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    // Zawsze odpowiadamy ok — nie ujawniamy, czy konto istnieje.
    if (!isEmail(email)) {
      return NextResponse.json({ ok: true });
    }

    // Sprawdź, czy użytkownik istnieje.
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (user) {
      const token = generateResetToken();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + RESET_TTL_MIN * 60 * 1000);

      const { error: insErr } = await supabaseAdmin
        .from("password_resets")
        .insert([
          {
            user_email: email,
            token_hash: tokenHash,
            expires_at: expiresAt.toISOString(),
          },
        ]);
      if (insErr) {
        console.error("[password/forgot] insert error:", insErr);
        return NextResponse.json({ ok: true });
      }

      const base = appBaseUrl();
      const resetUrl = `${base}/reset-password/${token}`;

      const text = `Cześć!

Otrzymaliśmy prośbę o reset hasła do Twojego konta.
Link jest ważny ${RESET_TTL_MIN} minut i można go użyć tylko raz.

Ustaw nowe hasło: ${resetUrl}

Jeśli to nie Ty prosiłeś o reset, zignoruj tę wiadomość — hasło pozostanie bez zmian.`;

      const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937">
        <p>Cześć!</p>
        <p>Otrzymaliśmy prośbę o reset hasła do Twojego konta.<br/>
        Link jest ważny <strong>${RESET_TTL_MIN} minut</strong> i można go użyć tylko raz.</p>
        <p style="margin:24px 0">
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 20px;background:#e11d48;color:#fff;text-decoration:none;border-radius:10px;font-weight:700">
            Ustaw nowe hasło
          </a>
        </p>
        <p style="font-size:12px;color:#6b7280">
          Jeśli przycisk nie działa, skopiuj link:<br/>
          <a href="${resetUrl}" style="color:#6b7280">${resetUrl}</a>
        </p>
        <p style="font-size:13px;color:#6b7280">
          Jeśli to nie Ty prosiłeś o reset, zignoruj tę wiadomość — hasło pozostanie bez zmian.
        </p>
      </div>`;

      try {
        const tx = makeTransport();
        await sendMailAsync(tx, {
          from: process.env.MAIL_FROM || "materialy@cozrobic.pl",
          to: email,
          subject: "Reset hasła – Co zrobić, gdy Twoja druga połówka nie chce",
          text,
          html,
        });
      } catch (mailErr) {
        console.error("[password/forgot] mail error:", mailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[password/forgot] error:", e);
    return NextResponse.json({ ok: true });
  }
}
