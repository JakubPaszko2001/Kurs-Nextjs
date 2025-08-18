import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

function fail(msg: string, code = 500) {
  console.error("[/api/login] ERROR:", msg);
  return NextResponse.json({ error: msg }, { status: code });
}

export async function POST(req: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return fail("Missing SERVICE_ROLE_KEY");
    if (!process.env.JWT_SECRET) return fail("Missing JWT_SECRET");

    const { email, password } = await req.json();
    if (!email || !password) return fail("Brakuje email/hasła", 400);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, password")
      .eq("email", email)
      .maybeSingle();

    if (error) return fail("DB: " + error.message);
    if (!user || user.password !== password) {
      return fail("Nieprawidłowy email/hasło", 401);
    }

    const token = await new SignJWT({ sub: String(user.id), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/login] UNEXPECTED:", msg);
    return fail(msg || "Internal Server Error");
  }
}
