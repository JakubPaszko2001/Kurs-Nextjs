"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Błąd logowania.");
      }
      router.replace("/admin");
    } catch (e: any) {
      setError(e?.message || "Błąd logowania.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white text-center">Panel admina</h1>
          <p className="mt-2 text-xs text-slate-400 text-center">
            Dostęp chroniony hasłem.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60"
                required
                autoFocus
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
              {loading ? "Sprawdzanie..." : "Zaloguj"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
