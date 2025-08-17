import React from 'react';

const WhatYouGet = () => {
  return (
    <section id="co-dostajesz" className="py-16 md:py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-extrabold">Co dostajesz?</h2>
            <p className="mt-3 text-white/70">
              Konkretny zestaw narzędzi, który pomoże Ci odzyskać inicjatywę i bliskość w związku.
            </p>
          </div>
          <div className="md:col-span-1 space-y-4">
              <div className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✓</span>
                  <p><span className="font-bold">Zamknięty dostęp do przewodnika krok po kroku</span> – dokładnie wiesz, od czego zacząć.</p>
              </div>
              <div className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✓</span>
                  <p><span className="font-bold">Plan, który zwiększa ochotę</span> po drugiej stronie bez rozmów w złym momencie.</p>
              </div>
              <div className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✓</span>
                  <p><span className="font-bold">Scenariusze do wdrożenia od dziś</span> – subtelne, ale skuteczne.</p>
              </div>
              <div className="flex items-start gap-3">
                  <span className="text-rose-400 mt-1">✓</span>
                  <p><span className="font-bold">Efekty, które pojawiają się naturalnie</span> i… mogą się powtarzać częściej, niż zakładałeś.</p>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;