// src/app/lib/coupons.ts
// Kupony rabatowe – edytowalne z panelu admina (tabela public.coupons).
// Używane w UI (checkout) ORAZ w backendzie (/api/checkout), żeby
// kwota "Do zapłaty" = kwota pobierana przez Stripe.

import { supabaseAdmin } from "./supabaseAdmin";

export type Coupon = {
  code: string; // kod (wielkie litery)
  percent: number; // rabat w procentach (0-100)
  active: boolean;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  note: string | null;
};

// Fallback, gdy tabela coupons nie istnieje / błąd DB.
const FALLBACK_COUPONS: Coupon[] = [
  {
    code: "KODRABATOWY",
    percent: 10,
    active: true,
    max_uses: null,
    uses: 0,
    expires_at: null,
    note: "Domyślny kupon (fallback)",
  },
];

/** Normalizuje kod: trim + WIELKIE LITERY. */
export function normalizeCode(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toUpperCase() : "";
}

/** Czy kupon jest aktualnie ważny (aktywny, nie wygasł, nie przekroczył limitu). */
export function isCouponValid(c: Coupon, now: Date = new Date()): boolean {
  if (!c.active) return false;
  if (c.percent <= 0 || c.percent > 100) return false;
  if (c.expires_at && new Date(c.expires_at).getTime() < now.getTime()) return false;
  if (c.max_uses != null && c.uses >= c.max_uses) return false;
  return true;
}

/** Wczytuje wszystkie kupony z DB (fallback = FALLBACK_COUPONS). */
export async function getCoupons(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("code, percent, active, max_uses, uses, expires_at, note")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[coupons] read error:", error.message);
      return FALLBACK_COUPONS;
    }
    return (data ?? []) as Coupon[];
  } catch (e) {
    console.error("[coupons] unexpected:", e);
    return FALLBACK_COUPONS;
  }
}

/** Zwraca ważny kupon po kodzie (case-insensitive) lub null. */
export async function findCoupon(raw: unknown): Promise<Coupon | null> {
  const code = normalizeCode(raw);
  if (!code) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("code, percent, active, max_uses, uses, expires_at, note")
      .eq("code", code)
      .maybeSingle();
    if (error) {
      console.error("[coupons] find error:", error.message);
      const fb = FALLBACK_COUPONS.find((c) => c.code === code);
      return fb && isCouponValid(fb) ? fb : null;
    }
    if (!data) return null;
    const c = data as Coupon;
    return isCouponValid(c) ? c : null;
  } catch (e) {
    console.error("[coupons] find unexpected:", e);
    const fb = FALLBACK_COUPONS.find((c) => c.code === code);
    return fb && isCouponValid(fb) ? fb : null;
  }
}

/**
 * Liczy końcową cenę w groszach po rabacie kuponu.
 * Zaokrąglenie identyczne w UI i backendzie (Math.round).
 */
export async function applyCoupon(
  priceGrosze: number,
  code: unknown
): Promise<{ coupon: Coupon | null; discount: number; finalPrice: number }> {
  const coupon = await findCoupon(code);
  if (!coupon) {
    return { coupon: null, discount: 0, finalPrice: priceGrosze };
  }
  const pct = Math.min(100, Math.max(0, coupon.percent));
  const discount = Math.round((priceGrosze * pct) / 100);
  const finalPrice = Math.max(0, priceGrosze - discount);
  return { coupon, discount, finalPrice };
}

/** Zwiększa licznik użyć kuponu (best-effort, nie blokuje płatności). */
export async function incrementCouponUse(code: string): Promise<void> {
  const norm = normalizeCode(code);
  if (!norm) return;
  try {
    const { data } = await supabaseAdmin
      .from("coupons")
      .select("uses")
      .eq("code", norm)
      .maybeSingle();
    const current = Number(data?.uses ?? 0);
    await supabaseAdmin
      .from("coupons")
      .update({ uses: current + 1, updated_at: new Date().toISOString() })
      .eq("code", norm);
  } catch (e) {
    console.error("[coupons] increment error:", e);
  }
}
