// src/app/api/book/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const dynamic = "force-dynamic";

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

    // Użyj stabilnej wersji Stripe API
    const stripe = new Stripe(secret, { apiVersion: "2025-07-30.basil" });
    const url = baseUrl(req);

    const cookieEmail = await getEmailFromCookie();
    const body = await req.json().catch(() => ({}));

    const {
      email = cookieEmail,
      name,
      phone,

      shipping,        // "courier" | "inpost"
      courierRate,     // "standard" | "express"

      // adres dla kuriera
      addressLine1,
      city,
      postalCode,
      country = "PL",

      // InPost
      lockerCity,
      lockerId,
    } = body as Record<string, any>;

    // ===== Walidacja wymaganych pól =====
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
    }
    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Imię i nazwisko są wymagane." }, { status: 400 });
    }
    if (!phone || !/^\+?\d{9,15}$/.test(String(phone))) {
      return NextResponse.json({ error: "Telefon jest wymagany." }, { status: 400 });
    }
    if (shipping === "courier") {
      if (!addressLine1 || !postalCode || !city) {
        return NextResponse.json({ error: "Uzupełnij adres dla kuriera." }, { status: 400 });
      }
    } else if (shipping === "inpost") {
      if (!lockerId) {
        return NextResponse.json({ error: "Brak wybranego paczkomatu." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Nieprawidłowy typ dostawy." }, { status: 400 });
    }

    // ===== Produkt =====
    const priceId = process.env.STRIPE_BOOK_PRICE_ID || undefined;
    const amountFallback = Number(process.env.STRIPE_BOOK_AMOUNT_PLN || "9900"); // 99,00 zł
    const productName = process.env.STRIPE_BOOK_NAME || "Książka w okładce";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [{
          quantity: 1,
          price_data: {
            currency: "pln",
            unit_amount: amountFallback,
            product_data: { name: productName },
          },
        }];

    // ===== Wysyłka =====
    const courierStd  = Number(process.env.STRIPE_SHIP_COURIER_STANDARD_PLN ?? "0");
    const courierExp  = Number(process.env.STRIPE_SHIP_COURIER_EXPRESS_PLN ?? "1900");
    const inpostPrice = Number(process.env.STRIPE_SHIP_INPOST_PLN           ?? "1200");

    let shipping_address_collection:
      | Stripe.Checkout.SessionCreateParams.ShippingAddressCollection
      | undefined;
    let shipping_options:
      | Stripe.Checkout.SessionCreateParams.ShippingOption[]
      | undefined;

    const metadata: Record<string, string> = {
      kind: "physical_book",
      user_email: String(email),
      shipping_method: shipping,
    };

    if (shipping === "inpost") {
      metadata.inpost_locker = String(lockerId);
      if (lockerCity) metadata.inpost_city = String(lockerCity);

      shipping_address_collection = { allowed_countries: ["PL"] };
      shipping_options = [{
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Paczkomat InPost",
          fixed_amount: { currency: "pln", amount: inpostPrice },
        },
      }];
    } else {
      shipping_address_collection = {
        allowed_countries: [
          "PL","DE","CZ","SK","AT","NL","BE","GB","FR","IE","DK","SE","NO","US",
        ],
      };
      const rate =
        courierRate === "express"
          ? {
              display_name: "Kurier – ekspres (1–2 dni)",
              fixed_amount: { currency: "pln", amount: courierExp },
            }
          : {
              display_name: "Kurier – standard (3–5 dni)",
              fixed_amount: { currency: "pln", amount: courierStd },
            };
      shipping_options = [{ shipping_rate_data: { type: "fixed_amount", ...rate } }];
    }

    // ===== Customer: znajdź/stwórz + prefill imienia/telefonu/adresu =====
    let customerId: string | undefined;

    const found = await stripe.customers.list({ email, limit: 1 });
    const customer =
      found.data[0] ??
      (await stripe.customers.create({
        email,
        name,
        phone, // top-level phone (prefill górnego pola Checkout)
      }));

    customerId = customer.id;

    // uaktualnij top-level, gdy klient istniał
    const toUpdate: Stripe.CustomerUpdateParams = {};
    if (customer.name !== name)  toUpdate.name  = name;
    if (customer.phone !== phone) toUpdate.phone = phone;
    if (Object.keys(toUpdate).length) {
      await stripe.customers.update(customerId, toUpdate);
    }

    // prefill sekcji adresu wysyłki (pole „Imię i nazwisko” i „Telefon”)
    if (shipping === "courier") {
      await stripe.customers.update(customerId, {
        shipping: {
          name,
          phone,
          address: {
            line1:       addressLine1,
            city,
            postal_code: postalCode,
            country,
          },
        },
      });
    }

    // ===== customer XOR (customer_email + customer_creation) =====
    const whoIsPaying: Partial<Stripe.Checkout.SessionCreateParams> = {
      customer: customerId,
    };

    // ===== Sesja Checkout =====
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "pl",
      line_items,
      success_url: `${url}/book/success`,
      cancel_url:  `${url}/book/cancel`,

      ...whoIsPaying, // używamy istniejącego/utworzonego klienta

      // pozwól edytować prefillowane dane
      customer_update: { address: "auto", shipping: "auto", name: "auto" },

      shipping_address_collection,
      shipping_options,

      phone_number_collection: { enabled: true },
      billing_address_collection: "required",
      allow_promotion_codes: true,

      metadata,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("[book/checkout] error:", err);
    return NextResponse.json(
      { error: err?.message || "Stripe error" },
      { status: 400 }
    );
  }
}
