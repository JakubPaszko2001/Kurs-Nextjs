"use client";

import { useState } from "react";
import Link from "next/link";

export default function StopClient({ token }: { token: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const stop = async () => {
    setMsg(null);
    try {
      setBusy(true);
      const res = await fetch("/api/partner-mail/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Nie udało się.");
      setDone(true);
    } catch (e: any) {
      setMsg(e?.message || "Wystąpił błąd.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 to-purple-600/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-2xl p-8 text-center shadow-2xl">
        {done ? (
          <>
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
              ✓
            </div>
            <h1 className="text-2xl font-black text-white">Zatrzymane</h1>
            <p className="mt-3 text-slate-300 text-sm">
              Nie będziemy wysyłać kolejnych wiadomości na ten adres.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black text-white">Zatrzymać kolejne wiadomości?</h1>
            <p className="mt-3 text-slate-400 text-sm">
              Kliknij poniżej, aby zrezygnować z dalszych materiałów. Już wysłane wiadomości
              pozostają bez zmian.
            </p>

            {msg && (
              <div className="mt-4 p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                {msg}
              </div>
            )}

            <button
              onClick={stop}
              disabled={busy}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-3.5 text-base shadow-lg shadow-rose-500/25 transition-all"
            >
              {busy ? "Przetwarzanie..." : "Zatrzymaj kolejne wiadomości"}
            </button>
          </>
        )}

        <Link href="/" className="mt-6 inline-block text-xs text-slate-500 hover:text-slate-300">
          Strona główna
        </Link>
      </div>
    </div>
  );
}
