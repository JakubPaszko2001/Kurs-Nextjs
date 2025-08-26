// src/app/book/CheckoutForm.tsx
"use client";

import { useMemo, useState } from "react";
import InpostSelect from "./InpostSelect";

// ===== Helpers telefonu (PL) =====
const toE164PL = (raw: string) => {
  // "500 600 700" -> "+48500600700"
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("0048")) d = d.slice(2); // 0048xxxxxxxxx -> 48xxxxxxxxx
  if (d.startsWith("48") && d.length === 11) return `+${d}`;
  // akceptuj 9–11 cyfr, bierz ostatnie 9 jako lokalny numer
  if (d.length >= 9) return `+48${d.slice(-9)}`;
  return `+48${d}`; // fallback
};

const formatPLGroups = (raw: string) => {
  // prezentacja jako "500 600 700"
  const d = (raw || "").replace(/\D/g, "").slice(0, 9);
  return d.replace(/(\d{3})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(" ")
  );
};

// ===== Format PLN =====
const formatPLN = (v: number) =>
  (v / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

// Ceny (możesz nadpisać publicznymi ENV)
const ORIGINAL = Number(process.env.NEXT_PUBLIC_BOOK_ORIGINAL_PLN ?? "20000"); // 200,00 zł
const PRICE    = Number(process.env.NEXT_PUBLIC_BOOK_PRICE_PLN    ?? "9900");  // 99,00 zł

// Dostawa (publiczne ENV też działają)
const COURIER_STD = Number(process.env.NEXT_PUBLIC_SHIP_COURIER_STANDARD_PLN ?? "0");
const COURIER_EXP = Number(process.env.NEXT_PUBLIC_SHIP_COURIER_EXPRESS_PLN ?? "1900");
const INPOST      = Number(process.env.NEXT_PUBLIC_SHIP_INPOST_PLN           ?? "1200");

export default function CheckoutForm({ defaultEmail }: { defaultEmail?: string }) {
  // Dane kontaktowe
  const [email, setEmail] = useState(defaultEmail || "");
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState(""); // przechowujemy "surowy" wpis, formatujemy w UI

  // Dostawa
  const [shipping, setShipping] = useState<"courier" | "inpost">("courier");
  const [courierRate, setCourierRate] = useState<"standard" | "express">("standard");

  // Adres dla kuriera
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode,   setPostalCode]   = useState("");
  const [city,         setCity]         = useState("");

  // InPost
  const [lockerCity, setLockerCity] = useState("");
  const [lockerId,   setLockerId]   = useState("");

  // Kupon (informacyjnie – kupony obsługuje Stripe)
  const [coupon, setCoupon] = useState("");

  const shipCost = useMemo(() => {
    if (shipping === "inpost") return INPOST;
    return courierRate === "express" ? COURIER_EXP : COURIER_STD;
  }, [shipping, courierRate]);

  // Rabat bazowy (przecena względem katalogowej)
  const baseDiscountPerItem = ORIGINAL - PRICE;
  const baseDiscountPct = ((baseDiscountPerItem / ORIGINAL) * 100).toFixed(1);

  const total = PRICE + shipCost;

  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Podaj poprawny adres e-mail.");
      return;
    }
    if (shipping === "courier" && (!addressLine1 || !postalCode || !city)) {
      setErr("Uzupełnij adres dla kuriera.");
      return;
    }
    if (shipping === "inpost" && !lockerId) {
      setErr("Wybierz Paczkomat InPost.");
      return;
    }

    try {
      setBusy(true);
      const res = await fetch("/api/book/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone: toE164PL(phone), // ⬅ wysyłamy w E.164: +48xxxxxxxxx
          shipping,
          courierRate,
          addressLine1,
          postalCode,
          city,
          country: "PL",
          lockerCity,
          lockerId,
        }),
      });

      // bezpieczne parsowanie (gdyby backend zwrócił tekst/HTML)
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { json = { error: text }; }

      if (!res.ok || !json?.url) {
        throw new Error(json?.error || "Nie udało się utworzyć płatności.");
      }
      window.location.href = json.url;
    } catch (e: any) {
      setErr(e.message || "Nie udało się utworzyć płatności.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* LEWA KOLUMNA — Galeria + opis */}
      <div className="lg:col-span-3 space-y-4">
        <div className="aspect-[16/10] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1d2e] to-[#0f1222] flex items-center justify-center">
          <span className="text-white/50">Podgląd produktu</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-xl border border-white/10 bg-[#1a1d2e]" />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
          <h3 className="text-lg font-semibold mb-3">Co kupujesz?</h3>
          <ul className="list-disc pl-6 space-y-2 text-white/80">
            <li>Wydanie drukowane przewodnika</li>
            <li>Aktualizacje w przyszłości bez dopłat</li>
            <li>Wsparcie i 14 dni gwarancji satysfakcji</li>
          </ul>
        </div>
      </div>

      {/* PRAWA KOLUMNA — Panel zamówienia */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6 lg:sticky lg:top-6">
          <h2 className="text-2xl font-bold">Pełen Dostęp do Przewodnika</h2>
          <p className="text-white/60 text-sm">Jednorazowa płatność — dostęp na zawsze.</p>

          {/* Cena z przeceną */}
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-4xl font-extrabold">{formatPLN(PRICE)}</div>
            <div className="line-through text-white/50">{formatPLN(ORIGINAL)}</div>
            <span className="px-2 py-1 text-xs rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30">
              −{baseDiscountPct}%
            </span>
          </div>
          <div className="text-white/60 text-xs mt-1">
            Oszczędzasz {formatPLN(baseDiscountPerItem)} na sztuce
          </div>

          {/* Dane klienta */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="adres@email.pl"
                className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Imię i nazwisko (opcjonalnie)</label>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Jan Kowalski"
                className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-rose-400"
              />
            </div>

            {/* Telefon z automatycznym prefiksem +48 */}
            <div>
              <label className="text-sm text-white/70">Telefon (opcjonalnie)</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/70 select-none">
                  +48
                </span>
                <input
                  type="tel"
                  value={formatPLGroups(phone)}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="500 300 200"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9 ]*"              // ← zamiast "\d*" (złe w JSX)
                  title="Wpisz tylko cyfry (możesz użyć spacji)"
                  className="w-full rounded-xl bg-[#0f1222] border border-white/10 pl-14 pr-3 py-2 outline-none focus:border-rose-400"
                />
              </div>
              {!!phone && (
                <p className="text-xs text-white/50 mt-1">
                  Zapiszemy jako <span className="font-mono">{toE164PL(phone)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Dostawa */}
          <div className="mt-6">
            <div className="text-sm text-white/70">Dostawa</div>

            {/* Kurier */}
            <label className="mt-2 flex items-center gap-3">
              <input
                type="radio"
                name="ship"
                className="accent-rose-500"
                checked={shipping === "courier"}
                onChange={() => setShipping("courier")}
              />
              <span>Kurier</span>
            </label>

            {shipping === "courier" && (
              <div className="ml-7 mt-2 space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="courierRate"
                    className="accent-rose-500"
                    checked={courierRate === "standard"}
                    onChange={() => setCourierRate("standard")}
                  />
                  <span>Standard (3–5 dni) — {formatPLN(COURIER_STD)}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="courierRate"
                    className="accent-rose-500"
                    checked={courierRate === "express"}
                    onChange={() => setCourierRate("express")}
                  />
                  <span>Ekspres (1–2 dni) — {formatPLN(COURIER_EXP)}</span>
                </label>

                {/* Adres dla kuriera */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="md:col-span-2">
                    <label className="text-sm text-white/70">Ulica i nr</label>
                    <input
                      value={addressLine1}
                      onChange={(e)=>setAddressLine1(e.target.value)}
                      placeholder="np. Bolesława Chrobrego 12, 12"
                      className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70">Kod pocztowy</label>
                    <input
                      value={postalCode}
                      onChange={(e)=>setPostalCode(e.target.value)}
                      placeholder="15-057"
                      className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70">Miasto</label>
                    <input
                      value={city}
                      onChange={(e)=>setCity(e.target.value)}
                      placeholder="Białystok"
                      className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* InPost */}
            <label className="mt-4 flex items-center gap-3">
              <input
                type="radio"
                name="ship"
                className="accent-rose-500"
                checked={shipping === "inpost"}
                onChange={() => setShipping("inpost")}
              />
              <span>Paczkomat InPost</span>
            </label>

            {shipping === "inpost" && (
              <div className="ml-7 mt-2">
                <InpostSelect
                  value={lockerId}
                  onChange={(cityVal, lockerVal) => {
                    setLockerCity(cityVal);
                    setLockerId(lockerVal);
                  }}
                />
                <div className="text-white/60 text-sm mt-2">Cena: {formatPLN(INPOST)}</div>
              </div>
            )}
          </div>

          {/* Kupon (info) */}
          <div className="mt-6">
            <label className="text-sm text-white/70">Kupon rabatowy</label>
            <input
              value={coupon}
              onChange={(e)=>setCoupon(e.target.value)}
              placeholder="Kod wpiszesz w następnym kroku (Stripe)"
              disabled
              className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 opacity-70"
            />
          </div>

          {/* Podsumowanie */}
          <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Cena katalogowa</span><span>{formatPLN(ORIGINAL)}</span></div>
            <div className="flex justify-between"><span>Przecena</span><span className="text-rose-300">− {formatPLN(baseDiscountPerItem)}</span></div>
            <div className="flex justify-between"><span>Cena po przecenie</span><span>{formatPLN(PRICE)}</span></div>
            <div className="flex justify-between"><span>Dostawa</span><span>{formatPLN(shipCost)}</span></div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
              <span>Do zapłaty</span><span>{formatPLN(total)}</span>
            </div>
          </div>

          {err && <p className="mt-3 text-rose-300">{err}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-rose-500 hover:bg-rose-400 px-4 py-3 font-semibold disabled:opacity-60"
          >
            {busy ? "Przekierowuję do Stripe…" : "Przejdź do płatności"}
          </button>

          <ul className="mt-6 text-xs text-white/60 space-y-1">
            <li>✓ Bezpieczne płatności</li>
            <li>✓ Faktura dla firmy</li>
            <li>✓ Gwarancja satysfakcji 14 dni</li>
            <li>✓ Prywatność i dyskrecja</li>
          </ul>
        </div>
      </div>
    </form>
  );
}
