import React from "react";
import Link from "next/link";

/* --- Ikona SVG --- */
const HeartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MailIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 border-t border-slate-800/80 font-sans text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          
          {/* Lewa strona: Copyright i nazwa serwisu */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-400">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
              <HeartIcon className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-200">Co zrobić, gdy Twoja druga połówka nie chce</span>. Wszelkie prawa zastrzeżone.  © {new Date().getFullYear()}
            </p>
          </div>

          {/* Prawa strona: Nawigacja i kontakt */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            <Link
              href="/regulamin"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              Regulamin
            </Link>
            
            <span className="text-slate-800 hidden sm:inline">•</span>

            <Link
              href="/polityka-prywatnosci"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              Polityka prywatności
            </Link>

            <span className="text-slate-800 hidden sm:inline">•</span>

            <a
              href="mailto:wsparcie@twojplan.pl"
              className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition-colors duration-200"
            >
              <MailIcon className="w-4 h-4" />
              <span>Kontakt</span>
            </a>
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default Footer;