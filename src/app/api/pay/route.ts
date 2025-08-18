import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

async function getEmailFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );
  return payload.email ? String(payload.email) : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const emailFromBody = typeof body.email === "string" ? body.email : "";
    const qty = typeof body.qty === "number" ? body.qty : 1;
    const coupon = typeof body.coupon === "string" ? body.coupon : "";
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;
    const discount = typeof body.discount === "number" ? body.discount : 0;
    const shipping = typeof body.shipping === "number" ? body.shipping : 0;
    const total = typeof body.total === "number" ? body.total : 0;
    const product_id = (typeof body.product_id === "string" ? body.product_id : "plan-premium");
    const product_name = (typeof body.product_name === "string" ? body.product_name : "Pełen Dostęp do Przewodnika");

    const email = emailFromBody || (await getEmailFromCookie()) || "";

    const amount = total > 0 ? total : Math.max(0, subtotal + shipping - discount);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "pln",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: amount,
            product_data: { name: product_name },
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_email: email,
        product_id,
        qty: String(qty),
        coupon: String(coupon),
        subtotal: String(subtotal),
        discount: String(discount),
        shipping: String(shipping),
        total: String(amount),
      },
      customer_email: email || undefined,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/pay] error:", msg);
    return NextResponse.json({ error: msg || "Internal Error" }, { status: 500 });
  }
}
