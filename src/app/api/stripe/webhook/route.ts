// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Dla przypadkowych wejść w przeglądarce / pingów
export async function GET() {
  return NextResponse.json({ ok: true });
}
export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    // POST bez podpisu – to NIE jest wywołanie ze Stripe.
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[webhook] constructEvent error:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Zamówienie książki (ustawiasz w /api/book/checkout)
      if (session.metadata?.kind === "physical_book") {
        // Pobieramy pełną sesję (z customer, line_items, payment_intent)
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items", "customer", "payment_intent"],
        });

        const customer = full.customer as Stripe.Customer | null;
        const pi =
          typeof full.payment_intent === "string"
            ? null
            : (full.payment_intent as Stripe.PaymentIntent | null);

        // Dane klienta
        const email =
          full.customer_details?.email ??
          (customer?.email as string | undefined) ??
          session.metadata?.user_email ??
          "";

        const customerName =
          full.customer_details?.name ??
          (customer?.name as string | undefined) ??
          "";

        const customerPhone =
          full.customer_details?.phone ??
          (customer?.phone as string | undefined) ??
          "";

        // Ilość (z metadata lub line items)
        const qtyFromMeta = Number(full.metadata?.qty || 0);
        const qtyFromItems =
          (full.line_items?.data?.[0]?.quantity as number | undefined) || 1;
        const qty =
          Number.isFinite(qtyFromMeta) && qtyFromMeta > 0 ? qtyFromMeta : qtyFromItems;

        // Adres wysyłki: 1) PaymentIntent.shipping 2) Customer.shipping
        const piShipping = pi?.shipping || null;
        const custShipping = (customer as any)?.shipping || null;

        const shipSource = piShipping || custShipping || null;

        const sName = (shipSource?.name as string) || customerName || "";
        const sPhone = (shipSource?.phone as string) || customerPhone || "";
        const sAddr = shipSource?.address || null;

        const shipLine1 = (sAddr?.line1 as string) || "";
        const shipCity = (sAddr?.city as string) || "";
        const shipPostal = (sAddr?.postal_code as string) || "";
        const shipCountry = (sAddr?.country as string) || "PL";

        // Kwoty / waluta
        const amountSubtotal = full.amount_subtotal ?? null;
        const amountTotal = full.amount_total ?? null;
        const amountShipping =
          full.shipping_cost?.amount_total ??
          (full as any).total_details?.amount_shipping ??
          null;
        const currency = full.currency ?? "pln";

        const orderRow = {
          stripe_session_id: full.id,
          stripe_payment_intent:
            typeof full.payment_intent === "string"
              ? full.payment_intent
              : full.payment_intent?.id || null,
          stripe_customer_id:
            (full.customer as string) || customer?.id || null,

          email,
          customer_name: customerName,
          customer_phone: customerPhone,

          shipping_method: full.metadata?.shipping_method || "courier",
          shipping_name: sName,
          shipping_phone: sPhone,
          shipping_address_line1: shipLine1,
          shipping_city: shipCity,
          shipping_postal_code: shipPostal,
          shipping_country: shipCountry,

          inpost_city: full.metadata?.inpost_city || null,
          inpost_locker: full.metadata?.inpost_locker || null,

          qty,
          amount_subtotal: amountSubtotal,
          amount_total: amountTotal,
          amount_shipping: amountShipping,
          currency,
          status: "paid" as const,
        };

        const { error } = await supabaseAdmin
          .from("book_orders")
          .upsert(orderRow, { onConflict: "stripe_session_id" });

        if (error) {
          console.error("[webhook] supabase upsert book_orders error:", error);
        } else {
          console.log("[webhook] book_orders saved for", email, "qty:", qty);
        }
      } else {
        // Kurs: oznacz użytkownika jako paid (jak miałeś wcześniej)
        const userEmail =
          (session.metadata && (session.metadata["user_email"] as string)) ||
          session.customer_details?.email ||
          "";

        if (userEmail) {
          const { error } = await supabaseAdmin
            .from("users")
            .update({ status: "paid" })
            .eq("email", userEmail);

          if (error) console.error("[webhook] users update error:", error);
          else console.log("[webhook] status=paid set for", userEmail);
        } else {
          console.warn("[webhook] no email on session (course)");
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhook] handler error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
