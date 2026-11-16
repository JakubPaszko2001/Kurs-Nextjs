// src/app/lib/password.ts
// Bezpieczne hashowanie haseł (scrypt z Node – bez zewnętrznych zależności)
// oraz tokenów resetu (SHA-256).
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

const SCRYPT_KEYLEN = 64;

/** Generuje hash hasła w formacie: scrypt$<saltHex>$<hashHex> */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

/**
 * Weryfikuje hasło. Obsługuje:
 *  - hash nowego formatu (scrypt$...),
 *  - stary plaintext (konta sprzed migracji) – porównanie stałoczasowe.
 */
export function verifyPassword(password: string, stored: string | null): boolean {
  if (!stored) return false;
  if (stored.startsWith("scrypt$")) {
    const [, saltHex, hashHex] = stored.split("$");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
  // stary plaintext – porównanie stałoczasowe
  const a = Buffer.from(stored);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Czy zapis to już nowy hash (do migracji po zalogowaniu). */
export function isHashed(stored: string | null): boolean {
  return !!stored && stored.startsWith("scrypt$");
}

/** Losowy sekret tokenu resetu (do linku w mailu). */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

/** SHA-256 tokenu – to zapisujemy w bazie (nigdy plaintext tokenu). */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
