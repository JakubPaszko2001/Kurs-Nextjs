// src/app/api/book/order/route.ts
// Zapisuje wstępne zamówienie książki (status: "pending") do Supabase PRZED
// przekierowaniem do Stripe. Dzięki temu dane z formularza (imię, telefon,
// adres / paczkomat) są zapisywane niezawodnie — bez polegania na Stripe metadata.
//
// Webhook Stripe po opłaceniu zmienia tylko status "pending" -> "paid".

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

const isEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const cookieEmail = await getEmailFromCookie();

    const email = body.email || cookieEmail;
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const qty = Math.min(10, Math.max(1, Number(body.qty) || 1));
    const shipping = body.shipping; // "courier" | "inpost"
    const courierRate = body.courierRate;
    const addressLine1 = String(body.addressLine1 || "");
    const city = String(body.city || "");
    const postalCode = String(body.postalCode || "");
    const country = String(body.country || "PL");
    const lockerCity = String(body.lockerCity || "");
    const lockerId = String(body.lockerId || "");

    // Stripe session id przekazujemy po utworzeniu sesji (opcjonalnie)
    const stripeSessionId = body.stripeSessionId
      ? String(body.stripeSessionId)
      : null;

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Imię i nazwisko są wymagane." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Telefon jest wymagany." }, { status: 400 });
    }
    if (shipping === "courier" && (!addressLine1 || !postalCode || !city)) {
      return NextResponse.json({ error: "Uzupełnij adres dla kuriera." }, { status: 400 });
    }
    if (shipping === "inpost" && !lockerId) {
      return NextResponse.json({ error: "Wybierz Paczkomat InPost." }, { status: 400 });
    }

    const row: Record<string, any> = {
      email,
      customer_name: name,
      customer_phone: phone,
      shipping_method: shipping || "courier",
      shipping_name: name,
      shipping_phone: phone,
      inpost_city: shipping === "inpost" ? lockerCity || null : null,
      inpost_locker: shipping === "inpost" ? lockerId || null : null,
      qty,
      status: "pending",
    };

    if (shipping === "courier") {
      row.shipping_address_line1 = addressLine1;
      row.shipping_city = city;
      row.shipping_postal_code = postalCode;
      row.shipping_country = country;
    }

    if (stripeSessionId) {
      row.stripe_session_id = stripeSessionId;
    }

    // Jeśli mamy stripe_session_id -> upsert po nim; w przeciwnym razie zwykły insert
    let error;
    if (stripeSessionId) {
      ({ error } = await supabaseAdmin
        .from("book_orders")
        .upsert(row, { onConflict: "stripe_session_id" }));
    } else {
      ({ error } = await supabaseAdmin.from("book_orders").insert([row]));
    }

    if (error) {
      console.error("[book/order] supabase error:", error);
      return NextResponse.json({ error: "Błąd zapisu zamówienia." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[book/order] error:", e);
    return NextResponse.json({ error: e?.message || "Błąd serwera" }, { status: 500 });
  }
}
