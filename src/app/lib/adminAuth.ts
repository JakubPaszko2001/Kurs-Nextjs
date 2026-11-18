// src/app/lib/adminAuth.ts
// Sesja administratora: hasło z env (ADMIN_PASSWORD) lub fallback.
// Porównanie stałoczasowe + cookie JWT httpOnly (analogicznie do sesji usera).
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "admin_session";
const ADMIN_TTL_SEC = 60 * 60 * 8; // 8 h

function secretKey() {
  // Klucz do podpisu cookie admina – najlepiej osobny, ale może użyć JWT_SECRET.
  const s = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || "admin-dev-secret";
  return new TextEncoder().encode(s);
}

/** Hasło admina z env; fallback zgodny z ustaleniem. */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admincozrobic.pl";
}

/** Bezpieczne porównanie haseł (stały czas). */
export function checkAdminPassword(input: string): boolean {
  const expected = Buffer.from(adminPassword());
  const actual = Buffer.from(input || "");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TTL_SEC}s`)
    .sign(secretKey());
}

/** Czy bieżące żądanie ma ważne cookie admina. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload?.role === "admin";
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
export const ADMIN_MAX_AGE = ADMIN_TTL_SEC;
