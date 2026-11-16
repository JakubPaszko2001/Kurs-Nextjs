// src/app/api/register/route.ts
// Rejestracja z hashowaniem hasła (po stronie serwera).
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { hashPassword } from "../../lib/password";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Podaj poprawny e-mail." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 6 znaków." },
        { status: 400 }
      );
    }

    // Czy konto już istnieje?
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "Konto z tym adresem już istnieje." },
        { status: 409 }
      );
    }

    const { error } = await supabaseAdmin.from("users").insert([
      {
        email,
        password: hashPassword(password),
        status: "unpaid",
      },
    ]);

    if (error) {
      console.error("[register] insert error:", error);
      return NextResponse.json(
        { error: "Nie udało się utworzyć konta: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[register] error:", e);
    return NextResponse.json({ error: "Wystąpił błąd." }, { status: 500 });
  }
}
