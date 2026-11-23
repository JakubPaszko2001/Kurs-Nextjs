// src/app/api/admin/pricing/route.ts
// GET  -> aktualne ceny
// POST -> zapis cen (walidacja + zapis do site_content)
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import {
  getPricing,
  pricingToRows,
  PRICING_KEYS,
  type Pricing,
} from "../../../lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pricing = await getPricing();
  return NextResponse.json({ pricing });
}

function toGrosze(v: unknown): number | null {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;

    const coursePrice = toGrosze(body.coursePrice);
    const courseOriginal = toGrosze(body.courseOriginal);
    const bookPrice = toGrosze(body.bookPrice);
    const shippingStandard = toGrosze(body.shippingStandard);
    const shippingExpress = toGrosze(body.shippingExpress);

    if (
      coursePrice === null ||
      courseOriginal === null ||
      bookPrice === null ||
      shippingStandard === null ||
      shippingExpress === null
    ) {
      return NextResponse.json(
        { error: "Wszystkie ceny muszą być liczbami >= 0 (w groszach)." },
        { status: 400 }
      );
    }

    const pricing: Pricing = {
      coursePrice,
      courseOriginal,
      coursePromoLabel: String(body.coursePromoLabel ?? "").slice(0, 80),
      coursePromoActive: body.coursePromoActive === true || body.coursePromoActive === "true",
      bookPrice,
      shippingStandard,
      shippingExpress,
    };

    const now = new Date().toISOString();
    const rows = pricingToRows(pricing).map((r) => ({ ...r, updated_at: now }));

    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("[admin/pricing] upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pricing });
  } catch (e: any) {
    console.error("[admin/pricing] error:", e);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
