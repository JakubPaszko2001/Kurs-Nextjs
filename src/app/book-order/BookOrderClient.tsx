"use client";

import { useEffect, useMemo, useState } from "react";

type Prices = {
  price: number;
  shippingStandard: number;
  shippingExpress: number;
};

const formatPLN = (v: number) =>
  (v / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

export default function BookOrderClient({ defaultEmail }: { defaultEmail?: string }) {
  const [prices, setPrices] = useState<Prices>({
    price: 9900,
    shippingStandard: 490,
    shippingExpress: 1990,
  });
  const [pricesLoaded, setPricesLoaded] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail || "");
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [lockerId, setLockerId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/book-order")
      .then((r) => r.json())
      .then((d) => {
        if (d?.price) setPrices(d);
      })
      .catch(() => {})
      .finally(() => setPricesLoaded(true));
  }, []);

  const shipCost = shipping === "express" ? prices.shippingExpress : prices.shippingStandard;
  const total = useMemo(() => prices.price + shipCost, [prices.price, shipCost]);

  const submit = async () => {
    setErr(null);
    if (!name.trim()) return setErr("Podaj imię i nazwisko.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Podaj poprawny e-mail.");
    if (addressLine1 && (!postalCode || !city)) return setErr("Uzupełnij pełny adres.");

    try {
      setBusy(true);
      const res = await fetch("/api/book-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          shipping,
          addressLine1,
          postalCode,
          city,
          lockerId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) throw new Error(data?.error ?? "Nie udało się rozpocząć płatności.");
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Błąd płatności.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:border-rose-500/60";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* Dane zamówienia */}
      <div className="lg:col-span-3 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Imię i nazwisko
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jan Kowalski"
            className={inputCls}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Adres e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.pl"
            className={inputCls}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sposób dostawy
          </label>
          <div className="mt-2 space-y-2">
            {[
              { key: "standard", label: "Kurier – standard (3–5 dni)", cost: prices.shippingStandard },
              { key: "express", label: "Kurier – ekspres (1–2 dni)", cost: prices.shippingExpress },
            ].map((opt) => (
              <label
                key={opt.key}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shipping === opt.key
                    ? "border-rose-500/50 bg-rose-500/5 text-white"
                    : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <input
                    type="radio"
                    className="accent-rose-500"
                    checked={shipping === opt.key}
                    onChange={() => setShipping(opt.key as "standard" | "express")}
                  />
                  {opt.label}
                </span>
                <span className="font-bold text-white text-sm">{formatPLN(opt.cost)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <input
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Ulica i nr (opcjonalnie)"
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Kod pocztowy"
              className={inputCls}
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto"
              className={inputCls}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Pełny adres do wysyłki potwierdzisz na stronie płatności (Stripe).
        </p>
      </div>

      {/* Podsumowanie kosztów – pokazane PRZED zapłatą */}
      <div className="lg:col-span-2">
        <div className="rounded-3xl border border-rose-500/30 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <h2 className="text-lg font-extrabold text-white">Podsumowanie zamówienia</h2>

          <div className="space-y-2.5 text-sm text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Poradnik (druk)</span>
              <span className="text-white font-medium">{formatPLN(prices.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dostawa ({shipping === "express" ? "ekspres" : "standard"})</span>
              <span className="text-white font-medium">{formatPLN(shipCost)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
              <span>Do zapłaty</span>
              <span className="text-rose-400">{formatPLN(total)}</span>
            </div>
          </div>

          {err && (
            <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
              {err}
            </div>
          )}

          <button
            disabled={busy || !pricesLoaded}
            onClick={submit}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-4 text-base shadow-xl shadow-rose-500/25 transition-all"
          >
            {busy ? "Przetwarzanie..." : "Przejdź do płatności"}
          </button>

          <p className="text-xs text-slate-500 text-center">
            Płatność obsługiwana przez Stripe. Koszt i sposób dostawy widoczne powyżej.
          </p>
        </div>
      </div>
    </div>
  );
}
