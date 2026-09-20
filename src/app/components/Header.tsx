"use client";

import React, { useState } from "react";
import Link from "next/link";

/* --- Ikony SVG --- */
const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogOutIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

type HeaderProps = {
  loggedIn?: boolean;
  userEmail?: string;
};

const Header: React.FC<HeaderProps> = ({ loggedIn, userEmail }) => {
  const [signingOut, setSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await fetch("/api/logout", { method: "POST" }).catch(() => {});
      window.location.href = "/";
    } finally {
      setSigningOut(false);
    }
  };

  /* Zaktualizowana kolejność nawigacji */
  const navLinks = [
    { href: "#jak-to-dziala", label: "Jak to działa" },
    { href: "#co-dostajesz", label: "Co dostajesz" },
    { href: "#dlaczego-to-dziala", label: "Dlaczego to działa" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 transition-all">
            <HeartIcon className="w-5 h-5 text-rose-400" />
          </div>
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-white group-hover:text-rose-200 transition-colors">
            Przewodnik dla par
          </span>
        </a>

        {/* Nawigacja Desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Przyciski Akcji (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {loggedIn ? (
            <>
              {/* Moje konto */}
              <Link
                href="/userpage"
                title={userEmail || undefined}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-3.5 py-2 text-xs font-bold transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Moje konto</span>
              </Link>

              {/* Wyloguj */}
              <button
                onClick={handleLogout}
                disabled={signingOut}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 px-3.5 py-2 text-xs font-bold transition-all disabled:opacity-50"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span>{signingOut ? "Wylogowywanie..." : "Wyloguj"}</span>
              </button>
            </>
          ) : (
            /* Zaloguj się */
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 px-3.5 py-2 text-xs font-bold transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Zaloguj się</span>
            </Link>
          )}

          {/* Kup teraz */}
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-extrabold px-4 py-2 shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Kup teraz
          </Link>
        </div>

        {/* Przycisk Menu Mobilnego */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/checkout"
            className="sm:hidden inline-flex items-center justify-center rounded-xl bg-rose-500 text-white text-xs font-extrabold px-3 py-2 shadow-md shadow-rose-500/20"
          >
            Kup teraz
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            aria-label="Otwórz menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

      </div>

      {/* Menu Mobilne Rozwijane */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {loggedIn ? (
              <>
                <Link
                  href="/userpage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 py-2.5 text-sm font-bold"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Moje konto ({userEmail})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 py-2.5 text-sm font-bold"
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>{signingOut ? "Wylogowywanie..." : "Wyloguj się"}</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 py-2.5 text-sm font-bold"
              >
                <UserIcon className="w-4 h-4" />
                <span>Zaloguj się</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;