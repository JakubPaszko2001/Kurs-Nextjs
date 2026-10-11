// src/app/book/success/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

/* --- Ikony SVG --- */
const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ArrowRight = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 18V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
    <path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-1" />
    <circle cx="7" cy="18" r="2" />
    <path d="M9 18h6" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const steps = [
  {
    icon: MailIcon,
    title: "Potwierdzenie na e-mail",
    desc: "Wysłaliśmy potwierdzenie zamówienia. Sprawdź też folder spam.",
  },
  {
    icon: TruckIcon,
    title: "Pakowanie i wysyłka",
    desc: "Zamówienie realizujemy w 1–3 dni robocze (kurier lub Paczkomat InPost).",
  },
  {
    icon: CheckCircleIcon,
    title: "Śledzenie przesyłki",
    desc: "Numer śledzenia otrzymasz e-mailem, gdy paczka wyruszy w drogę.",
  },
];

export default function BookSuccessPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden flex items-center justify-center px-4 sm:px-6 py-16">
      {/* Tło - Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-xl">
        {/* LOGO */}
        <Link
          href="/"
          className="mx-auto mb-8 flex items-center justify-center gap-2.5 group w-fit"
        >
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 transition-all">
            <HeartIcon className="w-5 h-5 text-rose-400" />
          </div>
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-white group-hover:text-rose-200 transition-colors">
            Przewodnik dla par
          </span>
        </Link>

        {/* KARTA GŁÓWNA */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 via-pink-500/20 to-purple-600/30 rounded-[32px] blur-xl opacity-50" />

          <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-rose-950/30 text-center before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-purple-500">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <CheckCircleIcon className="w-4 h-4" /> Zamówienie przyjęte
            </span>

            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TruckIcon className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Dziękujemy za zamówienie{" "}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                📦
              </span>
            </h1>

            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Płatność została przyjęta. Twoja książka jest już w drodze do
              przygotowania — szczegóły wysyłki potwierdzimy e-mailem.
            </p>

            {/* Co dalej */}
            <div className="mt-8 text-left bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Co dalej?
              </p>
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <s.icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/userpage"
                className="group/btn relative inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-4 text-base shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 active:scale-[0.98]"
              >
                <span>Przejdź do materiałów</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </Link>

              <Link
                href="/"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold px-6 py-4 text-sm transition-all duration-200"
              >
                Wróć na stronę główną
              </Link>
            </div>
          </div>
        </div>

        {/* Stopka pomocnicza */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Masz pytania? Napisz na{" "}
          <a
            href="mailto:wsparcie@twojplan.pl"
            className="text-rose-400 hover:text-rose-300 font-semibold"
          >
            wsparcie@twojplan.pl
          </a>
          . Płatność obsługiwana przez Stripe.
        </p>
      </div>
    </div>
  );
}
