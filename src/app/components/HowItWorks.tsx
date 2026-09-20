import React from 'react';

const ShoppingBag = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8h12l-1 11H7L6 8Z" />
    <path d="M9 8V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3V8" />
  </svg>
);

const Search = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 5 5" />
  </svg>
);

const Sparkles = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" />
    <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />
  </svg>
);

const ArrowRight = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
);

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Kupujesz i otwierasz dostęp",
      description:
        "Otrzymujesz kompletny przewodnik i sprawdzasz, dlaczego Twoje dotychczasowe próby mogły nie przynosić efektu.",
      icon: ShoppingBag,
      badge: "Krok 1",
      glowColor: "from-rose-500/20 to-pink-500/5",
      borderColor: "group-hover:border-rose-500/50",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    {
      number: "02",
      title: "Odkrywasz, co gasi ochotę",
      description:
        "Rozpoznajesz błędy, napięcia i bariery, przez które druga osoba coraz częściej mówi „nie teraz”.",
      icon: Search,
      badge: "Krok 2",
      glowColor: "from-purple-500/20 to-indigo-500/5",
      borderColor: "group-hover:border-purple-500/50",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      number: "03",
      title: "Zaczynasz działać inaczej",
      description:
        "Wprowadzasz konkretne zmiany, które mogą pomóc odbudować napięcie, pożądanie i częstszą bliskość.",
      icon: Sparkles,
      badge: "Krok 3",
      glowColor: "from-amber-500/20 to-rose-500/5",
      borderColor: "group-hover:border-amber-500/50",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <section id="jak-to-dziala" className="relative py-20 md:py-28 bg-slate-950 text-white border-t border-white/10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-rose-600/10 to-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Prosty proces
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Jak to działa?
          </h2>
          <div className="h-1 w-12 bg-gradient-to-r from-rose-500 to-purple-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 -translate-y-8 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-amber-500/20 z-0 pointer-events-none" />

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/40 ${step.borderColor} flex flex-col justify-between z-10`}
              >
                {/* Glow Overlay */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${step.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Top Header: Badge & Big Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl border ${step.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black text-white/20 group-hover:text-white/30 transition-colors font-mono">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-200 transition-colors">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-3 text-slate-300/80 leading-relaxed text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Visual Arrow Accent for step continuation */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center gap-1 mt-6 text-xs text-white/30 font-semibold group-hover:text-white/60 transition-colors">
                    <span>Następny krok</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;