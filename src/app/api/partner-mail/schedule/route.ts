import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import {
  makeTransport,
  smtpConfigured,
  sendChapterMail,
  MAX_CHAPTERS,
} from "../mailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side key
);

async function getAuthEmail(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const email = (payload as any)?.email;
    return typeof email === "string" ? email : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userEmail = await getAuthEmail();
  if (!userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { partnerEmail, cadenceDays = 3 } = await req.json().catch(() => ({}));

  if (!partnerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail)) {
    return NextResponse.json({ error: "Podaj poprawny e-mail partnera." }, { status: 400 });
  }
    const days = Math.min(30, Math.max(1, Number(cadenceDays) || 3));
    const unsubscribeToken = randomBytes(24).toString("hex");

    // Pierwszy mail wysyłamy NATYCHMIAST, a kolejne co `days` dni (cron).
    const now = new Date();

    const { data: inserted, error } = await supabase
      .from("partner_mailings")
      .insert([
        {
          user_email: userEmail,
          partner_email: partnerEmail,
          cadence_days: days,
          current_chapter: 1,
          next_send_at: now.toISOString(), // do kalkulacji kolejnego terminu
          status: "active",
          unsubscribe_token: unsubscribeToken,
        },
      ])
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("[partner-mail:schedule] supabase error", error);
      return NextResponse.json({ error: "Błąd zapisu do bazy." }, { status: 500 });
    }

    // Natychmiastowa wysyłka pierwszego rozdziału
    const smtp = smtpConfigured();
    let sent = false;
    let sendError: string | null = null;

    try {
      const tx = makeTransport();
      await sendChapterMail(tx, partnerEmail, 1, days, unsubscribeToken);
      sent = true;
      if (smtp) {
        console.log("[partner-mail:schedule] wysłano 1. mail natychmiast:", partnerEmail);
      }
    } catch (e: any) {
      sendError = e?.message ?? "błąd wysyłki";
      console.error("[partner-mail:schedule] send error:", e);
    }

    // Ustaw kolejny termin (za `days` dni) — kolejne maile obsłuży cron.
    const next = new Date(now);
    next.setDate(next.getDate() + days);

    const isLast = MAX_CHAPTERS <= 1;
    await supabase
      .from("partner_mailings")
      .update(
        isLast
          ? { status: "finished", current_chapter: 1 }
          : { current_chapter: 2, next_send_at: next.toISOString() }
      )
      .eq("id", inserted.id);

    return NextResponse.json({
      ok: true,
      sent,
      smtpConfigured: smtp,
      sendError,
      nextSendAt: isLast ? null : next.toISOString(),
    });
}

