"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type PaymentMethod = "card" | "klarna" | "tpay" | "blik";

const PRICE = 14900; // 149,00 zł (grosze)
const fmt = (v: number) =>
  (v / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

export default function PaymentPage() {
  const sp = useSearchParams();

  // --- parametry z poprzedniej strony (checkout) ---
  const initialQty = Math.max(1, Math.min(Number(sp.get("qty") ?? 1), 10));
  const initialShipping =
    (sp.get("shipping") as "standard" | "express" | null) ?? "standard";
  const initialCoupon = sp.get("coupon") ?? "";

  // Kontakt
  const [email, setEmail] = useState("");

  // Płatność
  const [method, setMethod] = useState<PaymentMethod>("tpay");
  const [processing, setProcessing] = useState(false);

  // Adres
  const [country, setCountry] = useState("Polska");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");

  // Z koszyka (z URL)
  const [qty, setQty] = useState(initialQty);
  const [shipping, setShipping] = useState<"standard" | "express">(
    initialShipping
  );
  const [coupon, setCoupon] = useState(initialCoupon);

  useEffect(() => {
    setQty(initialQty);
    setShipping(initialShipping);
    setCoupon(initialCoupon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  // Kwoty
  const subtotal = PRICE * qty;
  const shippingCost = shipping === "express" ? 1900 : 0;

  const couponDiscount = useMemo(() => {
    return coupon.trim().toUpperCase() === "KODRABATOWY"
      ? Math.round(subtotal * 0.1)
      : 0;
  }, [coupon, subtotal]);

  const total = Math.max(0, subtotal - couponDiscount) + shippingCost;

  const payNow = async () => {
    try {
      setProcessing(true);

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          method, // "card" | "klarna" | "tpay" | "blik"
          qty,
          coupon: coupon.trim(),
          subtotal,
          discount: couponDiscount,
          shipping: shippingCost,
          total,
          billing_address: {
            country,
            firstName,
            lastName,
            address1,
            address2,
            zip,
            city,
          },
          product_id: "plan-premium",
          product_name: "Pełen Dostęp do Przewodnika",
        }),
      });

      if (!res.ok) {
        alert("Nie udało się rozpocząć płatności. Spróbuj ponownie.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url; // bramka płatności
      } else {
        window.location.href = "/success"; // fallback demo
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* top bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Wróć na stronę główną
          </Link>
          <div className="text-white/60 text-sm">Bezpieczne i szyfrowane</div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEWA KOLUMNA – formularz */}
        <div className="space-y-8">
          {/* Ekspresowa płatność (dummy) */}
          <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
            {/* Kontakt */}
            <div className="space-y-2">
              <h3 className="font-semibold">Kontakt</h3>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Metody płatności */}
          <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6 space-y-3">
            <h2 className="font-semibold">Płatność</h2>

            {/* KARTA */}
            <label className="block rounded-xl border border-white/10">
              <div className="flex items-center gap-3 p-3">
                <input
                  type="radio"
                  name="pm"
                  className="accent-rose-500"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />
                <span className="font-medium">Karta kredytowa</span>
                <div className="ml-auto flex items-center gap-2 opacity-90">
                  <Image src="../payments/visa.svg" alt="Visa" width={40} height={22} />
                  <Image src="../payments/mastercard.svg" alt="Mastercard" width={40} height={22} />
                </div>
              </div>
              {method === "card" && (
                <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Numer karty"
                    className="col-span-2 h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                  />
                  <input
                    placeholder="Data ważności (MM / RR)"
                    className="h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                  />
                  <input
                    placeholder="Kod weryfikacyjny"
                    className="h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                  />
                  <input
                    placeholder="Nazwisko na karcie"
                    className="col-span-2 h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                  />
                </div>
              )}
            </label>
            {/* TPAY (z ikonami Blik/Przelewy24) */}
            <label className="block rounded-xl border border-white/10">
              <div className="flex items-center gap-3 p-3">
                <input
                  type="radio"
                  name="pm"
                  className="accent-rose-500"
                  checked={method === "tpay"}
                  onChange={() => setMethod("tpay")}
                />
                <span className="font-medium">Tpay – szybkie płatności</span>
                <div className="ml-auto flex items-center gap-2 opacity-90">
                  <Image src="../payments/blik.svg" alt="BLIK" width={40} height={22} />
                  <Image
                    src="../payments/przelewy24.svg"
                    alt="Przelewy24"
                    width={40}
                    height={22}
                  />
                </div>
              </div>
              {method === "tpay" && (
                <div className="px-3 pb-3 text-sm text-white/60">
                  Po kliknięciu „Zapłać teraz” zostaniesz przekierowany do Tpay w
                  celu dokończenia bezpiecznej płatności.
                </div>
              )}
            </label>

            {/* BLIK osobno */}
            <label className="block rounded-xl border border-white/10">
              <div className="flex items-center gap-3 p-3">
                <input
                  type="radio"
                  name="pm"
                  className="accent-rose-500"
                  checked={method === "blik"}
                  onChange={() => setMethod("blik")}
                />
                <span className="font-medium">BLIK</span>
                <Image src="../payments/blik.svg" alt="BLIK" width={40} height={22} className="ml-auto" />
              </div>
              {method === "blik" && (
                <div className="px-3 pb-3 text-sm text-white/60">
                  Kod BLIK wpiszesz po przekierowaniu do operatora.
                </div>
              )}
            </label>
          </div>

          {/* Adres rozliczeniowy */}
          <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6 space-y-3">
            <h2 className="font-semibold">Adres rozliczeniowy</h2>
            <select
              className="w-full h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option>Polska</option>
              <option>Niemcy</option>
              <option>Czechy</option>
              <option>Słowacja</option>
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Imię (opcjonalnie)"
                className="h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                placeholder="Nazwisko"
                className="h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                placeholder="Adres"
                className="col-span-2 h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
              <input
                placeholder="Mieszkanie, apartament itp. (opcjonalnie)"
                className="col-span-2 h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
              <input
                placeholder="Kod pocztowy"
                className="h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <input
                placeholder="Miasto"
                className="h-11 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <button
              onClick={payNow}
              disabled={processing}
              className="mt-2 h-12 w-full rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-60 text-white font-semibold"
            >
              {processing ? "Przetwarzanie..." : "Zapłać teraz"}
            </button>
          </div>
        </div>

        {/* PRAWA KOLUMNA – podsumowanie */}
        <aside className="lg:pl-2">
          <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6 sticky top-6">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-white/5" />
              <div className="flex-1">
                <div className="font-medium">Pełen Dostęp do Przewodnika</div>
                <div className="text-sm text-white/60">Dostęp cyfrowy</div>
              </div>
              <div className="font-semibold">{fmt(PRICE)}</div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 p-3">
                <div className="text-xs text-white/60">Ilość</div>
                <div className="mt-1 text-lg font-semibold">{qty}</div>
              </div>
              <div className="rounded-xl border border-white/10 p-3">
                <div className="text-xs text-white/60">Dostawa</div>
                <select
                  className="mt-1 w-full h-9 rounded-lg bg-[#0f1222] border border-white/10 px-2 outline-none focus:border-white/20 text-sm"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value as "standard" | "express")}
                >
                  <option value="standard">Standard (0 zł)</option>
                  <option value="express">Ekspres (19,00 zł)</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Kod rabatowy"
                className="flex-1 h-10 rounded-xl bg-[#0f1222] border border-white/10 px-3 outline-none focus:border-white/20"
              />
              <button
                type="button"
                className="h-10 px-3 rounded-xl border border-white/10 hover:bg-white/5"
                onClick={() => null}
              >
                Zastosuj
              </button>
            </div>

            <div className="mt-5 h-px bg-white/10" />

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Produkty</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Rabat kuponowy</span>
                <span className={couponDiscount ? "text-rose-400" : "text-white/50"}>
                  − {fmt(couponDiscount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dostawa</span>
                <span>{fmt(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                <span>Razem</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            {/* Pasek zaufania / ikony płatności */}
            <div className="mt-6 flex items-center justify-center gap-4 opacity-90">
              <Image src="../payments/visa.svg" alt="Visa" width={40} height={22} />
              <Image src="../payments/mastercard.svg" alt="Mastercard" width={40} height={22} />
              <span className="mx-1 h-6 w-px bg-white/10" />
              <Image src="../payments/blik.svg" alt="BLIK" width={40} height={22} />
              <Image src="../payments/przelewy24.svg" alt="Przelewy24" width={40} height={22} />
            </div>
            <ul className="mt-4 text-xs text-white/60 space-y-1">
              <li>✓ Bezpieczne płatności</li>
              <li>✓ Gwarancja satysfakcji 14 dni</li>
              <li>✓ Prywatność i dyskrecja</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
