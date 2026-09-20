"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

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

const ArrowLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function AuthPage() {
  // ▶️ Domyślnie LOGOWANIE
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setMessage("");
    setIsError(false);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setIsError(true);
          setMessage("Hasła nie są takie same.");
          return;
        }
        if (password.length < 6) {
          setIsError(true);
          setMessage("Hasło musi mieć co najmniej 6 znaków.");
          return;
        }

        setLoading(true);
        const { error } = await supabase.from("users").insert([
          {
            email,
            password, // PRODUKCJA: hashuj!
            status: "unpaid",
          },
        ]);
        setLoading(false);

        if (error) {
          setIsError(true);
          setMessage("Błąd rejestracji: " + error.message);
          return;
        }

        setIsError(false);
        setMessage("Konto utworzone pomyślnie! Teraz się zaloguj.");
        setPassword("");
        setConfirmPassword("");
        setMode("login");
      } else {
        // LOGIN
        setLoading(true);
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        setLoading(false);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setIsError(true);
          setMessage("Błąd logowania: " + (data?.error ?? res.statusText));
          return;
        }

        setIsError(false);
        setMessage("Zalogowano pomyślnie! Przekierowywanie...");
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setIsError(true);
      setMessage("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-slate-950 text-slate-100 font-sans px-4 py-12 overflow-hidden">
      
      {/* Tło - Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Przycisk Powrotu */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all hover:bg-slate-800/80"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Powrót do strony głównej</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Logo */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 transition-all">
              <HeartIcon className="w-6 h-6 text-rose-400" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Co zrobić, gdy Twoja <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              druga połówka nie chce
            </span>
          </h2>
        </div>

        {/* Karta Główna */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-[28px] blur-lg opacity-30 group-hover:opacity-45 transition duration-500" />
          
          <div className="relative rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40">
            
            {/* Przełącznik Mode (Logowanie / Rejestracja) */}
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Zaloguj się
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Zarejestruj się
              </button>
            </div>

            {/* Formularz */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                  Adres e-mail
                </label>
                <input
                  type="email"
                  placeholder="twoj.email@domena.pl"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                  Hasło
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    Powtórz hasło
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Komunikat o błędzie lub sukcesie */}
              {message && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold leading-relaxed text-center transition-all ${
                    isError
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Przycisk akcji */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-50 text-white font-extrabold py-3.5 text-base shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading
                  ? "Przetwarzanie..."
                  : mode === "login"
                  ? "Zaloguj się"
                  : "Zarejestruj konto"}
              </button>
            </form>

            {/* Dolny tekst przełączający */}
            <p className="mt-6 text-center text-xs text-slate-400 font-medium">
              {mode === "login" ? (
                <>
                  Nie masz jeszcze konta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setMessage("");
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 ml-0.5"
                  >
                    Zarejestruj się
                  </button>
                </>
              ) : (
                <>
                  Masz już konto?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 ml-0.5"
                  >
                    Zaloguj się
                  </button>
                </>
              )}
            </p>

            {/* Bezpieczny dostęp */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <LockIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Dyskretny i bezpieczny dostęp SSL</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}