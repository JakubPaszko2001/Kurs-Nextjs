// src/app/api/admin/content/route.ts
// GET  -> lista pól (definicja + aktualna wartość)
// POST -> zapis { values: { key: value, ... } }
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { CONTENT_FIELDS, DEFAULT_CONTENT } from "../../../lib/siteContent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values: Record<string, string> = { ...DEFAULT_CONTENT };
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("key, value");

  if (!error) {
    for (const row of data ?? []) {
      if (row?.key && typeof row.value === "string") values[row.key] = row.value;
    }
  }

  return NextResponse.json({
    fields: CONTENT_FIELDS,
    values,
    dbError: error?.message ?? null,
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const values = body.values;
    if (!values || typeof values !== "object") {
      return NextResponse.json({ error: "Brak wartości." }, { status: 400 });
    }

    const allowed = new Set(CONTENT_FIELDS.map((f) => f.key));
    const now = new Date().toISOString();

    const rows = Object.entries(values)
      .filter(([k]) => allowed.has(k))
      .map(([key, value]) => ({ key, value: String(value ?? ""), updated_at: now }));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Brak dozwolonych pól." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("[admin/content] upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, saved: rows.length });
  } catch (e) {
    console.error("[admin/content] error:", e);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
