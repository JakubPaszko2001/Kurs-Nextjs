// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "../../../lib/adminAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
