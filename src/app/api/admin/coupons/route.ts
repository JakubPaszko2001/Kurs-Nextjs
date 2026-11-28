// src/app/api/admin/coupons/route.ts
// CRUD kuponów rabatowych (panel admina).
//   GET    -> lista kuponów
//   POST   -> utwórz kupon
//   PATCH  -> edytuj kupon (body.code identyfikuje)
//   DELETE -> usuń kupon (?code=KOD)
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { normalizeCode } from "../../../lib/coupons";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("code, percent, active, max_uses, uses, expires_at, note, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ coupons: data ?? [] });
}

function parseBody(body: Record<string, any>) {
  const code = normalizeCode(body.code);
  const percent = Number(body.percent);
  const active = body.active === true || body.active === "true";
  const maxUsesRaw = body.max_uses;
  const max_uses =
    maxUsesRaw === null || maxUsesRaw === "" || maxUsesRaw === undefined
      ? null
      : Math.max(0, Math.round(Number(maxUsesRaw)));
  const expires =
    body.expires_at === null || body.expires_at === "" || body.expires_at === undefined
      ? null
      : new Date(body.expires_at).toISOString();
  const note = body.note ? String(body.note).slice(0, 300) : null;
  return { code, percent, active, max_uses, expires, note };
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const { code, percent, active, max_uses, expires, note } = parseBody(body);

  if (!code || code.length < 3 || code.length > 40) {
    return NextResponse.json(
      { error: "Kod musi mieć 3–40 znaków (A–Z, 0–9)." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(percent) || percent < 1 || percent > 100) {
    return NextResponse.json({ error: "Rabat musi być w zakresie 1–100%." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin.from("coupons").insert({
    code,
    percent: Math.round(percent),
    active,
    max_uses,
    expires_at: expires,
    note,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    if (String(error.message).toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: "Kupon o tym kodzie już istnieje." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, code });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const { code, percent, active, max_uses, expires, note } = parseBody(body);

  if (!code) {
    return NextResponse.json({ error: "Brak kodu kuponu." }, { status: 400 });
  }
  if (!Number.isFinite(percent) || percent < 1 || percent > 100) {
    return NextResponse.json({ error: "Rabat musi być w zakresie 1–100%." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("coupons")
    .update({
      percent: Math.round(percent),
      active,
      max_uses,
      expires_at: expires,
      note,
      updated_at: new Date().toISOString(),
    })
    .eq("code", code);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, code });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const code = normalizeCode(req.nextUrl.searchParams.get("code"));
  if (!code) {
    return NextResponse.json({ error: "Brak kodu kuponu." }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("coupons").delete().eq("code", code);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
