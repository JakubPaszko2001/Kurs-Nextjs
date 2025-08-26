// src/app/api/inpost/data/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// próbujemy od najnowszej wersji do starszej
const BASES = [
  "https://api-pl-points.easypack24.net/v4/points",
  "https://api-pl-points.easypack24.net/v3/points",
  "https://api-pl-points.easypack24.net/v1/points",
];

const COMMON_QS =
  "type=parcel_locker&status=Operating&country=PL"; // ewentualnie dorzuć inne statusy

const PER_PAGE = 1000; // max duży page size

export async function GET() {
  const headers = {
    accept: "application/json",
    referer: "https://geowidget.easypack24.net",
    "user-agent": "Mozilla/5.0 (+InPost-Points-Fetch)",
  } as const;

  const errors: Array<{ base: string; page: number; status: number; msg: string }> = [];
  let all: any[] = [];

  // helper do pobierania wielu stron
  async function fetchAllFrom(base: string) {
    const collected: any[] = [];
    let page = 1;
    let safety = 0;

    while (true) {
      const url = `${base}?${COMMON_QS}&per_page=${PER_PAGE}&page=${page}`;
      // ⬇⬇ ważne: wyłączamy Next Data Cache dla dużych odpowiedzi
      const res = await fetch(url, { headers, cache: "no-store" });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        errors.push({ base, page, status: res.status, msg: msg.slice(0, 200) });
        break;
      }

      const json = await res.json();
      // różne wersje API mają różne kształty
      const items = Array.isArray(json)
        ? json
        : json?.items || json?.data || json?.points || [];

      if (!Array.isArray(items) || items.length === 0) break;

      collected.push(...items);

      if (items.length < PER_PAGE) break; // ostatnia strona
      page++;
      safety++;
      if (safety > 50) break; // bezpiecznik
    }

    return collected;
  }

  // próbuj po kolei bazowe URL-e
  for (const base of BASES) {
    const chunk = await fetchAllFrom(base);
    if (chunk.length) {
      all = chunk;
      break;
    }
  }

  if (!all.length) {
    console.error("[inpost:data] no data, details:", errors);
    return NextResponse.json({ error: "InPost API error" }, { status: 502 });
  }

  // deduplikacja po id/name/code
  const seen = new Set<string>();
  const uniq: any[] = [];
  for (const p of all) {
    const key = String(p.name || p.id || p.code || "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
  }

  // grupowanie po mieście + normalizacja
  const byCity = new Map<string, { display: string; lockers: Array<{ id: string; address: string }> }>();

  for (const p of uniq) {
    const rawCity =
      (p.address_details?.city ||
        p.address?.city ||
        p.address?.city_name ||
        p.city ||
        "") + "";

    const city = rawCity.trim();
    if (!city) continue;

    const id = (p.name || p.id || p.code || "") + "";
    if (!id) continue;

    const street = (p.address_details?.street || p.address?.street || "") + "";
    const building = (p.address_details?.building_number || p.address?.building_number || "") + "";
    const address = [street, building].filter(Boolean).join(" ").trim();

    const cityKey = city.toLocaleUpperCase("pl-PL"); // łączymy "Warszawa" i "WARSZAWA"

    if (!byCity.has(cityKey)) byCity.set(cityKey, { display: city, lockers: [] });
    byCity.get(cityKey)!.lockers.push({ id, address });
  }

  // sortowanie miast i paczkomatów
  const cities = Array.from(byCity.values())
    .sort((a, b) => a.display.localeCompare(b.display, "pl"))
    .map((x) => x.display);

  const data: Record<string, Array<{ id: string; address: string }>> = {};
  for (const [, val] of byCity) {
    data[val.display] = val.lockers.sort((a, b) => a.id.localeCompare(b.id, "pl"));
  }

  // ⬇ wynik route’u cache’ujemy na CDN 24h (bez Next Data Cache)
  return NextResponse.json(
    { cities, data },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400" } }
  );
}
