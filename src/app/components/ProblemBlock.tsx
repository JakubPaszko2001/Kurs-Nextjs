"use client";

import React from "react";

const ArrowDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const ProblemBlock: React.FC = () => {
  const scrollToPurchase = () => {
    const el = document.getElementById("kup-teraz");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden bg-[#0f1222] py-20 md:py-32 text-white font-sans border-t border-slate-800/80">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
          Najgorsza nie jest jedna odmowa.{" "}
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Najgorsze jest to, co dzieje się później.
          </span>
        </h2>

        <div className="mt-8 space-y-5 text-slate-300 text-base sm:text-lg leading-relaxed text-left sm:text-center">
          <p>
            Najpierw słyszysz «nie dzisiaj». Później przestajesz pytać, bo nie
            chcesz znowu poczuć się odrzucony albo odrzucona. Dotyk staje się
            ostrożny. Rozmowy coraz krótsze. Jedna osoba czuje presję, druga
            frustrację.
          </p>
          <p>
            W końcu oboje zaczynacie zachowywać się tak, jakby seks przestał być
            ważny. Ale problem nie znika.{" "}
            <span className="text-white font-semibold">
              Rośnie pomiędzy Wami.
            </span>
          </p>
        </div>

        <p className="mt-10 text-lg sm:text-xl font-bold text-white leading-relaxed">
          Ten plan pomoże Ci przerwać ten schemat, zanim brak seksu stanie się
          Waszą nową normalnością.
        </p>

        <button
          type="button"
          onClick={scrollToPurchase}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-4 text-base sm:text-lg shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Nie chcę już tkwić w tym schemacie</span>
          <ArrowDownIcon className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default ProblemBlock;
