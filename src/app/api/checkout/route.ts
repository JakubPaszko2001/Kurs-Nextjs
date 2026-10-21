// src/app/api/checkout/route.ts
// Endpoint płatności dla produktu cyfrowego:
//   „Plan odzyskania bliskości – pełen dostęp online” – 1 licencja (149 zł)
//
// Wymagane zgody (walidowane też tutaj, nie tylko w UI):
//   1) akceptacja Regulaminu i Polityki prywatności,
//   2) żądanie natychmiastowego dostępu + przyjęcie skutków dla prawa odstąpienia.
// Datę i pełną treść zgód zapisujemy w metadata Stripe ORAZ w tabeli order_consents.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";
import {
  TERMS_VERSION,
  TERMS_CONSENT_TEXT,
  IMMEDIATE_ACCESS_VERSION,
  IMMEDIATE_ACCESS_CONSENT_TEXT,
} from "../../lib/consents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "service-role-placeholder",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function getEmailFromCookie(): Promise<string | undefined> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const email = (payload as any)?.email;
    return typeof email === "string" ? email : undefined;
  } catch {
    return;
  }
}

function baseUrl(req: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000"
  );
}

const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const stripe = new Stripe(secret);
    const url = baseUrl(req);

    const cookieEmail = await getEmailFromCookie();
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;

    const email = body.email || cookieEmail;

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
    }

    // --- Zgody (walidacja po stronie serwera) ---
    const acceptedTerms = body.acceptedTerms === true;
    const acceptedImmediate = body.acceptedImmediate === true;

    if (!acceptedTerms) {
    return NextResponse.json(
        { error: "Wymagana jest akceptacja Regulaminu i Polityki prywatności." },
        { status: 400 }
      );
    }

    if (!acceptedImmediate) {
      return NextResponse.json(
        {
          error:
            "Wymagana jest zgoda na natychmiastowy dostęp do treści cyfrowej i przyjęcie skutków dla prawa odstąpienia.",
        },
        { status: 400 }
      );
}

    const acceptedAt = new Date().toISOString();

    const ORIGINAL = Number(process.env.STRIPE_COURSE_ORIGINAL_PLN ?? "20000");
    const PRICE = Number(process.env.STRIPE_COURSE_PRICE_PLN ?? "14900");
    const productName =
      process.env.STRIPE_COURSE_NAME ||
      "Plan odzyskania bliskości – pełen dostęp online";

    const unitAmount = Number(process.env.STRIPE_COURSE_AMOUNT_PLN ?? PRICE);

    // Zawsze jedna licencja (prywatny dostęp). Ilość z żądania jest ignorowana.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pl",
      success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/checkout?canceled=1`,
      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: unitAmount,
            product_data: { name: productName },
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      allow_promotion_codes: true,
      // Metadata mają limit długości — zapisujemy tu skróty + wersje,
      // a pełną treść zapisujemy w tabeli order_consents (poniżej).
      metadata: {
        kind: "course",
        version: "online",
        user_email: email,
        qty: "1",
        licenses: "1",
        catalog_original: String(ORIGINAL),
        consent_terms: "1",
        consent_terms_version: TERMS_VERSION,
        consent_immediate: "1",
        consent_immediate_version: IMMEDIATE_ACCESS_VERSION,
        consents_accepted_at: acceptedAt,
      },
    });

    // Zapis zgód (data + pełna treść). Błąd zapisu nie blokuje płatności,
    // ale logujemy go głośno, bo to materiał dowodowy.
    if (session.id) {
      const { error: consentErr } = await supabaseAdmin.from("order_consents").insert([
        {
          stripe_session_id: session.id,
          user_email: email,
          product: "online",
          terms_accepted: true,
          terms_text: TERMS_CONSENT_TEXT,
          terms_version: TERMS_VERSION,
          terms_accepted_at: acceptedAt,
          immediate_access_accepted: true,
          immediate_access_text: IMMEDIATE_ACCESS_CONSENT_TEXT,
          immediate_access_version: IMMEDIATE_ACCESS_VERSION,
          immediate_access_at: acceptedAt,
        },
      ]);
      if (consentErr) {
        console.error("[checkout] order_consents insert error:", consentErr);
      }
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { error: err?.message || "Stripe error" },
      { status: 400 }
    );
  }
}
