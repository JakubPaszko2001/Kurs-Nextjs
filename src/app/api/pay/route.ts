import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-04-30.basil" });

async function getEmailFromCookie(): Promise<string | null> {
  try {
    const token = cookies().get("session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return (payload.email as string) || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // 1) Preferuj e-mail z cookie (zalogowany), w ostateczności z body
    const cookieEmail = await getEmailFromCookie();
    const uiEmail = (body?.email as string | undefined)?.trim();
    const email = cookieEmail || uiEmail || "";

    // 2) (Opcja rekomendowana) Zmapuj użytkownika na Stripe Customer
    let customerId: string | undefined;
    if (email) {
      const found = await stripe.customers.list({ email, limit: 1 });
      customerId =
        found.data[0]?.id ||
        (await stripe.customers.create({ email })).id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // UŻYJ JEDNEGO z poniższych:
      ...(customerId
        ? { customer: customerId }           // lepsza opcja: przypięty customer
        : email
        ? { customer_email: email }          // fallback: tylko prefill e-maila
        : {}),

      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: 14900,
            product_data: { name: "Pełen Dostęp do Przewodnika" },
          },
          quantity: body?.qty ?? 1,
        },
      ],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/checkout?canceled=1`,
      locale: "pl",
      metadata: {
        user_email: email || "",            // pomocne dla webhooka
        shipping: String(body?.shipping ?? "standard"),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/pay] error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
