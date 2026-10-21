// src/app/api/partner-mail/unsubscribe/route.ts
// Zatrzymuje kolejne wiadomości — wywoływane ze strony /stop/[token].
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const token = String(body.token || "");

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Nieprawidłowy link." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("partner_mailings")
    .select("id, status")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (error) {
    console.error("[partner-mail/unsubscribe] select error:", error);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Link nieprawidłowy lub wygasł." }, { status: 404 });
  }

  if (data.status === "finished") {
    return NextResponse.json({ ok: true, already: true });
  }

  const { error: updErr } = await supabaseAdmin
    .from("partner_mailings")
    .update({ status: "finished", stopped_reason: "user_unsubscribe" })
    .eq("id", data.id);

  if (updErr) {
    console.error("[partner-mail/unsubscribe] update error:", updErr);
    return NextResponse.json({ error: "Nie udało się zatrzymać wysyłki." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
