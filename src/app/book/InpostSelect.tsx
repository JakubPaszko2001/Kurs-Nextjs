"use client";

import { useEffect, useMemo, useState } from "react";

type Locker = { id: string; address: string };
type ApiResponse = { cities: string[]; data: Record<string, Locker[]> };

export default function InpostSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (city: string, lockerId: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<ApiResponse | null>(null);
  const [city, setCity] = useState("");
  const [locker, setLocker] = useState(value || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/inpost/data", { cache: "no-store" });
        const json: ApiResponse = await res.json();
        if (!res.ok) throw new Error((json as any)?.error || "Fetch error");
        if (!cancelled) setApi(json);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Nie udało się pobrać punktów InPost.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const lockers = useMemo<Locker[]>(
    () => (city && api ? api.data[city] || [] : []),
    [api, city]
  );

  const onSelectCity = (c: string) => {
    setCity(c);
    setLocker("");
  };

  const onSelectLocker = (l: string) => {
    setLocker(l);
    if (city && l) onChange(city, l);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#101329] p-4">
      <div className="text-xs text-white/60 mb-2">PACZKOMAT INPOST</div>

      {error && <p className="text-rose-300 text-sm mb-2">{error}</p>}
      {loading && <p className="text-white/60 text-sm">Ładowanie listy paczkomatów…</p>}

      {!loading && api && (
        // ⬇⬇ kolumnowy układ
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-white/70 block">SELECT CITY</label>
            <select
              value={city}
              onChange={(e) => onSelectCity(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none focus:border-rose-400"
            >
              <option value="">SELECT…</option>
              {api.cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70 block">SELECT PARCEL LOCKER</label>
            <select
              value={locker}
              onChange={(e) => onSelectLocker(e.target.value)}
              disabled={!city}
              className="mt-1 w-full rounded-xl bg-[#0f1222] border border-white/10 px-3 py-2 outline-none disabled:opacity-60 focus:border-rose-400"
            >
              <option value="">{city ? "SELECT…" : "SELECT CITY FIRST"}</option>
              {lockers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.address}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
