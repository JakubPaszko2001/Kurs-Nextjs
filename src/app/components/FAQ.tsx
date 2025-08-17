import React from 'react';

const FAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-24 border-t border-white/10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">Najczęstsze pytania</h2>
          <p className="mt-3 text-white/70">
            Masz inne pytanie? Napisz:{" "}
            <a href="mailto:wsparcie@twojplan.pl" className="underline decoration-dotted">
              wsparcie@twojplan.pl
            </a>
          </p>
        </div>
        <div className="mt-10 space-y-3">
          <details className="group rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer flex items-center justify-between">
              <span className="font-semibold">Czy to kurs?</span>
              <svg className="chev w-5 h-5 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-white/70">
              Nie – to praktyczny plan, który pokazuje, jak zmienić sytuację krok po kroku.
            </p>
          </details>

          <details className="group rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer flex items-center justify-between">
              <span className="font-semibold">Czy muszę od razu wprowadzać wszystko?</span>
              <svg className="chev w-5 h-5 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-white/70">
              Nie – możesz zacząć od jednego kroku. Czasem to wystarczy, żeby bliskość pojawiła się częściej, dużo częściej niż raz w tygodniu.
            </p>
          </details>

          <details className="group rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer flex items-center justify-between">
              <span className="font-semibold">Czy druga połówka się dowie?</span>
              <svg className="chev w-5 h-5 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-white/70">
              Nie – to materiał wyłącznie dla Ciebie.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQ;