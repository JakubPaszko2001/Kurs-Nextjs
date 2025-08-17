import React from 'react';

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold">
          Pierwszy krok zrobisz teraz. Drugi krok będzie należał do Twojej drugiej połówki.
        </h2>
         <p className="mt-3 text-white/70 max-w-2xl mx-auto">
           A może trzeci, czwarty i piąty – szybciej, niż myślisz.
         </p>
        <a
          href="#kup-teraz"
          className="mt-8 shine inline-flex items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-400 active:bg-rose-600 px-6 py-3 text-base font-bold shadow-xl shadow-rose-500/25 transition-all"
        >
          Chcę poznać plan
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;