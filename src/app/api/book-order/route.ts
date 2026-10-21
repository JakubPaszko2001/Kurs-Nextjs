// src/app/api/book-order/route.ts
// Zamówienie wersji drukowanej (99 zł) + dostawa.
// Kwoty i opcje dostawy pokazujemy PRZED zapłatą na stronie /book-order,
// a serwer liczy je z tych samych zmiennych środowiskowych (spójność).
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BOOK_PRICE = Number(process.env.BOOK_PRICE_PLN ?? "9900"); // 99,00 zł
const COURIER_STD = Number(process.env.SHIP_COURIER_STANDARD_PLN ?? "490");
const COURIER_EXP = Number(process.env.SHIP_COURIER_EXPRESS_PLN ?? "1990");

const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function baseUrl(req: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000"
  );
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    const stripe = new Stripe(secret);
    const url = baseUrl(req);

    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const email = String(body.email || "").trim();
    const name = String(body.name || "").trim();
    const shipping = body.shipping === "express" ? "express" : "standard";
    const lockerId = String(body.lockerId || "").trim();
    const addressLine1 = String(body.addressLine1 || "").trim();
    const postalCode = String(body.postalCode || "").trim();
    const city = String(body.city || "").trim();

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Podaj imię i nazwisko." }, { status: 400 });
    }
    if (addressLine1 && (!postalCode || !city)) {
      return NextResponse.json({ error: "Uzupełnij pełny adres." }, { status: 400 });
    }

    const shipCost = shipping === "express" ? COURIER_EXP : COURIER_STD;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pl",
      success_url: `${url}/book-order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/book-order?canceled=1`,
      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: BOOK_PRICE,
            product_data: { name: "Poradnik – wersja drukowana" },
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["PL", "DE", "CZ", "SK", "AT"],
      },
      allow_promotion_codes: true,
      metadata: {
        kind: "physical_book",
        book_version: "print",
        user_email: email,
        customer_name: name,
        shipping_rate: shipping,
        locker_id: lockerId,
        address_line1_prefill: addressLine1,
        postal_code_prefill: postalCode,
        city_prefill: city,
        catalog_price: String(BOOK_PRICE),
        shipping_cost_shown: String(shipCost),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name:
              shipping === "express"
                ? "Kurier – ekspres (1–2 dni)"
                : "Kurier – standard (3–5 dni)",
            fixed_amount: { currency: "pln", amount: shipCost },
          },
        },
      ],
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("[book-order] error:", err);
    return NextResponse.json({ error: err?.message || "Stripe error" }, { status: 400 });
  }
}

// Podgląd cen dla klienta (aby strona pokazała je PRZED zapłatą)
export async function GET() {
  return NextResponse.json({
    price: BOOK_PRICE,
    shippingStandard: COURIER_STD,
    shippingExpress: COURIER_EXP,
    currency: "pln",
  });
}
