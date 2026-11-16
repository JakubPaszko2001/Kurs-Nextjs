// src/app/api/password/verify/route.ts
// GET ?token=... – sprawdza, czy link resetu jest ważny (dla strony /reset-password).
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { hashToken } from "../../../lib/password";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!token) return NextResponse.json({ valid: false });

  const tokenHash = hashToken(token);
  const { data: row } = await supabaseAdmin
    .from("password_resets")
    .select("id, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!row) return NextResponse.json({ valid: false });
  if (row.used_at) return NextResponse.json({ valid: false });
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true });
}
