"use client";
import { useMemo, useState } from "react";

export default function PartnerMailCta({
  chapterId,
  maxChapters = 3,
}: {
  chapterId: number;
  maxChapters?: number;
}) {
  const isLast = useMemo(() => chapterId >= maxChapters, [chapterId, maxChapters]);
  const [open, setOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [days, setDays] = useState(3);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isLast) return null;

  const start = async () => {
    setMsg(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail)) {
      setMsg("Podaj poprawny e-mail partnera.");
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
      setMsg("✅ Zaplanowano. Pierwszy rozdział wyślemy przy najbliższym uruchomieniu cron.");
      setTimeout(() => setOpen(false), 1200);
    } catch (e: any) {
      setMsg(e.message || "Nie udało się zapisać harmonogramu.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
      <h3 className="text-xl font-semibold">Wyślij treść partnerowi</h3>
      <p className="text-white/70 mt-1">
        Automatycznie prześlemy PDF-y z rozdziałami co <strong>3 dni</strong> (domyślnie) na wskazany adres e-mail.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-4 rounded-xl bg-rose-500 hover:bg-rose-400 px-4 py-2 font-semibold"
      >
        Wyślij partnerowi (co 3 dni)
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1d2e] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Wyślij kurs partnerowi</h4>
              <button className="text-white/60 hover:text-white" onClick={() => !busy && setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-sm text-white/70">E-mail partnera</label>
              <input
                type="email"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                placeholder="partner@przyklad.pl"
                className="w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-white/20"
              />

              <label className="block text-sm text-white/70">Co ile dni wysyłać?</label>
              <input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Math.min(30, Math.max(1, Number(e.target.value) || 3)))}
                className="w-28 rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-white/20"
              />

              {msg && <p className="text-sm mt-1">{msg}</p>}

              <button
                disabled={busy}
                onClick={start}
                className="mt-2 w-full rounded-xl bg-rose-500 hover:bg-rose-400 px-4 py-2 font-semibold disabled:opacity-60"
              >
                {busy ? "Zapisywanie…" : "Zacznij wysyłkę"}
              </button>

              <p className="text-xs text-white/60">Możesz nas poprosić później o pauzę/wznowienie.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
