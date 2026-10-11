"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* --- Ikony SVG (spójne ze stroną główną) --- */
const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ArrowRight = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const AlertTriangleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const features = [
  "Pełen dostęp do przewodnika oraz materiałów bonusowych",
  "Plan krok po kroku z konkretnymi scenariuszami działań",
  "Dostęp na urządzenia mobilne i komputery",
  "Darmowe aktualizacje w przyszłości",
];

export default function SuccessPage() {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Weryfikujemy Twoją płatność...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      // Brak session_id — np. wejście bezpośrednio na /success.
      setState("ok");
      setMessage("Dziękujemy za zakup!");
      return;
    }

    fetch(`/api/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.paid) {
          setState("ok");
          setMessage("Dostęp został aktywowany.");
        } else {
          setState("error");
          setMessage(
            data?.error ??
              "Płatność nie została jeszcze potwierdzona. Jeśli zapłaciłeś, odśwież stronę za chwilę."
          );
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Nie udało się zweryfikować płatności. Spróbuj odświeżyć stronę.");
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden flex items-center justify-center px-4 sm:px-6 py-16">
      {/* Tło - Ambient Glow (jak na stronie głównej) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-xl">
        {/* LOGO */}
        <Link
          href="/"
          className="mx-auto mb-8 flex items-center justify-center gap-2.5 group w-fit"
        >
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 transition-all">
            <HeartIcon className="w-5 h-5 text-rose-400" />
          </div>
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-white group-hover:text-rose-200 transition-colors">
            Przewodnik dla par
          </span>
        </Link>

        {/* KARTA GŁÓWNA */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 via-pink-500/20 to-purple-600/30 rounded-[32px] blur-xl opacity-50" />

          <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-rose-950/30 text-center before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-purple-500">
            {/* --- LOADING --- */}
            {state === "loading" && (
              <div className="flex flex-col items-center py-6">
                <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-rose-500" />
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {message}
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Prosimy nie zamykać tej strony.
                </p>
              </div>
            )}

            {/* --- SUKCES --- */}
            {state === "ok" && (
              <>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <CheckCircleIcon className="w-4 h-4" /> Płatność potwierdzona
                </span>

                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Dziękujemy za zakup{" "}
                  <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    🎉
                  </span>
                </h1>

                <p className="mt-4 text-slate-300 text-sm sm:text-base">
                  {message}
                </p>

                {/* Lista korzyści */}
                <ul className="mt-8 space-y-3 text-left bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5">
                  {features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="p-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/userpage"
                    className="group/btn relative inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-4 text-base shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 active:scale-[0.98]"
                  >
                    <span>Przejdź do materiałów</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <Link
                    href="/"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold px-6 py-4 text-sm transition-all duration-200"
                  >
                    Wróć na stronę główną
                  </Link>
                </div>
              </>
            )}

            {/* --- BŁĄD / OCZEKIWANIE --- */}
            {state === "error" && (
              <>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <AlertTriangleIcon className="w-4 h-4" /> Wymaga uwagi
                </span>

                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <AlertTriangleIcon className="w-8 h-8" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Prawie gotowe
                </h1>

                <p className="mt-4 text-slate-300 text-sm sm:text-base">{message}</p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-4 text-base shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Odśwież stronę
                  </button>

                  <Link
                    href="/userpage"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold px-6 py-4 text-sm transition-all duration-200"
                  >
                    Sprawdź swoją stronę
                  </Link>
                </div>

                <p className="mt-6 text-xs text-slate-500">
                  Masz pytania? Napisz na{" "}
                  <a
                    href="mailto:wsparcie@twojplan.pl"
                    className="text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    wsparcie@twojplan.pl
                  </a>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stopka pomocnicza */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Twoje dane są bezpieczne — płatność obsługiwana przez Stripe.
        </p>
      </div>
    </div>
  );
}
