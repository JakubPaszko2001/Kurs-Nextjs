import React from 'react';

const HowItWorks = () => {
  return (
    <section id="jak-to-dziala" className="py-16 md:py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">Jak to działa?</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-2">1</div>
            <h3 className="text-xl font-bold">Kupujesz i logujesz się</h3>
            <p className="mt-2 text-white/70">
              Kupujesz przewodnik i logujesz się do swojej prywatnej strefy.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-2">2</div>
            <h3 className="text-xl font-bold">Wdrażasz plan</h3>
            <p className="mt-2 text-white/70">
              Wdrażasz plan w swoim tempie – bez presji, ale z konkretnymi wskazówkami.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-2">3</div>
            <h3 className="text-xl font-bold">Obserwujesz efekty</h3>
            <p className="mt-2 text-white/70">
              Obserwujesz, jak zmienia się nastawienie Twojej drugiej połówki – i jak często pojawiają się momenty bliskości.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;