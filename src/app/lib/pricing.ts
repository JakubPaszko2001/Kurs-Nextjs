// src/app/lib/pricing.ts
// Ceny kursu i książki – edytowalne z panelu admina.
// Wartości trzymane w tabeli site_content (klucze pricing_*), w GROSZACH.
import { supabaseAdmin } from "./supabaseAdmin";

export type Pricing = {
  // Kurs (dostęp online)
  coursePrice: number; // aktualna cena sprzedaży (grosze)
  courseOriginal: number; // cena katalogowa / przekreślona (grosze)
  coursePromoLabel: string; // np. "Promocja -25%"
  coursePromoActive: boolean; // czy pokazywać promocję
  // Książka (druk)
  bookPrice: number; // grosze
  shippingStandard: number; // grosze
  shippingExpress: number; // grosze
};

export const DEFAULT_PRICING: Pricing = {
  coursePrice: 14900,
  courseOriginal: 20000,
  coursePromoLabel: "",
  coursePromoActive: true,
  bookPrice: 9900,
  shippingStandard: 490,
  shippingExpress: 1990,
};

// Klucze w site_content
export const PRICING_KEYS = {
  coursePrice: "pricing_course_price",
  courseOriginal: "pricing_course_original",
  coursePromoLabel: "pricing_course_promo_label",
  coursePromoActive: "pricing_course_promo_active",
  bookPrice: "pricing_book_price",
  shippingStandard: "pricing_shipping_standard",
  shippingExpress: "pricing_shipping_express",
} as const;

function toInt(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : fallback;
}

function toBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "1";
  return fallback;
}

/** Buduje obiekt Pricing z mapy klucz->wartość (string). */
export function pricingFromMap(map: Record<string, string>): Pricing {
  const g = (k: string) => map[k];
  return {
    coursePrice: toInt(g(PRICING_KEYS.coursePrice), DEFAULT_PRICING.coursePrice),
    courseOriginal: toInt(
      g(PRICING_KEYS.courseOriginal),
      DEFAULT_PRICING.courseOriginal
    ),
    coursePromoLabel:
      typeof g(PRICING_KEYS.coursePromoLabel) === "string"
        ? String(g(PRICING_KEYS.coursePromoLabel))
        : DEFAULT_PRICING.coursePromoLabel,
    coursePromoActive: toBool(
      g(PRICING_KEYS.coursePromoActive),
      DEFAULT_PRICING.coursePromoActive
    ),
    bookPrice: toInt(g(PRICING_KEYS.bookPrice), DEFAULT_PRICING.bookPrice),
    shippingStandard: toInt(
      g(PRICING_KEYS.shippingStandard),
      DEFAULT_PRICING.shippingStandard
    ),
    shippingExpress: toInt(
      g(PRICING_KEYS.shippingExpress),
      DEFAULT_PRICING.shippingExpress
    ),
  };
}

/** Mapuję Pricing -> rekordy do zapisu w site_content. */
export function pricingToRows(p: Pricing): { key: string; value: string }[] {
  return [
    { key: PRICING_KEYS.coursePrice, value: String(p.coursePrice) },
    { key: PRICING_KEYS.courseOriginal, value: String(p.courseOriginal) },
    { key: PRICING_KEYS.coursePromoLabel, value: String(p.coursePromoLabel) },
    { key: PRICING_KEYS.coursePromoActive, value: p.coursePromoActive ? "true" : "false" },
    { key: PRICING_KEYS.bookPrice, value: String(p.bookPrice) },
    { key: PRICING_KEYS.shippingStandard, value: String(p.shippingStandard) },
    { key: PRICING_KEYS.shippingExpress, value: String(p.shippingExpress) },
  ];
}

/** Wczytuje aktualne ceny z bazy (fallback = DEFAULT_PRICING). */
export async function getPricing(): Promise<Pricing> {
  const map: Record<string, string> = {};
  try {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("key, value")
      .in("key", Object.values(PRICING_KEYS));
    if (!error) {
      for (const row of data ?? []) {
        if (row?.key) map[row.key] = String(row.value ?? "");
      }
    }
  } catch (e) {
    console.error("[pricing] read error:", e);
  }
  return pricingFromMap(map);
}
