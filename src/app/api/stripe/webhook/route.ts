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

  const stripe = new Stripe(stripeKey);

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

            // Zamówienie książki (dane zapisane wcześniej przez /api/book/order)
      if (session.metadata?.kind === "physical_book") {
        // Pełna sesja (kwoty, customer, payment_intent)
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items", "customer", "payment_intent"],
        });

        const customer = full.customer as Stripe.Customer | null;

        const email =
          full.customer_details?.email ??
          (customer?.email as string | undefined) ??
          session.metadata?.user_email ??
          "";

        const qtyFromMeta = Number(full.metadata?.qty || 0);
        const qtyFromItems =
          (full.line_items?.data?.[0]?.quantity as number | undefined) || 1;
        const qty =
          Number.isFinite(qtyFromMeta) && qtyFromMeta > 0 ? qtyFromMeta : qtyFromItems;

        const amountSubtotal = full.amount_subtotal ?? null;
        const amountTotal = full.amount_total ?? null;
        const amountShipping =
          full.shipping_cost?.amount_total ??
          (full as any).total_details?.amount_shipping ??
          null;
        const currency = full.currency ?? "pln";

        const stripeFields = {
          stripe_payment_intent:
            typeof full.payment_intent === "string"
              ? full.payment_intent
              : full.payment_intent?.id || null,
          stripe_customer_id: (full.customer as string) || customer?.id || null,
          amount_subtotal: amountSubtotal,
          amount_total: amountTotal,
          amount_shipping: amountShipping,
          currency,
          status: "paid" as const,
        };

        // 1) Wiersz istnieje (zapisany przez /api/book/order) -> tylko aktualizacja.
        const { data: updated, error: updErr } = await supabaseAdmin
          .from("book_orders")
          .update(stripeFields)
          .eq("stripe_session_id", full.id)
          .select("id");

        if (updErr) {
          console.error("[webhook] book_orders update error:", updErr);
        } else if (updated && updated.length > 0) {
          console.log("[webhook] book_orders -> paid for", email);
        } else {
          // 2) Brak wiersza -> tworzymy awaryjnie z danych Stripe.
          const sName =
            full.customer_details?.name ?? (customer?.name as string) ?? "";
          const sPhone =
            full.metadata?.customer_phone ??
            full.customer_details?.phone ??
            (customer?.phone as string) ??
            "";
          const shipSource = (customer as any)?.shipping || null;
          const sAddr = shipSource?.address || null;

          const fallbackRow = {
            stripe_session_id: full.id,
            ...stripeFields,
            email,
            customer_name: full.metadata?.customer_name || sName,
            customer_phone: sPhone,
            shipping_method: full.metadata?.shipping_method || "courier",
            shipping_name: sName,
            shipping_phone: sPhone,
            shipping_address_line1:
              full.metadata?.address_line1 || (sAddr?.line1 as string) || "",
            shipping_city:
              full.metadata?.address_city || (sAddr?.city as string) || "",
            shipping_postal_code:
              full.metadata?.address_postal_code ||
              (sAddr?.postal_code as string) ||
              "",
            shipping_country:
              full.metadata?.address_country ||
              (sAddr?.country as string) ||
              "PL",
            inpost_city: full.metadata?.inpost_city || null,
            inpost_locker: full.metadata?.inpost_locker || null,
            qty,
          };

          const { error: insErr } = await supabaseAdmin
            .from("book_orders")
            .insert([fallbackRow]);

          if (insErr) {
            console.error("[webhook] book_orders fallback insert error:", insErr);
          } else {
            console.warn("[webhook] book_orders created from Stripe (brak pending) for", email);
          }
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

        // Zgody: jeśli z jakiegoś powodu nie zapisano ich przy tworzeniu sesji,
        // dopisujemy wiersz na podstawie metadata (data = moment akceptacji).
        const acceptedAt =
          (session.metadata?.consents_accepted_at as string) ||
          new Date().toISOString();
        if (userEmail && session.metadata?.consent_terms === "1") {
          const { error: consentErr } = await supabaseAdmin
            .from("order_consents")
            .upsert(
              {
                stripe_session_id: session.id,
                user_email: userEmail,
                product: "online",
                terms_accepted: true,
                terms_version:
                  (session.metadata?.consent_terms_version as string) || null,
                terms_accepted_at: acceptedAt,
                immediate_access_accepted:
                  session.metadata?.consent_immediate === "1",
                immediate_access_version:
                  (session.metadata?.consent_immediate_version as string) || null,
                immediate_access_at:
                  session.metadata?.consent_immediate === "1"
                    ? acceptedAt
                    : null,
              },
              { onConflict: "stripe_session_id", ignoreDuplicates: true }
            );
          if (consentErr) {
            console.error("[webhook] order_consents upsert error:", consentErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhook] handler error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
