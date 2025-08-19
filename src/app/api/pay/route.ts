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
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-07-30.basil" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/success`,
    cancel_url: `${origin}/checkout?canceled=1`,
    line_items: [
      {
        price_data: {
          currency: "pln",
          unit_amount: body.subtotal, // grosze
          product_data: { name: "Pełen Dostęp do Przewodnika" },
        },
        quantity: body.qty ?? 1,
      },
    ],
    customer_email: email || undefined,
    metadata: { user_email: email || "" }, // fallback dla webhooka
  });

  return NextResponse.json({ url: session.url });
}
