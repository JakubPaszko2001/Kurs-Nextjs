import React from 'react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden" id="top">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-transparent to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-rose-500/20 blur-3xl"></div>
      <div className="absolute -bottom-56 -right-40 w-[42rem] h-[42rem] rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:pt-24 md:pb-20 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Co zrobić, gdy Twoja <span className="text-rose-400">druga połówka nie chce</span>
            </h1>
            <p className="mt-5 text-white/80 text-lg max-w-xl">
              Czy raz w tygodniu Ci wystarczy? A może chcesz 2, 3… albo 7 razy więcej (również powodów aby się do siebie zbliżyć 😉)
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#kup-teraz"
                className="shine inline-flex justify-center items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-400 active:bg-rose-600 px-6 py-3 text-base font-bold shadow-xl shadow-rose-500/25 transition-all"
              >
                Chcę poznać plan
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
              <div className="h-full w-full grid place-items-center bg-grid text-center p-8">
                <div className="max-w-sm mx-auto">
                  <div className="text-6xl">🤫</div>
                  <p className="mt-3 text-lg font-semibold">Dyskretny plan działania</p>
                  <p className="mt-2 text-white/70">
                    Otrzymujesz konkretne wskazówki, które wdrażasz w swoim tempie.
                  </p>
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