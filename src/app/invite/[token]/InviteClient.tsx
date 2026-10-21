"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type State = "loading" | "ready" | "accepted" | "invalid";

export default function InviteClient({ token }: { token: string }) {
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/share/invite/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d?.valid) return setState("invalid");
        if (d.status === "accepted") return setState("accepted");
        if (d.status === "revoked") return setState("invalid");
        setState("ready");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  const accept = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg("Podaj poprawny adres e-mail.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/share/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Nie udało się zaakceptować.");
      setState("accepted");
    } catch (e: any) {
      setMsg(e?.message || "Wystąpił błąd.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 to-purple-600/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 text-center shadow-2xl">
          {state === "loading" && (
            <div className="py-6">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-rose-500" />
              <p className="text-slate-400 text-sm">Sprawdzamy zaproszenie…</p>
            </div>
          )}

          {state === "invalid" && (
            <>
              <h1 className="text-2xl font-black text-white">Link nieprawidłowy</h1>
              <p className="mt-3 text-slate-400 text-sm">
                To zaproszenie nie istnieje lub zostało unieważnione.
              </p>
              <Link href="/" className="mt-6 inline-block text-rose-400 font-semibold hover:text-rose-300">
                Wróć na stronę główną
              </Link>
            </>
          )}

          {state === "ready" && (
            <>
              <h1 className="text-2xl font-black text-white">Akceptujesz zaproszenie</h1>
              <p className="mt-3 text-slate-400 text-sm">
                Ktoś bliski udostępnił Ci bezpłatnie materiały. Potwierdź swój adres e-mail,
                a następnie będziesz otrzymywać materiał etapami — po jednej części dziennie,
                maksymalnie raz dziennie.
              </p>

              <form onSubmit={accept} className="mt-6 text-left space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Twój adres e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
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
                  {busy ? "Przetwarzanie..." : "Akceptuję i chcę otrzymywać materiał"}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  W każdej wiadomości będzie przycisk zatrzymania kolejnych wiadomości.
                </p>
              </form>
            </>
          )}

          {state === "accepted" && (
            <>
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">
                ✓
              </div>
              <h1 className="text-2xl font-black text-white">Gotowe!</h1>
              <p className="mt-3 text-slate-300 text-sm">
                Dziękujemy. Pierwszy materiał trafi do Ciebie na podany adres e-mail w ciągu
                najbliższej doby, kolejne — po jednej części dziennie.
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Kolejne wiadomości możesz w każdej chwili zatrzymać linkiem znajdującym się w mailu.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
