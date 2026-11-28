// src/app/api/admin/data/route.ts
// Zwraca dane do panelu admina (zlecenia książkowe + konta kursu + statystyki).
import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [bookRes, usersRes] = await Promise.all([
    supabaseAdmin
      .from("book_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
    supabaseAdmin
      .from("users")
      .select("id, email, status, price, price_original, price_list, coupon_code, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const bookOrders = bookRes.data ?? [];
  const users = usersRes.data ?? [];

  const stats = {
    bookTotal: bookOrders.length,
    bookPaid: bookOrders.filter((o: any) => o.status === "paid").length,
    bookPending: bookOrders.filter((o: any) => o.status !== "paid").length,
    usersTotal: users.length,
    usersPaid: users.filter((u: any) => u.status === "paid").length,
    usersUnpaid: users.filter((u: any) => u.status !== "paid").length,
  };

  return NextResponse.json({
    bookOrders,
    users,
    stats,
    errors: {
      book: bookRes.error?.message ?? null,
      users: usersRes.error?.message ?? null,
    },
  });
}
