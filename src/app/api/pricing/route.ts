// src/app/api/pricing/route.ts
// Publiczny podgląd cen (dla checkoutu i book-order).
import { NextResponse } from "next/server";
import { getPricing } from "../../lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const p = await getPricing();
  return NextResponse.json(p, {
    headers: { "Cache-Control": "no-store" },
  });
}
