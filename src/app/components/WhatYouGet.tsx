"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type IconProps = React.ComponentProps<'svg'>;

const IconBase = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

const BookOpen = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
    <path d="M8 7h8M8 11h8" />
  </IconBase>
);

const Brain = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 3.5a3 3 0 0 0-3 3v1.2A3.2 3.2 0 0 0 9.2 11H10v1.5a2 2 0 0 1-2 2H7.5A2.5 2.5 0 0 1 5 12V8.5a3.5 3.5 0 0 1 7-1.3A3.5 3.5 0 1 1 19 12v4a3 3 0 0 1-3 3h-1.5A2.5 2.5 0 0 1 12 16.5V15h-1.2A3.2 3.2 0 0 1 7.6 11.8V10h1.4A2.4 2.4 0 0 0 11.4 7.6V7a2 2 0 0 0-2-2Z" />
    <path d="M10 14c.6 0 1 .4 1 1v1.5c0 .8-.7 1.5-1.5 1.5H9" />
    <path d="M14 10h.01M14 14h.01" />
  </IconBase>
);

const AlertTriangle = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3 21 19a2 2 0 0 1-1.7 3H4.7A2 2 0 0 1 3 19L12 3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </IconBase>
);

const MessageCircle = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 11.5a8.5 8.5 0 0 1-13.4 7.1L3 21l1.7-4.2A8.5 8.5 0 1 1 21 11.5Z" />
    <path d="M8 10h8M8 14h5" />
  </IconBase>
);

const Sparkles = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 2 1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7L12 2Z" />
    <path d="m18 14 1 2.5L21.5 18 19 19l-1 2.5L17 19l-2.5-1 2.5-1 1-2.5Z" />
    <path d="m6 14 1 2.5L9.5 18 7 19l-1 2.5L5 19l-2.5-1 2.5-1 1-2.5Z" />
  </IconBase>
);

const Calendar = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 4v3M17 4v3M4 9h16" />
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 13h3v3H8z" />
  </IconBase>
);

const Activity = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />
  </IconBase>
);

const ShieldCheck = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3 5 6v6c0 5 3.4 8.4 7 9 3.6-.6 7-4 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

const CheckCircle2 = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 12a8 8 0 1 1-8-8" />
    <path d="m9 11 2 2 5-5" />
    <circle cx="12" cy="12" r="9" />
  </IconBase>
);

const ArrowRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </IconBase>
);

const ChevronRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m9 18 6-6-6-6" />
  </IconBase>
);

const Flame = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2c1.7 2.5 2.6 4.1 2.6 5.7A4.4 4.4 0 1 1 7.2 8c0-1.8 1-3.6 2.9-5.1C10.7 3.1 11.3 2.6 12 2Z" />
    <path d="M12 10c2.3 1.6 3.6 3.2 3.6 5.1A3.6 3.6 0 1 1 8.4 15.1C8.4 13.2 9.7 11.6 12 10Z" />
  </IconBase>
);

const Award = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="M12 14v6l-2-2-2 2v-6" />
    <path d="M15 14h2.5a2.5 2.5 0 0 0 2.5-2.5V8" />
  </IconBase>
);

const Lock = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7.5A4 4 0 0 1 12 3.5a4 4 0 0 1 4 4V10" />
  </IconBase>
);

const Clock = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </IconBase>
);

const Sparkle = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2 14.3 8.7 21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.3L12 2Z" />
  </IconBase>
);

const FileText = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v5h5M9 13h6M9 17h6" />
  </IconBase>
);

const Download = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3v11" />
    <path d="m7 19 5 5 5-5" />
    <path d="M5 21h14" />
  </IconBase>
);

const Star = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 2 2.8 6.2L21 9l-5 4.8 1.3 6.2L12 0l-5.3 2.5L8 20l-5-4.8L9.2 9l6.2-1.8Z" />
  </IconBase>
);

const Check = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m5 12 4 4L19 2" />
  </IconBase>
);

