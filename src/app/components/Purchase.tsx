"use client";

import React from "react";
import Link from "next/link";

const Purchase: React.FC = () => {
  return (
    <section id="kup-teraz" className="py-16 md:py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Otwórz dostęp do planu
          </h2>
          <p className="mt-3 text-white/70">
            Gwarancja satysfakcji 14 dni. Dostęp natychmiast po zakupie.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="relative rounded-3xl border-2 border-rose-400 bg-[#0f1222] p-8 flex flex-col shadow-[0_0_60px_-12px_rgba(244,63,94,.4)] max-w-md w-full">
            <h3 className="text-xl font-bold">Pełen Dostęp do Przewodnika</h3>
            <p className="mt-1 text-white/70">
              Wszystko, czego potrzebujesz, w jednym miejscu.
            </p>

            <div className="mt-4 text-4xl font-extrabold">149 zł</div>
            <p className="text-sm text-white/60">
              Jednorazowa opłata, dostęp na zawsze.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li>✓ Dostęp do wszystkich materiałów</li>
              <li>✓ Plan krok po kroku</li>
              <li>✓ Scenariusze rozmów i działań</li>
              <li>✓ Dyskrecja i prywatność</li>
            </ul>

            {/* Przejście do podstrony sprzedaży */}
            <Link
              href="/checkout"
              className="mt-8 block w-full text-center rounded-2xl bg-rose-500 hover:bg-rose-400 active:bg-rose-600 font-bold py-3 shine transition-all"
            >
              Kupuję i otwieram dostęp
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/60">
          Bezpieczne płatności • Faktura dla firmy • Gwarancja 14 dni
        </p>
      </div>
    </section>
  );
};

export default Purchase;
