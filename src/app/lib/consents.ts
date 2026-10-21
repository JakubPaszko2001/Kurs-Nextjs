// src/app/lib/consents.ts
// Centralne, WERSJONOWANE teksty zgód wymaganych przy zakupie produktu cyfrowego.
// ⚠️ Tekst prawny — DO ZATWIERDZENIA przez prawnika przed publikacją.
// Przy zmianie treści ZWIĘKSZ wersję (np. 1.0 -> 1.1), żeby w bazie dało się
// odtworzyć, jaką dokładnie treść zaakceptował klient w danym momencie.

export const TERMS_VERSION = "1.0";

export const TERMS_CONSENT_TEXT =
  "Akceptuję Regulamin oraz Politykę prywatności serwisu i przyjmuję je do wiadomości.";

export const IMMEDIATE_ACCESS_VERSION = "1.0";

export const IMMEDIATE_ACCESS_CONSENT_TEXT =
  "Żądam rozpoczęcia dostarczania treści cyfrowej (dostępu online do przewodnika) " +
  "natychmiast, przed upływem terminu do odstąpienia od umowy. Przyjmuję do wiadomości, " +
  "że po rozpoczęciu świadczenia tracę ustawowe prawo odstąpienia od umowy w zakresie " +
  "treści cyfrowych dostarczanych bez nośnika materialnego (art. 38 pkt 13 ustawy o " +
  "prawach konsumenta).";

/** Etykiety zgód (krótkie) — do wyświetlenia jako podpis zgody. */
export const TERMS_CONSENT_LABEL = "regulamin_polityka";
export const IMMEDIATE_ACCESS_CONSENT_LABEL = "natychmiastowy_dostep";
