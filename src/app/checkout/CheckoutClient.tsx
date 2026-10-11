"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type Props = { userEmail?: string };

/* --- Ikony SVG --- */
const ArrowLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShieldCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const CloudIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6 19h11.5Z" />
    <path d="m9 13 3 3 3-3" />
    <path d="M12 16V9" />
  </svg>
);

const BookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

type Version = "online" | "book";

const ONLINE_ORIGINAL = 20000; // 200,00 zł
const ONLINE_PRICE = 14900; // 149,00 zł

const BOOK_ORIGINAL = Number(process.env.NEXT_PUBLIC_BOOK_ORIGINAL_PLN ?? "20000");
const BOOK_PRICE = Number(process.env.NEXT_PUBLIC_BOOK_PRICE_PLN ?? "9900");

const COURIER_STD = Number(process.env.NEXT_PUBLIC_SHIP_COURIER_STANDARD_PLN ?? "0");
const COURIER_EXP = Number(process.env.NEXT_PUBLIC_SHIP_COURIER_EXPRESS_PLN ?? "1900");
const INPOST = Number(process.env.NEXT_PUBLIC_SHIP_INPOST_PLN ?? "1200");
const formatPLN = (v: number) =>
  (v / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

// telefon -> E164 PL
const toE164PL = (raw: string) => {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("0048")) d = d.slice(4);
  if (d.startsWith("48")) d = d.slice(2);
  if (d.length !== 9) return "";
  return `+48${d}`;
};
const formatPLGroups = (raw: string) => {
  const d = (raw || "").replace(/\D/g, "").slice(0, 9);
  return d.replace(/(\d{3})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(" ")
  );
};

