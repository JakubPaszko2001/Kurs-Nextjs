"use client";

import { useState } from "react";

/* --- Ikony SVG (spójne ze stroną) --- */
const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
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

const CheckCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const PRESETS = [1, 3, 7, 14];

export default function PartnerSendCard() {
  const [open, setOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [days, setDays] = useState(3);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const openModal = () => {
    setMsg(null);
    setDone(false);
    setOpen(true);
  };

  const start = async () => {
    setMsg(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail)) {
      setMsg("Podaj poprawny e-mail partnera.");
      return;
    }
    if (days < 1 || days > 30) {
      setMsg("Interwał musi być w zakresie od 1 do 30 dni.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/partner-mail/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerEmail, cadenceDays: days }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Błąd serwera");
      setDone(true);
      setMsg("Zaplanowano! Pierwszy rozdział trafi na wskazany adres e-mail.");
    } catch (e: any) {
      setMsg(e?.message || "Nie udało się zapisać harmonogramu.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Karta w stylu „Twoje produkty” */}
      <div className="mt-8 relative overflow-hidden rounded-3xl border border-rose-500/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <SendIcon className="w-3.5 h-3.5" />
              Nowość
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Wyślij dla drugiej połówki
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Automatycznie prześlemy kolejne rozdziały przewodnika na wskazany adres e-mail —
              co określony przez Ciebie czas. Bez Twojego udziału.
            </p>
          </div>

          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-950/60 border border-slate-800 items-center justify-center text-rose-400 shrink-0">
            <SendIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={openModal}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white px-6 py-3.5 text-sm font-extrabold shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <SendIcon className="w-4 h-4" />
            <span>Wyślij</span>
          </button>

          <span className="inline-flex items-center gap-2 text-xs text-slate-400 font-medium">
            <ClockIcon className="w-4 h-4 text-slate-500" />
            Domyślnie co 3 dni, bez limitu
          </span>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">Wyślij drugiej połówce</h3>
              <button
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                onClick={() => !busy && setOpen(false)}
                aria-label="Zamknij"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {done ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircleIcon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-extrabold text-white">Gotowe!</h4>
                <p className="mt-2 text-sm text-slate-300">{msg}</p>
                <p className="mt-4 text-xs text-slate-500">
                  Rozdziały będą wysyłane automatycznie co{" "}
                  <span className="font-bold text-rose-400">{days}</span>{" "}
                  {days === 1 ? "dzień" : "dni"}.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold py-3.5 text-sm shadow-lg shadow-rose-500/25 transition-all"
                >
                  Zamknij
                </button>
              </div>
            ) : (
              <div className="pt-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    E-mail drugiej połówki
                  </label>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="partner@przyklad.pl"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    <ClockIcon className="w-3.5 h-3.5" /> Co ile dni wysyłać?
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setDays(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                          days === p
                            ? "border-rose-500/50 bg-rose-500/10 text-white"
                            : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {p} {p === 1 ? "dzień" : "dni"}
                      </button>
                    ))}
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={days}
                      onChange={(e) =>
                        setDays(Math.min(30, Math.max(1, Number(e.target.value) || 1)))
                      }
                      className="w-20 rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm text-center focus:outline-none focus:border-rose-500/60"
                      aria-label="Własny interwał w dniach"
                    />
                  </div>
                </div>

                {msg && (
                  <div className="p-3 rounded-xl border text-xs font-semibold text-center bg-rose-500/10 border-rose-500/30 text-rose-300">
                    {msg}
                  </div>
                )}

                <button
                  disabled={busy}
                  onClick={start}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-60 text-white font-extrabold py-3.5 text-base shadow-lg shadow-rose-500/25 transition-all inline-flex items-center justify-center gap-2"
                >
                  {busy ? (
                    "Zapisywanie…"
                  ) : (
                    <>
                      <MailIcon className="w-4 h-4" /> Zacznij wysyłkę
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  Pierwszy rozdział wyślemy automatycznie. Kolejne — zgodnie z wybranym interwałem.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
