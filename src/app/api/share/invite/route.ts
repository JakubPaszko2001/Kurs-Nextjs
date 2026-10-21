// src/app/api/share/invite/route.ts
// Kupujący tworzy prywatne zaproszenie dla drugiej osoby.
// Zwracamy link, który kupujący sam przekazuje (np. przez WhatsApp/SMS).
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getSessionEmail, isPaidUser } from "../../../lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isPaidUser(email))) {
    return NextResponse.json(
      { error: "Udostępnianie jest dostępne po zakupie dostępu." },
      { status: 403 }
    );
  }

  const token = randomBytes(24).toString("hex");

  const { data, error } = await supabaseAdmin
    .from("share_invites")
    .insert([
      {
        token,
        inviter_email: email,
        status: "pending",
      },
    ])
    .select("id, token")
    .single();

  if (error || !data) {
    console.error("[share/invite] insert error:", error);
    return NextResponse.json({ error: "Nie udało się utworzyć zaproszenia." }, { status: 500 });
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "";

  return NextResponse.json({
    ok: true,
    token: data.token,
    url: `${base}/invite/${data.token}`,
  });
}
