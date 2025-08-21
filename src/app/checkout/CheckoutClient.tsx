"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient"; // ← DOPASUJ ŚCIEŻKĘ!

type Props = { userEmail?: string };

const ORIGINAL = 20000; // 200,00 zł
const PRICE = 14900;    // 149,00 zł
const formatPLN = (v: number) =>
  (v / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

export default function CheckoutClient({ userEmail }: Props) {
  const [qty, setQty] = useState(1);
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [coupon, setCoupon] = useState("");
  const [processing, setProcessing] = useState(false);

  // Modal auth
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authPass2, setAuthPass2] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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

  // Tworzenie sesji Stripe + przekierowanie
  async function createCheckoutSession(emailToUse: string) {
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailToUse ?? "",
        qty,
        coupon: coupon.trim(),
        subtotal,            // w groszach
        discount,            // w groszach
        shipping: shippingCost,
        total,               // w groszach
        product_id: "plan-premium",
        product_name: "Pełen Dostęp do Przewodnika",
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? "Nie udało się rozpocząć płatności.");
    }

    const data = await res.json().catch(() => ({}));
    if (!data?.url) throw new Error("Brak URL do płatności z serwera.");
    window.location.href = data.url; // Stripe Checkout
  }

  // Kliknięcie „Przejdź do płatności”
  const handlePay = async () => {
    if (!userEmail) {
      setShowAuth(true);
      return;
    }
    try {
      setProcessing(true);
      await createCheckoutSession(userEmail);
    } catch (e: any) {
      alert(e?.message ?? "Błąd płatności.");
    } finally {
      setProcessing(false);
    }
  };

  // Obsługa logowania/rejestracji w modalu
  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthMsg("");

    try {
      setAuthLoading(true);

      if (mode === "register") {
        if (authPass.length < 6) {
          setAuthMsg("❌ Hasło musi mieć co najmniej 6 znaków");
          setAuthLoading(false);
          return;
        }
        if (authPass !== authPass2) {
          setAuthMsg("❌ Hasła nie są takie same");
          setAuthLoading(false);
          return;
        }

        // Zapis do public.users (status: unpaid)
        const { error } = await supabase.from("users").insert([
          { email: authEmail.trim(), password: authPass, status: "unpaid" },
        ]);
        if (error) {
          setAuthMsg("Błąd rejestracji: " + error.message);
          setAuthLoading(false);
          return;
        }
        setMode("login");
        setAuthMsg("✅ Zarejestrowano. Zaloguj się teraz.");
        setAuthPass("");
        setAuthPass2("");
        setAuthLoading(false);
        return;
      }

      // LOGIN → /api/login (ustawia cookie sesji)
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail.trim(), password: authPass }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthMsg("Błąd logowania: " + (data?.error ?? res.statusText));
        setAuthLoading(false);
        return;
      }

      // zalogowano — zamknij modal i od razu odpal Stripe z tym e-mailem
      setShowAuth(false);
      setAuthLoading(false);
      setProcessing(true);
      await createCheckoutSession(authEmail.trim());
    } catch (err: any) {
      setAuthMsg(err?.message ?? "Wystąpił błąd.");
      setAuthLoading(false);
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
          {userEmail ? (
            <div className="text-white/60 text-sm">
              Zalogowano jako <span className="text-white">{userEmail}</span>
            </div>
          ) : (
            <div className="text-white/40 text-sm">Niezalogowany</div>
          )}
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
              <div key={i} className="aspect-video rounded-xl border border-white/10 bg-[#1a1d2e]" />
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
            <p className="text-white/60 text-sm mt-1">Jednorazowa płatność – dostęp na zawsze.</p>

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

      {/* MODAL AUTH */}
      {showAuth && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => { if (!authLoading) setShowAuth(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1d2e] p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {mode === "login" ? "Zaloguj się" : "Załóż konto"}
              </h2>
              <button
                className="text-white/60 hover:text-white"
                onClick={() => { if (!authLoading) setShowAuth(false); }}
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={submitAuth}>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Hasło"
                className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                required
              />

              {mode === "register" && (
                <input
                  type="password"
                  placeholder="Powtórz hasło"
                  className="w-full rounded-lg bg-[#0f1222] border border-white/20 px-3 py-2"
                  value={authPass2}
                  onChange={(e) => setAuthPass2(e.target.value)}
                  required
                />
              )}

              {authMsg && (
                <p className="text-sm text-white/80">{authMsg}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-rose-500 hover:bg-rose-400 disabled:opacity-60 rounded-lg py-2 font-semibold"
              >
                {authLoading
                  ? "Przetwarzanie..."
                  : mode === "login"
                  ? "Zaloguj i zapłać"
                  : "Zarejestruj"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-white/60">
              {mode === "login" ? (
                <>
                  Nie masz konta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Zarejestruj się
                  </button>
                </>
              ) : (
                <>
                  Masz już konto?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Zaloguj się
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
