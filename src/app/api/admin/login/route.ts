// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminPassword,
  signAdminToken,
  ADMIN_COOKIE_NAME,
  ADMIN_MAX_AGE,
} from "../../../lib/adminAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const password = typeof body.password === "string" ? body.password : "";

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: "Nieprawidłowe hasło." }, { status: 401 });
    }

    const token = await signAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_MAX_AGE,
    });
    return res;
  } catch (e) {
    console.error("[admin/login] error:", e);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
