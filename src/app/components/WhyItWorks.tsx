import React from 'react';

/* --- Dedykowane ikony SVG --- */
const XCircle = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 8.5L15.5 15.5" />
    <path d="M15.5 8.5L8.5 15.5" />
  </svg>
);

const CheckCircle2 = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7.5 12.5L10.5 15.5L16.5 9.5" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const HelpCircle = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5A2.5 2.5 0 0 1 12 7a2.6 2.6 0 0 1 2.2 4.3c-.8.8-1.7 1.3-1.7 2.7" />
    <path d="M12 17.2h.01" />
  </svg>
);

const Sparkles = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M18.5 15l.8 2.2L21.5 18l-2.2.8L18.5 21l-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
    <path d="M5.5 15l.8 2.2L8.5 18l-2.2.8L5.5 21l-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </svg>
);

const Target = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

const ShieldAlert = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const Quote = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const WhyItWorks = () => {
  return (
    <section id="dlaczego-to-dziala" className="py-20 md:py-28 bg-slate-950 text-slate-100 font-sans border-y border-slate-800/80 relative overflow-hidden">
      
      {/* Tło i promienie światła (Ambient Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Nagłówek sekcji */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            Rozsądne podejście
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Dlaczego to <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">działa?</span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Karty Porównawcze: Czym to NIE jest vs Czym to JEST */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          
          {/* Karta 1: Czym to NIE jest */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-500/50 p-7 sm:p-9 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-purple-500">
            <div>
              <div className="flex items-center gap-3.5 mb-7">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Czym to nie jest</span>
                  <h3 className="text-xl font-bold text-white">Bez złudzeń i presji</h3>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/15">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    To nie jest poradnik o tym, żeby grzecznie czekać, przestać mieć potrzeby i pogodzić się z brakiem seksu.
                  </p>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/15">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    Nie jest to również zestaw tanich sztuczek, które mają zmusić drugą osobę do zbliżenia. Presja, pretensje i manipulacja zwykle prowadzą do jeszcze większego dystansu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Karta 2: Czym to JEST */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-500/50 p-7 sm:p-9 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-purple-500">
            <div>
              <div className="flex items-center gap-3.5 mb-7">
                <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Czym to jest</span>
                  <h3 className="text-xl font-bold text-white">Sprawdzony plan działania</h3>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/15">
                  <Sparkles className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    Ten plan pokazuje, dlaczego ochota może zanikać, które zachowania pogarszają sytuację i co możesz zrobić inaczej.
                  </p>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/15">
                  <Target className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    Nie możesz włączyć pożądania jednym zdaniem. Możesz jednak usunąć część rzeczy, które je blokują, odzyskać inicjatywę i stworzyć warunki, w których seks ma znacznie większą szansę ponownie stać się naturalną częścią Waszego związku.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dolne wyróżnienie z cytatem i obietnicą */}
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-rose-950/40 via-slate-900 to-purple-950/40 border border-rose-500/30 text-center shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Ozdobny cytat w tle */}
            <Quote className="absolute -top-3 -left-3 w-20 h-20 text-rose-500/10 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/10 blur-2xl pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-xl mx-auto space-y-2">
              <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-snug tracking-tight">
                „Nie obiecujemy cudu.”
              </p>
              <p className="text-base sm:text-lg text-rose-200/90 font-medium leading-relaxed">
                Dajemy Ci plan, z którym wreszcie możesz zacząć działać.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyItWorks;