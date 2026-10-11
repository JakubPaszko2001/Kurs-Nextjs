// src/app/api/confirm/route.ts
// Weryfikacja płatności po powrocie z Stripe Checkout.
// Działa jako fallback/uzupełnienie webhooka: sprawdza sesję bezpośrednio
// w Stripe API i nadaje dostęp (status = "paid") dla kursu.
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Brak session_id" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[confirm] Missing STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, paid: false, status: session.payment_status },
        { status: 200 }
      );
    }

    const email =
      session.metadata?.user_email || session.customer_details?.email || "";

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Brak e-maila na sesji" },
        { status: 200 }
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({ status: "paid" })
      .eq("email", email);

    if (error) {
      console.error("[confirm] supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[confirm] status=paid set for", email);
    return NextResponse.json({ ok: true, paid: true, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[confirm] error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