const MODULES_DATA = [
  {
    id: 'ch-12',
    icon: BookOpen,
    badge: 'Moduł 01 • Baza wiedzy',
    title: '12 konkretnych rozdziałów',
    subtitle: 'Kompleksowy przewodnik po fundamentach pożądania',
    desc: 'Odkryj pełen przewodnik po pożądaniu, stresie, zdrowiu, dynamicznych zmianach w relacji i biologicznych różnicach potrzeb. Żadnego lania wody – sam konkret.',
    accentColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    highlights: [
      'Anatomia i biologia pożądania u kobiet i mężczyzn',
      'Wpływ chronicznego stresu i zmęczenia na libido',
      'Znaczenie hormonów oraz czynników zdrowotnych',
      'Jak zmienia się intymność na przestrzeni lat związku'
    ],
    readTime: 'Ok. 45 min lektury'
  },
  {
    id: 'desire-diff',
    icon: Brain,
    badge: 'Moduł 02 • Psychologia',
    title: 'Wyjaśnienie braku ochoty',
    subtitle: 'Zrozum mechanizm pożądania reaktywnego i spontanicznego',
    desc: 'Wyjaśnienie, dlaczego w większości związków dochodzi do nierównowagi potrzeb i dlaczego jedna osoba chce częściej niż druga. Dowiedz się, co dokładnie tłumi ochotę i jak to odblokować.',
    accentColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    highlights: [
      'Różnica między pożądaniem spontanicznym a reaktywnym',
      'Model hamulca i akceleratora w seksologii',
      'Dlaczego presja niszczy podniecenie u drugiej strony',
      'Jak stworzyć bezpieczną przestrzeń na ochotę'
    ],
    readTime: 'Ok. 30 min lektury'
  },
  {
    id: 'behaviors',
    icon: AlertTriangle,
    badge: 'Moduł 03 • Diagnoza',
    title: 'Lista błędów i pułapek',
    subtitle: 'Czego kategorycznie unikać, by nie gasić namiętności',
    desc: 'Poznaj powszechne zachowania i nawyki, które mimo Twoich dobrych chęci nieświadomie pogarszają sytuację i pogłębiają emocjonalny dystans.',
    accentColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    highlights: [
      '7 najczęstszych błędów po usłyszeniu odmowy',
      'Poczucie winy i "seks z obowiązku" – dlaczego to niszczy relację',
      'Pasywna agresja i ciche dni jako bariera',
      'Jak natychmiast zatrzymać błędne koło frustracji'
    ],
    readTime: 'Ok. 25 min lektury'
  },
  {
    id: 'dialogue',
    icon: MessageCircle,
    badge: 'Moduł 04 • Komunikacja',
    title: 'Sposób rozmowy o seksie',
    subtitle: 'Rozmawiaj bez pretensji, lęku i kłótni',
    desc: 'Gotowe scenariusze i schematy rozmów o bliskości bez pretensji, krytyki, wywoływania poczucia winy i doprowadzania do kolejnej awantury.',
    accentColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    highlights: [
      'Gotowe skrypty zdań otwierających rozmowę o potrzebach',
      'Technika "NVC" (Komunikacja Bez Przemocy) w łóżku',
      'Jak odpowiadać na obawy i opór partnera',
      'Sposób na omawianie fantazji i granic w bezpieczny sposób'
    ],
    readTime: 'Ok. 35 min lektury'
  },
  {
    id: 'initiative',
    icon: Sparkles,
    badge: 'Moduł 05 • Strategia',
    title: 'Plan odzyskania inicjatywy',
    subtitle: 'Odzyskaj atrakcyjność i pewność siebie',
    desc: 'Sprawdzona strategia odbudowywania napięcia seksualnego i inicjowania dotyku całkowicie naturalnie – bez presji i bez lęku przed odrzuceniem.',
    accentColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    highlights: [
      'Budowanie napięcia przez cały dzień (mikro-gesty)',
      'Sztuka nieformalnego i nieinwazyjnego dotyku',
      'Inicjowanie bliskości bez natychmiastowego oczekiwania finału',
      'Odbudowa własnej wartości niezależnie od reakcji'
    ],
    readTime: 'Ok. 40 min lektury'
  },
  {
    id: 'program',
    icon: Calendar,
    badge: 'Moduł 06 • Plan działania',
    title: '4-tygodniowy program',
    subtitle: 'Przewodnik krok po kroku od A do Z',
    desc: 'Praktyczny przewodnik podzielony na tygodnie. Poprowadzi Cię krok po kroku z miejsca odmowy i dystansu do ponownej bliskości i namiętności.',
    accentColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    highlights: [
      'Tydzień 1: Reset napięcia i stop z presją',
      'Tydzień 2: Odbudowa komunikacji i zaufania',
      'Tydzień 3: Dotyk bez oczekiwań i powrót do dotyku',
      'Tydzień 4: Świadome inicjowanie i podtrzymanie ognia'
    ],
    readTime: 'Plan na 28 dni'
  },
  {
    id: 'exercises',
    icon: Activity,
    badge: 'Moduł 07 • Praktyka',
    title: 'Praktyczne ćwiczenia',
    subtitle: 'Narzędzia do natychmiastowego wdrożenia',
    desc: 'Zestaw prostych i skutecznych ćwiczeń do wykonania samodzielnie oraz we dwoje, pomagających natychmiast przełamać lodowe bariery.',
    accentColor: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-500/10',
    borderColor: 'border-fuchsia-500/30',
    gradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
    highlights: [
      'Ćwiczenia na budowanie bezstresowego dotyku',
      'Arkusze diagnozy barier w pożądaniu dla obojga',
      'Techniki na wyciszenie układu nerwowego przed intymnością',
      'Praktyki budowania zaufania'
    ],
    readTime: '12 praktycznych kart'
  },
  {
    id: 'science',
    icon: ShieldCheck,
    badge: 'Moduł 08 • Nauka',
    title: '26 źródeł naukowych',
    subtitle: 'Zero mitów – tylko sprawdzona wiedza naukowa',
    desc: 'Fakty, badania i metody zweryfikowane na podstawie aktualnych publikacji medycznych, seksoIogicznych i terapeutycznych z całego świata.',
    accentColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    gradient: 'from-indigo-500/20 via-sky-500/10 to-transparent',
    highlights: [
      'Badania nad mechanizmem pożądania w długoletnich relacjach',
      'Prace naukowe z zakresu neurobiologii więzi',
      'Źródła z medycyny seksualnej i psychoterapii par',
      'Pełna bibliografia z odnośnikami do publikacji'
    ],
    readTime: 'Zweryfikowano medycznie'
  }
];

