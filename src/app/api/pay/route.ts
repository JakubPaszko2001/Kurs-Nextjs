import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const dynamic = "force-dynamic";

async function getEmailFromCookie(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (!token) return null;

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );
  const p = payload as Record<string, unknown>;
  return typeof p.email === "string" ? p.email : null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // weź email z cookie gdy brak w body
  const email = body.email || (await getEmailFromCookie()) || "";

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("Missing STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const stripe = new Stripe(stripeKey);

  const unitAmount = Number(body.subtotal);
  if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
    return NextResponse.json({ error: "Nieprawidłowa kwota zamówienia." }, { status: 400 });
  }

  try {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?canceled=1`,
    line_items: [
      {
        price_data: {
          currency: "pln",
            unit_amount: unitAmount, // grosze
          product_data: { name: "Plan odzyskania bliskości – pełen dostęp" },
        },
        quantity: body.qty ?? 1,
      },
    ],
    customer_email: email || undefined,
    metadata: { user_email: email || "" }, // fallback dla webhooka
  });

  return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[pay] stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
}
}

