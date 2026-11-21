"use client";

import React from "react";
import { DEFAULT_CONTENT } from '../lib/siteContent';

/* --- Ikona Pytania / Pomocy --- */
const HelpCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FAQIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const FAQ = ({ content = {} }: { content?: Record<string, string> }) => {
  const c = (key: string) => content[key] ?? DEFAULT_CONTENT[key] ?? "";
  const faqItems = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    question: c(`faq_q${n}_question`),
    answer: c(`faq_q${n}_answer`),
  }));

  return (
    <section id="faq" className="relative overflow-hidden bg-slate-950 py-20 md:py-32 text-slate-100 font-sans border-t border-slate-800/80">
      {/* Tło - Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-600/10 via-rose-600/15 to-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Nagłówek sekcji */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <HelpCircleIcon className="w-4 h-4 text-rose-400" /> {c('faq_badge')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {c('faq_title')}
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            {c('faq_contact_label')}{" "}
            <a
              href={`mailto:${c('footer_email')}`}
              className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 decoration-rose-500/40 transition-colors"
            >
              {c('footer_email')}
            </a>
          </p>
        </div>

        {/* Lista pytań i odpowiedzi */}
        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-rose-500/30 transition-all duration-200 backdrop-blur-sm p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white group-open:text-rose-300 transition-colors">
                <span>{item.question}</span>
                <div className="p-1 rounded-xl bg-slate-800/60 border border-slate-700/50 group-hover:border-rose-500/30 group-open:bg-rose-500/10 group-open:text-rose-400 text-slate-400 shrink-0 transition-all duration-300 group-open:rotate-180">
                  <FAQIcon className="w-5 h-5" />
                </div>
              </summary>

              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/60 pt-4">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
