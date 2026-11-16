"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Nie udało się wysłać wiadomości.");
      }
      setSent(true);
    } catch (e: any) {
      setError(e?.message || "Wystąpił błąd.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans px-4 py-16 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 shadow-2xl">
          {!sent ? (
            <>
              <h1 className="text-2xl font-black text-white text-center">
                Nie pamiętasz hasła?
              </h1>
              <p className="mt-3 text-slate-400 text-sm text-center">
                Podaj adres e-mail przypisany do konta. Wyślemy link do ustawienia
                nowego hasła.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj.email@domena.pl"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-3.5 text-base shadow-lg shadow-rose-500/25 transition-all"
                >
                  {loading ? "Wysyłanie..." : "Wyślij link do resetu"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
                ✉
              </div>
              <h1 className="text-2xl font-black text-white text-center">
                Sprawdź skrzynkę
              </h1>
              <p className="mt-3 text-slate-300 text-sm text-center">
                Jeśli konto z adresem <strong>{email}</strong> istnieje, wysłaliśmy
                na nie link do resetu hasła. Link jest ważny 60 minut.
              </p>
              <p className="mt-3 text-xs text-slate-500 text-center">
                Nie widzisz wiadomości? Sprawdź folder spam.
              </p>
            </>
          )}

          <div className="mt-6 text-center text-xs">
            <Link
              href="/login"
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              ← Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
