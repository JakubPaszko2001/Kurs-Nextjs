// src/app/api/admin/update/route.ts
// Edycja pojedynczego zlecenia (book_orders) lub konta (users).
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Dopuszczalne kolumny do edycji – chroni przed dowolnym UPDATE.
const BOOK_FIELDS = [
  "status",
  "customer_name",
  "customer_phone",
  "shipping_name",
  "shipping_phone",
  "shipping_address_line1",
  "shipping_city",
  "shipping_postal_code",
  "shipping_country",
  "shipping_method",
  "inpost_city",
  "inpost_locker",
  "email",
];

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const table = body.table;
    const id = body.id;
    const patch = body.patch;

    if (!id || !patch || typeof patch !== "object") {
      return NextResponse.json({ error: "Brak id/patch." }, { status: 400 });
    }

    if (table === "book_orders") {
      const update: Record<string, any> = {};
      for (const k of BOOK_FIELDS) {
        if (k in patch) update[k] = patch[k];
      }
      if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: "Brak dozwolonych pól." }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from("book_orders")
        .update(update)
        .eq("id", id);
      if (error) {
        console.error("[admin/update] book_orders:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (table === "users") {
      const update: Record<string, any> = {};
      if ("status" in patch) {
        if (!["paid", "unpaid"].includes(patch.status)) {
          return NextResponse.json({ error: "Nieprawidłowy status." }, { status: 400 });
        }
        update.status = patch.status;
      }
      if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: "Brak dozwolonych pól." }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from("users")
        .update(update)
        .eq("id", id);
      if (error) {
        console.error("[admin/update] users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Nieznana tabela." }, { status: 400 });
  } catch (e) {
    console.error("[admin/update] error:", e);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
