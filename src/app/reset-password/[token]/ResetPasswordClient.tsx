"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type State = "loading" | "ready" | "invalid" | "done";

export default function ResetPasswordClient({ token }: { token: string }) {
  const [state, setState] = useState<State>("loading");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/password/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => setState(d?.valid ? "ready" : "invalid"))
      .catch(() => setState("invalid"));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (password.length < 6) {
      setMsg("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (password !== password2) {
      setMsg("Hasła nie są takie same.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Nie udało się zmienić hasła.");
      setState("done");
    } catch (e: any) {
      setMsg(e?.message || "Wystąpił błąd.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans px-4 py-16 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 shadow-2xl text-center">
          {state === "loading" && (
            <div className="py-6">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-rose-500" />
              <p className="text-slate-400 text-sm">Sprawdzamy link…</p>
            </div>
          )}

          {state === "invalid" && (
            <>
              <h1 className="text-2xl font-black text-white">Link nieważny</h1>
              <p className="mt-3 text-slate-400 text-sm">
                Ten link do resetu hasła jest nieprawidłowy lub wygasł.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold py-3 px-6 shadow-lg shadow-rose-500/25"
              >
                Poproś o nowy link
              </Link>
            </>
          )}

          {state === "ready" && (
            <>
              <h1 className="text-2xl font-black text-white">Ustaw nowe hasło</h1>
              <p className="mt-3 text-slate-400 text-sm">
                Wpisz nowe hasło do swojego konta.
              </p>

              <form onSubmit={submit} className="mt-6 text-left space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Nowe hasło
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Powtórz nowe hasło
                  </label>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60"
                    required
                  />
                </div>

                {msg && (
                  <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                    {msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-3.5 text-base shadow-lg shadow-rose-500/25 transition-all"
                >
                  {busy ? "Zapisywanie..." : "Zapisz nowe hasło"}
                </button>
              </form>
            </>
          )}

          {state === "done" && (
            <>
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
                ✓
              </div>
              <h1 className="text-2xl font-black text-white">Hasło zmienione</h1>
              <p className="mt-3 text-slate-300 text-sm">
                Możesz się teraz zalogować nowym hasłem.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold py-3 px-6 shadow-lg shadow-rose-500/25"
              >
                Przejdź do logowania
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