export default function WhatYouGetInteractive() {
  // activeTab – który moduł pokazać w prawej kolumnie na desktopie + podświetlenie na liście
  const [activeTab, setActiveTab] = useState(MODULES_DATA[0].id);
  // openMobile – który panel jest rozwinięty w akordeonie na mobile/tablecie
  const [openMobile, setOpenMobile] = useState<string>(MODULES_DATA[0].id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setOpenMobile((prev) => (prev === id ? '' : id)); // toggle tylko w akordeonie mobile
  };

      const selectedModule = MODULES_DATA.find((m) => m.id === activeTab) || MODULES_DATA[0];

  // Wspólny widok szczegółów pojedynczego modułu.
  // Używany dwa razy: w akordeonie na mobile/tablecie oraz w prawej kolumnie na desktopie.
  const renderModuleDetails = (module: (typeof MODULES_DATA)[number]) => {
    const Icon = module.icon;

    return (
      <>
        {/* Dynamic ambient gradient inside active card */}
        <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${module.gradient} blur-3xl pointer-events-none rounded-full`} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500" />

        {/* Module Header Badge & Time */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${module.bgColor} ${module.accentColor} border ${module.borderColor}`}>
            <Award className="w-3.5 h-3.5" />
            {module.badge}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {module.readTime}
          </span>
        </div>

        {/* Main Module Content */}
        <div className="relative z-10 mb-8">
          <div className={`w-14 h-14 rounded-2xl ${module.bgColor} border ${module.borderColor} flex items-center justify-center ${module.accentColor} mb-5 shadow-lg`}>
            <Icon className="w-7 h-7" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
            {module.title}
          </h3>

          <p className="text-rose-300/90 font-medium text-sm sm:text-base mb-4">
            {module.subtitle}
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {module.desc}
          </p>
        </div>

        {/* Key Bullet Highlights */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkle className="w-3.5 h-3.5 text-rose-400" />
            Co dokładnie wyciągniesz z tej części:
          </h4>

          <ul className="grid sm:grid-cols-1 gap-3">
            {module.highlights.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-200">
                <div className="mt-0.5 p-1 rounded-full bg-rose-500/20 text-rose-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Included status tag */}
        <div className="relative z-10 bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Dostępne w pełnym pakiecie</span>
          </div>

          <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">PDF</span>
        </div>
      </>
    );
  };

  return (
    <section id="co-dostajesz" className="min-h-screen bg-slate-950 text-slate-100 font-sans py-16 md:py-24 border-t border-slate-800/80 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-rose-600/10 via-purple-600/10 to-blue-600/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-rose-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Flame className="w-4 h-4 text-rose-500" /> Zawartość Poradnika
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            Co dokładnie <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">dostajesz?</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Przestań zgadywać, dlaczego znowu słyszysz <span className="text-rose-400 font-semibold">„nie”</span>. Możesz dalej próbować w ten sam sposób i liczyć, że sytuacja zmieni się sama. Możesz też wreszcie sprawdzić, co naprawdę stoi pomiędzy Tobą a bliskością, której Ci brakuje.
          </p>
        </div>

        {/* Interactive Tabs Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-20">
          
                    {/* Left Column: Interactive Nav List */}
          <div className="lg:col-span-5 space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>Wybierz moduł z listy:</span>
              <span className="text-rose-400">{MODULES_DATA.length} Modułów</span>
            </p>

                        {MODULES_DATA.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              const isOpenMobile = openMobile === item.id;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleSelect(item.id)}
                    aria-expanded={isOpenMobile}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 sm:gap-4 border group ${
                      isSelected
                        ? 'bg-slate-900/90 border-rose-500/60 shadow-lg shadow-rose-950/30 text-white ring-1 ring-rose-500/30 lg:translate-x-1'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2.5 sm:p-3 rounded-xl transition-all duration-300 shrink-0 ${
                      isSelected 
                        ? `${item.bgColor} ${item.accentColor} border ${item.borderColor}` 
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-sm sm:text-base truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.badge}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isSelected ? 'rotate-90 lg:rotate-0 text-rose-400' : 'text-slate-600 group-hover:text-slate-400'
                    }`} />
                  </button>

                                    {/* Mobile / tablet: panel rozwija się bezpośrednio pod modułem */}
                  {isOpenMobile && (
                    <div className="lg:hidden mt-2.5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      {renderModuleDetails(item)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Tab Viewer (tylko desktop) */}
          <div className="hidden lg:block lg:col-span-7">
            <div className="sticky top-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-500">
              {renderModuleDetails(selectedModule)}
            </div>
          </div>

        </div>

        {/* Clean Bottom Section & CTA Button (No Special Offers or Discounts) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl p-8 sm:p-12 md:p-16">
          
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Odbuduj bliskość i porozumienie w relacji
            </h3>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Zdobądź kompletny poradnik, program 4-tygodniowy oraz zestaw praktycznych ćwiczeń. Dostęp otrzymujesz natychmiast po złożeniu zamówienia.
            </p>

            {/* Feature Checklist */}
            <div className="grid sm:grid-cols-3 gap-4 text-left mb-10 max-w-2xl mx-auto bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Natychmiastowy dostęp</span>
              </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Format PDF</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Pełna dyskrecja</span>
              </div>
            </div>

            {/* Main CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <Link href="/checkout" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-9 py-4 sm:py-5 rounded-2xl shadow-xl shadow-rose-500/20 hover:shadow-rose-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-base sm:text-lg group">
                <span>Chcę otrzymać dostęp</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Gwarancja satysfakcji</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Bezpieczna płatność SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Zweryfikowana wiedza</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}