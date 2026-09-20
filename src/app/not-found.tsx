import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strona nie znaleziona (404)",
  robots: { index: false, follow: false },
};

/* --- Ikony SVG --- */
const ArrowLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const AlertTriangleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Wielowarstwowy Glow w tle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-xl text-center">
        {/* Szklana Karta */}
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          {/* Badge & Ikona */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
            <AlertTriangleIcon className="w-4 h-4" />
            <span>Błąd 404</span>
          </div>

          {/* Główna cyfra 404 */}
          <p className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-none tracking-tight select-none">
            404
          </p>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Nie znaleźliśmy tej strony
          </h1>

          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Wygląda na to, że ten adres nie istnieje lub został przeniesiony pod inny adres.
          </p>

          {/* Przyciski Akcji */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-6 py-3.5 text-sm shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Strona główna</span>
            </Link>

            <Link
              href="/checkout"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold px-6 py-3.5 text-sm transition-all duration-200"
            >
              <ShoppingBagIcon className="w-4 h-4 text-rose-400" />
              <span>Zobacz ofertę</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}