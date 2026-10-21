// src/app/lib/session.ts
// Pomocnicze funkcje serwerowe: odczyt e-maila z cookie sesji (JWT)
// oraz sprawdzenie, czy konto ma aktywny dostęp (status = "paid").
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseAdmin } from "./supabaseAdmin";

export async function getSessionEmail(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const email = (payload as any)?.email;
    return typeof email === "string" && email ? email : null;
  } catch {
    return null;
  }
}

export async function isPaidUser(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("status")
    .eq("email", email)
    .maybeSingle();
  if (error) return false;
  return data?.status === "paid";
}
