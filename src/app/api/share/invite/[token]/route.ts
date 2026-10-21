// src/app/api/share/invite/[token]/route.ts
// Pobiera publiczne (bezpieczne) dane zaproszenia po tokenie — do wyświetlenia strony /invite/[token].
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 10) {
    return NextResponse.json({ valid: false, error: "Nieprawidłowy link." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("share_invites")
    .select("status, created_at")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[share/invite:get] error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ valid: false, error: "Zaproszenie nie istnieje." }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    status: data.status, // pending | accepted | revoked
    createdAt: data.created_at,
  });
}
