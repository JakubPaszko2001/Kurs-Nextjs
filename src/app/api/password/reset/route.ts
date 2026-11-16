// src/app/api/password/reset/route.ts
// Ustawia nowe hasło na podstawie ważnego tokenu resetu.
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { hashToken, hashPassword } from "../../../lib/password";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token) {
      return NextResponse.json({ error: "Brak tokenu." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 6 znaków." },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const { data: row } = await supabaseAdmin
      .from("password_resets")
      .select("id, user_email, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Link jest nieprawidłowy lub wygasł. Poproś o nowy." },
        { status: 400 }
      );
    }

    const newHash = hashPassword(password);

    const { error: upErr } = await supabaseAdmin
      .from("users")
      .update({ password: newHash })
      .eq("email", row.user_email);

    if (upErr) {
      console.error("[password/reset] update error:", upErr);
      return NextResponse.json(
        { error: "Nie udało się zmienić hasła. Spróbuj ponownie." },
        { status: 500 }
      );
    }

    // Token jednorazowy – oznacz jako użyty.
    await supabaseAdmin
      .from("password_resets")
      .update({ used_at: new Date().toISOString() })
      .eq("id", row.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[password/reset] error:", e);
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd." },
      { status: 500 }
    );
  }
}