export default function CheckoutClient({ userEmail }: Props) {
  const [version, setVersion] = useState<Version>("online");
  const [qty, setQty] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [processing, setProcessing] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  // Dostawa (używane tylko dla wersji "book")
  const [shipping, setShipping] = useState<"courier" | "inpost">("courier");
  const [courierRate, setCourierRate] = useState<"standard" | "express">("standard");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [lockerCity, setLockerCity] = useState("");
  const [lockerId, setLockerId] = useState("");

  // Modal auth
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authPass2, setAuthPass2] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authIsError, setAuthIsError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

    const isBook = version === "book";

  const shippingCost = useMemo(() => {
    if (!isBook) return 0;
    if (shipping === "inpost") return INPOST;
    return courierRate === "express" ? COURIER_EXP : COURIER_STD;
  }, [isBook, shipping, courierRate]);

  const originalPerItem = isBook ? BOOK_ORIGINAL : ONLINE_ORIGINAL;
  const pricePerItem = isBook ? BOOK_PRICE : ONLINE_PRICE;

  const catalogSubtotal = originalPerItem * qty;
  const subtotal = pricePerItem * qty;
  const baseDiscountPerItem = originalPerItem - pricePerItem;
  const baseDiscountTotal = baseDiscountPerItem * qty;

  const discount = useMemo(() => {
    // kupon naliczamy tylko dla wersji online
    if (!isBook && coupon.trim().toUpperCase() === "KODRABATOWY") {
      return Math.round(subtotal * 0.1);
    }
    return 0;
  }, [coupon, subtotal, isBook]);

  const total = Math.max(0, subtotal - discount) + shippingCost;
  const baseDiscountPct = ((baseDiscountPerItem / originalPerItem) * 100).toFixed(1);

  function validateBook(): string | null {
    if (!name.trim()) return "Podaj imię i nazwisko.";
    if (!toE164PL(phone)) return "Podaj poprawny numer telefonu (9 cyfr).";
    if (shipping === "courier" && (!addressLine1 || !postalCode || !city)) {
      return "Uzupełnij adres dla kuriera.";
    }
    if (shipping === "inpost" && !lockerId) return "Wybierz Paczkomat InPost.";
    return null;
  }

    // Tworzenie sesji Stripe + przekierowanie
  async function createCheckoutSession(emailToUse: string) {
    if (isBook) {
      const v = validateBook();
      if (v) {
        setFormErr(v);
        throw new Error(v);
      }
    }
    setFormErr(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isBook
          ? {
              version: "book",
              email: emailToUse ?? "",
              name,
              phone: toE164PL(phone),
              qty,
              shipping,
              courierRate,
              addressLine1,
              postalCode,
              city,
              country: "PL",
              lockerCity,
              lockerId,
            }
          : {
              version: "online",
              email: emailToUse ?? "",
              qty,
              coupon: coupon.trim(),
            }
      ),
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
      setFormErr(e?.message ?? "Błąd płatności.");
    } finally {
      setProcessing(false);
    }
  };

  // Obsługa logowania/rejestracji w modalu
  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthMsg("");
    setAuthIsError(false);

    try {
      setAuthLoading(true);

      if (mode === "register") {
        if (authPass.length < 6) {
          setAuthIsError(true);
          setAuthMsg("Hasło musi mieć co najmniej 6 znaków.");
          setAuthLoading(false);
          return;
        }
        if (authPass !== authPass2) {
          setAuthIsError(true);
          setAuthMsg("Hasła nie są takie same.");
          setAuthLoading(false);
          return;
        }

        // Zapis do public.users (status: unpaid)
        const { error } = await supabase.from("users").insert([
          { email: authEmail.trim(), password: authPass, status: "unpaid" },
        ]);
        if (error) {
          setAuthIsError(true);
          setAuthMsg("Błąd rejestracji: " + error.message);
          setAuthLoading(false);
          return;
        }
        setMode("login");
        setAuthIsError(false);
        setAuthMsg("Rejestracja zakończona! Zaloguj się teraz.");
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
        setAuthIsError(true);
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
      setAuthIsError(true);
      setAuthMsg(err?.message ?? "Wystąpił nieoczekiwany błąd.");
      setAuthLoading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Tło - Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[170px] pointer-events-none rounded-full" />

      {/* Górny pasek powrotu / nawigacji */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Wróć do strony głównej</span>
          </Link>

          {userEmail ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              <UserIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>{userEmail}</span>
            </div>
          ) : (
            <div className="text-xs font-medium text-slate-500">
              Kupujesz jako gość
            </div>
          )}
        </div>
      </header>

            {/* Główny układ koszyka */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* Wybór wersji produktu */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-center">
            Wybierz wersję przewodnika
          </h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Ten sam przewodnik — dostępny od razu online lub w wydaniu drukowanym.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => setVersion("online")}
              className={`relative text-left p-5 rounded-3xl border transition-all ${
                version === "online"
                  ? "border-rose-500/60 bg-rose-500/5 shadow-lg shadow-rose-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-rose-400">
                  <CloudIcon className="w-5 h-5" />
                </div>
                {version === "online" && (
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-base font-black text-white">Wersja online</h3>
              <p className="text-xs text-slate-400 mt-1">
                Natychmiastowy dostęp cyfrowy. Bez wysyłki.
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-black text-white">{formatPLN(ONLINE_PRICE)}</span>
                <span className="text-xs line-through text-slate-500">{formatPLN(ONLINE_ORIGINAL)}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVersion("book")}
              className={`relative text-left p-5 rounded-3xl border transition-all ${
                version === "book"
                  ? "border-rose-500/60 bg-rose-500/5 shadow-lg shadow-rose-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-rose-400">
                  <BookIcon className="w-5 h-5" />
                </div>
                {version === "book" && (
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-base font-black text-white">Książka w druku</h3>
              <p className="text-xs text-slate-400 mt-1">
                Egzemplarz fizyczny + dostawa kurierem/Paczkomat.
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-black text-white">{formatPLN(BOOK_PRICE)}</span>
                <span className="text-xs line-through text-slate-500">{formatPLN(BOOK_ORIGINAL)}</span>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Lewa strona: Podgląd i informacje o produkcie */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Główny kontener podglądu */}
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-slate-900/60 p-8 text-center backdrop-blur-xl shadow-xl flex flex-col items-center justify-center min-h-[280px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                {isBook ? "Wydanie drukowane" : "Cyfrowy przewodnik"}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight max-w-md">
                Plan odzyskania bliskości –{" "}
                {isBook ? "książka w okładce" : "pełen dostęp"}
              </h2>

              <p className="mt-2 text-slate-400 text-sm max-w-sm">
                {isBook
                  ? "Egzemplarz fizyczny wysyłamy kurierem lub do Paczkomatu. Realizacja 1–3 dni robocze."
                  : "Natychmiastowy dostęp po opłaceniu. Dostęp na urządzenia mobilne i komputery."}
              </p>
            </div>

            {/* Opis zawartości */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-sm space-y-4">
              <h3 className="text-lg font-extrabold text-white">Co zawiera pakiet?</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {(isBook
                  ? [
                      "Wydanie drukowane przewodnika w twardej okładce",
                      "Dostawa kurierem lub do Paczkomatu InPost",
                      "Aktualizacje w przyszłości bez dopłat",
                      "14 dni gwarancji satysfakcji",
                    ]
                  : [
                      "Pełen dostęp do przewodnika oraz materiałów bonusowych",
                      "Plan krok po kroku z konkretnymi scenariuszami działań",
                      "Natychmiastowy dostęp na urządzenia mobilne i komputery",
                      "Darmowe aktualizacje w przyszłości bez dodatkowych opłat",
                    ]
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prawa strona: Panel zamówienia */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 via-pink-500/20 to-purple-600/30 rounded-[32px] blur-xl opacity-50" />

              <div className="relative rounded-3xl border border-rose-500/30 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                                <div>
                  <h1 className="text-xl font-extrabold text-white">Podsumowanie zamówienia</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    {isBook
                      ? "Wersja drukowana • Cena + dostawa"
                      : "Wersja online • Jednorazowa opłata"}
                  </p>
                </div>

                {/* Sekcja Ceny */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{formatPLN(pricePerItem)}</span>
                      <span className="text-sm line-through text-slate-500">{formatPLN(originalPerItem)}</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold block mt-0.5">
                      Oszczędzasz {formatPLN(baseDiscountPerItem)}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-black rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    −{baseDiscountPct}%
                  </span>
                </div>

                {/* Ilość */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isBook ? "Ilość egzemplarzy" : "Ilość licencji"}
                  </label>
                  <div className="inline-flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1">
                    <button
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition-colors"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Zmień ilość -"
                    >
                      −
                    </button>
                    <div className="px-4 text-sm font-bold text-white">{qty}</div>
                    <button
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition-colors"
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      aria-label="Zmień ilość +"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ==== DANE DOSTAWY (tylko książka) ==== */}
                {isBook && (
                  <div className="space-y-4 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                        Imię i nazwisko
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jan Kowalski"
                        className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                        Telefon
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 select-none text-sm">
                          +48
                        </span>
                        <input
                          type="tel"
                          value={formatPLGroups(phone)}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="500 600 700"
                          inputMode="numeric"
                          className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
                        />
                      </div>
                      {phone && !toE164PL(phone) && (
                        <p className="mt-1 text-xs text-rose-400">Wpisz 9 cyfr.</p>
                      )}
                    </div>

                    {/* Dostawa */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Dostawa
                      </label>
                      <div className="space-y-2 text-sm">
                        <label
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            shipping === "courier"
                              ? "border-rose-500/50 bg-rose-500/5 text-white"
                              : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              className="accent-rose-500"
                              checked={shipping === "courier"}
                              onChange={() => setShipping("courier")}
                            />
                            <span className="font-semibold text-xs sm:text-sm">Kurier</span>
                          </div>
                          <span className="font-bold text-white text-xs">
                            od {formatPLN(COURIER_STD)}
                          </span>
                        </label>

                        {shipping === "courier" && (
                          <div className="ml-2 pl-3 border-l border-slate-800 space-y-2">
                            <label className="flex items-center justify-between gap-3 text-xs">
                              <span className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  className="accent-rose-500"
                                  checked={courierRate === "standard"}
                                  onChange={() => setCourierRate("standard")}
                                />
                                <span className="text-slate-300">Standard (3–5 dni)</span>
                              </span>
                              <span className="text-slate-400">{formatPLN(COURIER_STD)}</span>
                            </label>
                            <label className="flex items-center justify-between gap-3 text-xs">
                              <span className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  className="accent-rose-500"
                                  checked={courierRate === "express"}
                                  onChange={() => setCourierRate("express")}
                                />
                                <span className="text-slate-300">Ekspres (1–2 dni)</span>
                              </span>
                              <span className="text-slate-400">{formatPLN(COURIER_EXP)}</span>
                            </label>

                            <div className="grid grid-cols-1 gap-2 pt-1">
                              <input
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                placeholder="Ulica i nr"
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500/60"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  value={postalCode}
                                  onChange={(e) => setPostalCode(e.target.value)}
                                  placeholder="Kod pocztowy"
                                  className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500/60"
                                />
                                <input
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  placeholder="Miasto"
                                  className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500/60"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <label
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            shipping === "inpost"
                              ? "border-rose-500/50 bg-rose-500/5 text-white"
                              : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              className="accent-rose-500"
                              checked={shipping === "inpost"}
                              onChange={() => setShipping("inpost")}
                            />
                            <span className="font-semibold text-xs sm:text-sm">Paczkomat InPost</span>
                          </div>
                          <span className="font-bold text-white text-xs">{formatPLN(INPOST)}</span>
                        </label>

                        {shipping === "inpost" && (
                          <div className="ml-2 pl-3 border-l border-slate-800 pt-1 space-y-2">
                            <input
                              value={lockerCity}
                              onChange={(e) => setLockerCity(e.target.value)}
                              placeholder="Miasto paczkomatu"
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500/60"
                            />
                            <input
                              value={lockerId}
                              onChange={(e) => setLockerId(e.target.value)}
                              placeholder="Kod paczkomatu (np. KRA010)"
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500/60"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ==== Kupon (tylko wersja online) ==== */}
                {!isBook && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Kupon rabatowy
                    </label>
                    <div className="relative">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Kod rabatowy (np. KODRABATOWY)"
                        className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all pr-10"
                      />
                      <TagIcon className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {coupon.trim() && (
                      <p className="mt-1.5 text-xs text-rose-400 font-medium">
                        Wpisz <span className="font-bold text-white">KODRABATOWY</span>, aby otrzymać -10%
                      </p>
                    )}
                  </div>
                )}

                {/* Podsumowanie kwot */}
                <div className="border-t border-slate-800/80 pt-4 space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cena katalogowa</span>
                    <span className="text-slate-400">{formatPLN(catalogSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Przecena</span>
                    <span className="text-rose-400">− {formatPLN(baseDiscountTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cena po przecenie</span>
                    <span className="text-white font-medium">{formatPLN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rabat kuponowy</span>
                    <span className={discount ? "text-rose-400 font-bold" : "text-slate-500"}>
                      − {formatPLN(discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dostawa</span>
                    <span className="text-white font-medium">{formatPLN(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-black text-white pt-3 border-t border-slate-800">
                    <span>Do zapłaty</span>
                    <span className="text-rose-400">{formatPLN(total)}</span>
                  </div>
                </div>

                                {formErr && (
                  <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                    {formErr}
                  </div>
                )}

                {/* Przycisk Płatności */}
                <button
                  disabled={processing}
                  onClick={handlePay}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-4 text-base shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {processing ? "Przetwarzanie..." : "Przejdź do bezpiecznej płatności"}
                </button>

                {/* Gwarancja i bezpieczeństwo */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Gwarancja zwrotu pieniędzy przez 14 dni</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LockIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Szyfrowane połączenie SSL (Stripe Checkout)</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* MODAL AUTH */}
      {showAuth && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          onClick={() => {
            if (!authLoading) setShowAuth(false);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-black text-white">
                {mode === "login" ? "Zaloguj się" : "Załóż konto"}
              </h2>
              <button
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                onClick={() => {
                  if (!authLoading) setShowAuth(false);
                }}
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>

            {/* Przełącznik tabów */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl my-5">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setAuthMsg("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Logowanie
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setAuthMsg("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Rejestracja
              </button>
            </div>

            <form className="space-y-4" onSubmit={submitAuth}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  Adres e-mail
                </label>
                <input
                  type="email"
                  placeholder="twoj.email@domena.pl"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  Hasło
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  required
                />
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                    Powtórz hasło
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
                    value={authPass2}
                    onChange={(e) => setAuthPass2(e.target.value)}
                    required
                  />
                </div>
              )}

              {authMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold text-center ${
                    authIsError
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  {authMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-3.5 text-base shadow-lg shadow-rose-500/25 transition-all mt-2"
              >
                {authLoading
                  ? "Przetwarzanie..."
                  : mode === "login"
                  ? "Zaloguj i zapłać"
                  : "Zarejestruj się"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-400 font-medium">
              {mode === "login" ? (
                <>
                  Nie masz jeszcze konta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setAuthMsg("");
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 ml-0.5"
                  >
                    Zarejestruj się
                  </button>
                </>
              ) : (
                <>
                  Masz już konto?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setAuthMsg("");
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 ml-0.5"
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