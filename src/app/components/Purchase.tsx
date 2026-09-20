"use client";

import React from "react";
import Link from "next/link";

/* --- Ikony SVG --- */
const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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

const ZapIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FeaturesList = [
  "12 konkretnych rozdziałów",
  "4-tygodniowy plan działania",
  "Scenariusze trudnych rozmów",
  "Ćwiczenia pomagające odbudować napięcie",
  "Fakty i rozwiązania oparte na badaniach",
  "Prywatny i dyskretny dostęp",
];

const Purchase: React.FC = () => {
  return (
    <section
      id="kup-teraz"
      className="relative overflow-hidden bg-slate-950 py-20 md:py-32 text-slate-100 font-sans border-t border-slate-800/80"
    >
      {/* Tło - Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Nagłówek sekcji */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <ZapIcon className="w-4 h-4 text-rose-400" /> Szybki i dyskretny dostęp
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Możesz dalej zgadywać. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Albo zacząć działać.
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            14 dni gwarancji satysfakcji. Błyskawiczny i w 100% anonimowy dostęp natychmiast po opłaceniu zamówienia.
          </p>
        </div>

        {/* Karta cennikowa */}
        <div className="mt-12 flex justify-center">
          <div className="relative group w-full max-w-md">
            
            {/* Blask za kartą */}
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-[32px] blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />

            <div className="relative rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 flex flex-col shadow-2xl shadow-rose-950/40">
              
              {/* Badge na karcie */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                Pełen Dostęp
              </div>

              <div className="text-center pt-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Plan odzyskania bliskości
                </h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                  Konkretna instrukcja dla osoby, która chce przestać słyszeć wyłącznie „nie teraz” i zrozumieć, co naprawdę zmieni sytuację.
                </p>
              </div>

              {/* Sekcja ceny */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl font-black tracking-tight text-white">149</span>
                  <span className="text-2xl font-extrabold text-rose-400">zł</span>
                </div>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  Jednorazowa opłata • Dostęp na zawsze
                </p>
              </div>

              {/* Lista korzyści */}
              <ul className="mt-8 space-y-3.5 text-sm text-slate-300">
                {FeaturesList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Przycisk CTA */}
              <Link
                href="/checkout"
                className="mt-8 block w-full text-center rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold py-4 text-base sm:text-lg shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Kupuję plan i zaczynam działać
              </Link>

              {/* Dodatkowe zabezpieczenie pod przyciskiem */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Bezpieczny zakup z 14-dniową gwarancją</span>
              </div>

            </div>
          </div>
        </div>

        {/* Footer informacji o płatnościach */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400 font-medium text-center">
          <span className="flex items-center gap-1.5">
            <LockIcon className="w-4 h-4 text-slate-500" /> Bezpieczne płatności (SSL)
          </span>
          {/* <span className="hidden sm:inline text-slate-700">•</span>
          <span>Faktura VAT dla firmy</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span>Gwarancja 14 dni na zwrot</span> */}
        </div>

      </div>
    </section>
  );
};

export default Purchase;