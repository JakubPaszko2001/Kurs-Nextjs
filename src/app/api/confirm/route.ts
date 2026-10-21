// src/app/api/confirm/route.ts
// Weryfikacja płatności po powrocie z Stripe Checkout.
// Działa jako fallback/uzupełnienie webhooka: sprawdza sesję bezpośrednio
// w Stripe API i nadaje dostęp (status = "paid") dla kursu.
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ConsentInfo = {
  terms_accepted_at: string | null;
  terms_text: string | null;
  immediate_access_at: string | null;
  immediate_access_text: string | null;
};

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

    // Potwierdzenie zapisanych zgód (data + treść) — do wyświetlenia na /success.
    // Najpierw wiersz zapisany przy tworzeniu sesji, w razie braku — upsert z metadata.
    let consent: ConsentInfo | null = null;












    const acceptedAt =
      (session.metadata?.consents_accepted_at as string) || new Date().toISOString();

    if (session.metadata?.consent_terms === "1") {
      await supabaseAdmin
        .from("order_consents")
        .upsert(
          {
            stripe_session_id: session.id,
            user_email: email,
            product: "online",
            terms_accepted: true,
            terms_version:
              (session.metadata?.consent_terms_version as string) || null,
            terms_accepted_at: acceptedAt,
            immediate_access_accepted: session.metadata?.consent_immediate === "1",
            immediate_access_version:
              (session.metadata?.consent_immediate_version as string) || null,
            immediate_access_at:
              session.metadata?.consent_immediate === "1" ? acceptedAt : null,
          },
          { onConflict: "stripe_session_id", ignoreDuplicates: true }
        );
    }

    const { data: consentRow } = await supabaseAdmin
      .from("order_consents")
      .select(
        "terms_accepted_at, terms_text, immediate_access_at, immediate_access_text"
      )
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (consentRow) consent = consentRow as ConsentInfo;

    return NextResponse.json({ ok: true, paid: true, email, consent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[confirm] error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
