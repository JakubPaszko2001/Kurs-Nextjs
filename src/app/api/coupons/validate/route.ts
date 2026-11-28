// src/app/api/coupons/validate/route.ts
// Publiczna walidacja kuponu dla checkoutu (UI).
// POST { code, price } -> { valid, percent, discount, finalPrice }
import { NextRequest, NextResponse } from "next/server";
import { findCoupon, applyCoupon } from "../../../lib/coupons";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    code?: unknown;
    price?: unknown;
  };
  const price = Number(body.price);
  const safePrice = Number.isFinite(price) && price >= 0 ? Math.round(price) : 0;

  const coupon = await findCoupon(body.code);
  if (!coupon) {
    return NextResponse.json({ valid: false });
  }

  const result = await applyCoupon(safePrice, coupon.code);
  return NextResponse.json({
    valid: true,
    code: coupon.code,
    percent: coupon.percent,
    discount: result.discount,
    finalPrice: result.finalPrice,
  });
}
