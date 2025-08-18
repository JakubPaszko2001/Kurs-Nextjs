"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = { userEmail: string };

const ORIGINAL = 20000; // 200,00 zł
const PRICE = 14900;    // 149,00 zł
const formatPLN = (v: number) =>
  (v / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

export default function CheckoutClient({ userEmail }: Props) {
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [coupon, setCoupon] = useState("");
  const [processing, setProcessing] = useState(false);

  const shippingCost = shipping === "standard" ? 0 : 1900;

  const catalogSubtotal = ORIGINAL * qty;
  const subtotal = PRICE * qty;
  const baseDiscountPerItem = ORIGINAL - PRICE;
  const baseDiscountTotal = baseDiscountPerItem * qty;

  const discount = useMemo(() => {
    if (coupon.trim().toUpperCase() === "KODRABATOWY") {
      return Math.round(subtotal * 0.1);
    }
    return 0;
  }, [coupon, subtotal]);

  const total = Math.max(0, subtotal - discount) + shippingCost;
  const baseDiscountPct = ((baseDiscountPerItem / ORIGINAL) * 100).toFixed(1);

  // ⬇️ od razu tworzymy sesję Stripe i przekierowujemy na bramkę
  const handlePay = async () => {
    try {
      setProcessing(true);

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail ?? "",
          qty,
          coupon: coupon.trim(),
          subtotal,             // 149 zł * ilość (w groszach)
          discount,             // rabat z kuponu (w groszach)
          shipping: shippingCost,
          total,                // suma końcowa (w groszach)
          product_id: "plan-premium",
          product_name: "Pełen Dostęp do Przewodnika",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert("Nie udało się rozpocząć płatności. " + (data?.error ?? ""));
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        // URL Stripe Checkout
        window.location.href = data.url;
      } else {
        alert("Brak URL do płatności z serwera.");
      }
    } catch (e) {
      console.error(e);
      alert("Wystąpił błąd podczas uruchamiania płatności.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* pasek powrotny */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Wróć na stronę główną
          </Link>
        </div>
      </div>

      {/* layout */}
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Galeria */}
        <div className="lg:col-span-3 space-y-4">
          <div className="aspect-[16/10] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1d2e] to-[#0f1222] flex items-center justify-center">
            <span className="text-white/50">Podgląd produktu</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl border border-white/10 bg-[#1a1d2e]"
              />
            ))}
          </div>

          {/* Opis */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
            <h3 className="text-lg font-semibold mb-3">Co kupujesz?</h3>
            <ul className="list-disc pl-6 space-y-2 text-white/80">
              <li>Pełen dostęp do przewodnika oraz materiałów bonusowych</li>
              <li>Plan krok po kroku z konkretnymi scenariuszami działań</li>
              <li>Aktualizacje w przyszłości bez dodatkowych opłat</li>
              <li>Prywatność, wsparcie i 14 dni gwarancji satysfakcji</li>
            </ul>
          </div>
        </div>

        {/* Panel zamówienia */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6 sticky top-6">
            <h1 className="text-2xl font-bold">Pełen Dostęp do Przewodnika</h1>
            <p className="text-white/60 text-sm mt-1">
              Jednorazowa płatność – dostęp na zawsze.
            </p>

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

            {/* Ilość */}
            <div className="mt-6">
              <label className="text-sm text-white/70">Ilość</label>
              <div className="mt-2 inline-flex items-center rounded-xl border border-white/10">
                <button
                  className="px-3 py-2 hover:bg-white/5"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Zmień ilość -"
                >
                  −
                </button>
                <div className="px-4 py-2 min-w-[3rem] text-center">{qty}</div>
                <button
                  className="px-3 py-2 hover:bg-white/5"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Zmień ilość +"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dostawa */}
            <div className="mt-6">
              <label className="text-sm text-white/70">Dostawa</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    className="accent-rose-500"
                    checked={shipping === "standard"}
                    onChange={() => setShipping("standard")}
                  />
                  <span>Standard (0 zł)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    className="accent-rose-500"
                    checked={shipping === "express"}
                    onChange={() => setShipping("express")}
                  />
                  <span>Ekspres (19,00 zł)</span>
                </label>
              </div>
            </div>

            {/* Kupon */}
            <div className="mt-6">
              <label className="text-sm text-white/70">Kupon rabatowy</label>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="np. KODRABATOWY"
                className="mt-2 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-white/20"
              />
              {coupon.trim() && (
                <p className="mt-1 text-xs text-white/60">
                  Podpowiedź: <strong>KODRABATOWY</strong> = -10%
                </p>
              )}
            </div>

            {/* Podsumowanie */}
            <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cena katalogowa</span>
                <span>{formatPLN(catalogSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Przecena</span>
                <span className="text-rose-300">− {formatPLN(baseDiscountTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cena po przecenie</span>
                <span>{formatPLN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Rabat kuponowy</span>
                <span className={discount ? "text-rose-300" : "text-white/60"}>
                  − {formatPLN(discount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dostawa</span>
                <span>{formatPLN(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                <span>Do zapłaty</span>
                <span>{formatPLN(total)}</span>
              </div>
            </div>

            <button
              disabled={processing}
              onClick={handlePay}
              className="mt-6 w-full rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-60 py-3 font-semibold"
            >
              {processing ? "Przetwarzanie..." : "Przejdź do płatności"}
            </button>

            {/* Zaufanie / gwarancja */}
            <ul className="mt-6 text-xs text-white/60 space-y-1">
              <li>✓ Bezpieczne płatności</li>
              <li>✓ Faktura dla firmy</li>
              <li>✓ Gwarancja satysfakcji 14 dni</li>
              <li>✓ Prywatność i dyskrecja</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
