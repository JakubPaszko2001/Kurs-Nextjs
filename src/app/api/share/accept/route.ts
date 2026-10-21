// src/app/api/share/accept/route.ts
// Druga osoba akceptuje zaproszenie i PODAJE SWÓJ e-mail.
// Dopiero teraz tworzymy harmonogram: 1 rozdział dziennie (maks.), z linkiem „stop”.
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const token = String(body.token || "");
  const email = String(body.email || "").trim().toLowerCase();

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Nieprawidłowy link zaproszenia." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  const { data: invite, error } = await supabaseAdmin
    .from("share_invites")
    .select("id, inviter_email, invited_email, status")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[share/accept] select error:", error);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
  if (!invite) {
    return NextResponse.json({ error: "Zaproszenie nie istnieje." }, { status: 404 });
  }
  if (invite.status === "revoked") {
    return NextResponse.json({ error: "Zaproszenie zostało unieważnione." }, { status: 400 });
  }
  if (invite.status === "accepted") {
    return NextResponse.json({ ok: true, already: true });
  }
  if (invite.inviter_email === email) {
    return NextResponse.json(
      { error: "Zaproszenie musi przyjąć druga osoba (inny adres e-mail)." },
      { status: 400 }
    );
  }

  const unsubscribeToken = randomBytes(24).toString("hex");
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // 1) Oznacz zaproszenie jako przyjęte
  const { error: updErr } = await supabaseAdmin
    .from("share_invites")
    .update({ status: "accepted", invited_email: email, accepted_at: now.toISOString() })
    .eq("id", invite.id)
    .eq("status", "pending");

  if (updErr) {
    console.error("[share/accept] invite update error:", updErr);
    return NextResponse.json({ error: "Nie udało się zaakceptować zaproszenia." }, { status: 500 });
  }

  // 2) Harmonogram: 1 rozdział dziennie (cadence_days = 1).
  //    Pierwsza wiadomość dopiero za 24h od akceptacji (next_send_at = jutro),
  //    więc nawet przy kilku zaproszeniach obowiązuje limit „maks. raz dziennie”.
  const { error: mailErr } = await supabaseAdmin
    .from("partner_mailings")
    .insert([
      {
        user_email: invite.inviter_email,
        partner_email: email,
        cadence_days: 1,
        current_chapter: 1,
        next_send_at: tomorrow.toISOString(),
        status: "active",
        unsubscribe_token: unsubscribeToken,
        invite_id: invite.id,
      },
    ]);

  if (mailErr) {
    console.error("[share/accept] mailing insert error:", mailErr);
    return NextResponse.json({ error: "Nie udało się uruchomić wysyłki." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
