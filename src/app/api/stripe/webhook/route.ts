import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // nie próbuj niczego prerendrować
export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // ⬇️ Inicjalizacja TUTAJ, wewnątrz handlera
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-07-30.basil" });

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

      const email =
        (session.metadata && (session.metadata["user_email"] as string)) ||
        session.customer_details?.email ||
        "";

      if (email) {
        const { error } = await supabaseAdmin
          .from("users")
          .update({ status: "paid" })
          .eq("email", email);

        if (error) console.error("[webhook] supabase update error:", error);
        else console.log("[webhook] status=paid set for", email);
      } else {
        console.warn("[webhook] no email on session");
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhook] handler error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


