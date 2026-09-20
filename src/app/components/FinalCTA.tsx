"use client";



import React from "react";
import Link from "next/link";

/* --- Ikona Strzałki / Akcji --- */
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

const HeartHandshake = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9" />
  </svg>
);

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 md:py-32 text-slate-100 font-sans border-t border-slate-800/80">
      {/* Tło - Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-rose-500/30 p-8 sm:p-12 md:p-16 backdrop-blur-xl text-center shadow-2xl shadow-rose-950/30 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-purple-500">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest shadow-sm mb-6">
            <HeartHandshake className="w-4 h-4 text-rose-400" /> Czas na decyzję
          </div>

          {/* Nagłówek */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white max-w-3xl mx-auto">
            Za miesiąc możesz być{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              dokładnie w tym samym miejscu
            </span>
          </h2>

          {/* Opis */}
          <div className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto space-y-4">
            <p className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-2xl text-slate-300">
              Kolejne „nie dzisiaj”. Kolejne rozczarowanie. Kolejny wieczór, podczas którego oboje udajecie, że wszystko jest w porządku.
            </p>
            <p className="font-semibold text-white">
              Albo pierwszy konkretny krok w stronę zmiany.
            </p>
            <p className="text-slate-400 text-sm sm:text-base">
              Nie masz pełnej kontroli nad ochotą drugiej osoby. Masz jednak wpływ na to, co zrobisz teraz, jak rozpoczniesz rozmowę i czy przestaniesz powtarzać schemat, który do tej pory nie działał.
            </p>
                    </div>

          {/* Przycisk CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/checkout"
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-4 text-base sm:text-lg shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 active:scale-[0.98]"
            >
              <span>Chcę zmienić tę sytuację</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;