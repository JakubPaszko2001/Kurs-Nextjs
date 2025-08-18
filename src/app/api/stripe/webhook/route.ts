import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
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

        if (error) {
          console.error("[webhook] supabase update error:", error);
        } else {
          console.log("[webhook] status=paid set for", email);
        }
      } else {
        console.warn("[webhook] no email on session");
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[webhook] handler error:", msg);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
