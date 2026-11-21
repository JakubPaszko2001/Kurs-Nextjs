// src/app/api/admin/versions/restore/route.ts
// POST { id: number } -> przywraca wybraną wersję treści
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/adminAuth";
import { restoreVersion } from "../../../../lib/siteContent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { id?: number };
    const id = Number(body.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Nieprawidłowe id wersji." }, { status: 400 });
    }

    const restored = await restoreVersion(id);
    return NextResponse.json({ ok: true, restored });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Nie udało się przywrócić wersji." },
      { status: 500 }
    );
  }
}
