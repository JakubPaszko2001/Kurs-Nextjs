import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side key
);

async function getAuthEmail(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const email = (payload as any)?.email;
    return typeof email === "string" ? email : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userEmail = await getAuthEmail();
  if (!userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { partnerEmail, cadenceDays = 3 } = await req.json().catch(() => ({}));

  if (!partnerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail)) {
    return NextResponse.json({ error: "Podaj poprawny e-mail partnera." }, { status: 400 });
  }
  const days = Math.min(30, Math.max(1, Number(cadenceDays) || 3));

  const { error } = await supabase.from("partner_mailings").insert([
    {
      user_email: userEmail,
      partner_email: partnerEmail,
      cadence_days: days,
      current_chapter: 1,
      next_send_at: new Date().toISOString(), // pierwszy mail wyśle cron
      status: "active",
    },
  ]);

  if (error) {
    console.error("[partner-mail:schedule] supabase error", error);
    return NextResponse.json({ error: "Błąd zapisu do bazy." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
