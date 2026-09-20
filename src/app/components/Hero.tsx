import React from 'react';
import Link from 'next/link';

/* --- Ikony SVG --- */
const ArrowRight = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const CheckCircle2 = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7.5 12.5L10.5 15.5L16.5 9.5" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const Sparkles = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M18.5 15l.8 2.2L21.5 18l-2.2.8L18.5 21l-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    <path d="M5.5 15l.8 2.2L8.5 18l-2.2.8L5.5 21l-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </svg>
);

/* Ikona podwójnych serduszek w odcieniach różu/purpury */
const HeartsIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="currentColor"
      className="text-rose-500 opacity-90"
    />
    <path
      d="M16.5 2c-1.74 0-3.41.81-4.5 2.09C10.91 2.81 9.24 2 7.5 2 4.42 2 2 4.42 2 7.5c0 1.25.37 2.41 1 3.39 1.5-2.8 4.2-4.8 7.5-5.22C11.5 3.5 13.8 2 16.5 2z"
      fill="currentColor"
      className="text-pink-400 opacity-60"
    />
  </svg>
);

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100 font-sans border-b border-slate-800/80" id="top">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[450px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-16 md:pt-28 md:pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Lewa kolumna: Nagłówki i CTA */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-400" /> Przewodnik dla par i indywidualnie
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
              Co zrobić, gdy Twoja <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">druga połówka nie chce</span>
            </h1>

            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm">
                Ty masz ochotę. Druga osoba znowu mówi „nie teraz”. A Ty coraz częściej zastanawiasz się, czy za chwilę seks całkowicie zniknie z Waszego związku.
              </p>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Nie czekaj, aż kolejne odmowy, frustracja i napięcie staną się codziennością. Poznaj konkretny plan, który pokaże Ci, co naprawdę może zabijać ochotę i co zmienić, aby zwiększyć szanse na częstszy seks oraz powrót prawdziwej bliskości.
              </p>
            </div>

            {/* Przycisk CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/checkout"
                className="group relative inline-flex justify-center items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-4 text-base sm:text-lg shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 active:scale-[0.98]"
              >
                                <span>Chcę odzyskać seks i bliskość</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Prawa kolumna: Widok opisu/karty */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-rose-500/30 p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-rose-950/20 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-purple-500">
              
              <div className="flex flex-col items-center text-center space-y-6">
                
                {/* Ikona serduszek w ramce */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center shadow-inner">
                  <HeartsIcon className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                    Szybki start
                  </span>
                  <h3 className="text-2xl font-black text-white">Dyskretny plan działania</h3>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-rose-500/15">
                    <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <strong className="text-white">Bez lania wody:</strong> Konkretne wskazówki, scenariusze rozmów i 4-tygodniowy plan, który możesz zacząć wdrażać od dzisiaj.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-rose-500/15">
                    <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Bez błagania. Bez kolejnych awantur. Bez udawania, że problemu nie ma.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;