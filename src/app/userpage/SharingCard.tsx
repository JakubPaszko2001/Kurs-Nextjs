"use client";

import { useState } from "react";

const ShareIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const BookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export default function SharingCard() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setErr(null);
    setLink(null);
    setCopied(false);
    setBusy(true);
    try {
      const res = await fetch("/api/share/invite", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Nie udało się utworzyć zaproszenia.");
      // Budujemy absolutny link na podstawie bieżącej domeny, jeśli backend zwrócił względny
      const raw: string = data.url || "";
      const abs = raw.startsWith("http") ? raw : `${window.location.origin}${raw || `/invite/${data.token}`}`;
      setLink(abs);
    } catch (e: any) {
      setErr(e?.message || "Wystąpił błąd.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErr("Nie udało się skopiować — zaznacz link ręcznie.");
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShareIcon className="w-3.5 h-3.5" />
            Dla Was dwojga
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">Podziel się lub zamów papier</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Możesz bezpłatnie udostępnić materiał drugiej osobie albo zamówić wersję drukowaną.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setOpen(true);
              generate();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white px-5 py-3.5 text-sm font-extrabold shadow-xl shadow-rose-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <ShareIcon className="w-4 h-4" />
            <span>Udostępnij drugiej osobie bezpłatnie</span>
          </button>

          <a
            href="/book-order"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 hover:bg-slate-900 text-slate-200 hover:text-white px-5 py-3.5 text-sm font-bold transition-all"
          >
            <BookIcon className="w-4 h-4" />
            <span>Zamów wersję drukowaną</span>
          </a>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Prywatne zaproszenie</h3>
              <button
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
                onClick={() => !busy && setOpen(false)}
                aria-label="Zamknij"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Skopiuj link i przekaż go drugiej osobie w dowolny sposób. Gdy go otworzy,
              sama poda swój e-mail i od tego momentu będzie otrzymywać materiał etapami —
              jedna część dziennie.
            </p>

            {busy && (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-rose-500" />
                Generujemy link…
              </div>
            )}

            {err && (
              <div className="mt-4 p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                {err}
              </div>
            )}

            {link && (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-slate-300 break-all">
                  {link}
                </div>
                <button
                  onClick={copy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold py-3.5 text-sm shadow-lg shadow-rose-500/25 transition-all"
                >
                  <CopyIcon className="w-4 h-4" />
                  {copied ? "Skopiowano!" : "Kopiuj link"}
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Link jest prywatny — udostępniaj go tylko zaufanej osobie.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
