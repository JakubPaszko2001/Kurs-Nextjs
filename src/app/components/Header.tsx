"use client";

import React from "react";
import Link from "next/link";

type HeaderProps = {
  loggedIn?: boolean;
  userEmail?: string;
};

const Header: React.FC<HeaderProps> = ({ loggedIn, userEmail }) => {
  const [signingOut, setSigningOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      // jeśli masz endpoint /api/logout, to wyczyści cookie 'session'
      await fetch("/api/logout", { method: "POST" }).catch(() => {});
      // odśwież stronę / przejdź na główną
      window.location.href = "/";
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[#0f1222]/70 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 group">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-rose-400 group-hover:text-rose-300 transition-colors"
          >
            <path
              d="M12 21s-7.5-4.35-7.5-10.2A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 7.5 3.6C19.5 16.65 12 21 12 21Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
            />
          </svg>
          <span className="font-semibold tracking-tight text-sm md:text-base">
            Co zrobić, gdy Twoja druga połówka nie chce
          </span>
        </a>

        {/* Nawigacja */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="#jak-to-dziala" className="hover:text-white">
            Jak to działa
          </a>
          <a href="#co-dostajesz" className="hover:text-white">
            Co dostajesz
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>

        {/* Przyciski akcji */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              {/* Moje konto */}
              <Link
                href="/userpage"
                title={userEmail || undefined}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white active:bg-rose-600 px-4 py-2 text-sm font-semibold transition-colors"
              >
                Moje konto
              </Link>

              {/* Wyloguj */}
              <button
                onClick={handleLogout}
                disabled={signingOut}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 text-white/80 hover:bg-white/10 active:bg-white/15 px-4 py-2 text-sm font-semibold transition-colors"
              >
                {signingOut ? "Wylogowywanie..." : "Wyloguj się"}
              </button>
            </>
          ) : (
            // Zaloguj się
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white active:bg-rose-600 px-4 py-2 text-sm font-semibold transition-colors"
            >
              Zaloguj się
            </Link>
          )}

          {/* Kup teraz → checkout */}
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-400 active:bg-rose-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-rose-500/20 transition-colors"
          >
            Kup teraz – Otwórz dostęp
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
