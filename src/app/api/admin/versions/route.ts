// src/app/api/admin/versions/route.ts
// GET -> lista wersji treści (historia zapisów)
import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { listVersions } from "../../../lib/siteContent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const versions = await listVersions(40);
    return NextResponse.json({ versions });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Nie udało się pobrać wersji." },
      { status: 500 }
    );
  }
}
