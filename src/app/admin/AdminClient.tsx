"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Tab = "book" | "users" | "content" | "pricing" | "coupons";

type ContentField = {
  key: string;
  label: string;
  group: string;
  type: "text" | "textarea";
  defaultValue: string;
};

type BookOrder = Record<string, any>;
type User = { id: any; email: string; status: string; price?: number | null; price_original?: number | null; price_list?: number | null; coupon_code?: string | null; created_at?: string };
type ContentVersion = {
  id: number;
  created_at: string;
  saved_by?: string | null;
  label?: string | null;
  changed_count?: number;
  changes?: Record<string, string>;
};

export default function AdminClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("book");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [bookOrders, setBookOrders] = useState<BookOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [edit, setEdit] = useState<{ id: any; patch: Record<string, any> } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  // --- Treści strony ---
  const [contentFields, setContentFields] = useState<ContentField[]>([]);
  const [contentValues, setContentValues] = useState<Record<string, string>>({});
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  // --- Historia wersji ---
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [showVersions, setShowVersions] = useState(false);

  // --- Ceny ---
  type PricingForm = {
    coursePrice: number;
    courseOriginal: number;
    coursePromoLabel: string;
    coursePromoActive: boolean;
    bookPrice: number;
    shippingStandard: number;
    shippingExpress: number;
  };
  const [pricing, setPricing] = useState<PricingForm>({
    coursePrice: 14900,
    courseOriginal: 20000,
    coursePromoLabel: "",
    coursePromoActive: true,
    bookPrice: 9900,
    shippingStandard: 490,
    shippingExpress: 1990,
  });
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);

  // --- Kupony ---
  type AdminCoupon = {
    code: string;
    percent: number;
    active: boolean;
    max_uses: number | null;
    uses: number;
    expires_at: string | null;
    note: string | null;
  };
  type CouponDraft = {
    code: string;
    percent: number;
    active: boolean;
    max_uses: string;
    expires_at: string; // yyyy-MM-dd lub ""
    note: string;
  };
  const emptyCoupon = (): CouponDraft => ({
    code: "",
    percent: 10,
    active: true,
    max_uses: "",
    expires_at: "",
    note: "",
  });
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponDraft, setCouponDraft] = useState<CouponDraft>(emptyCoupon());
  const [couponEditing, setCouponEditing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Błąd pobierania danych.");
      setStats(d.stats);
      setBookOrders(d.bookOrders || []);
      setUsers(d.users || []);
      if (d?.errors?.book || d?.errors?.users) {
        setErr(
          [d.errors.book && "book_orders: " + d.errors.book, d.errors.users && "users: " + d.errors.users]
            .filter(Boolean)
            .join(" • ")
        );
      }
    } catch (e: any) {
      setErr(e?.message || "Błąd.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const loadContent = useCallback(async () => {
    setContentLoading(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Błąd pobierania treści.");
      setContentFields(d.fields || []);
      setContentValues(d.values || {});
      if (d?.dbError) {
        setFlash("Uwaga baza: " + d.dbError + " (działają teksty domyślne)");
      }
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    } finally {
      setContentLoading(false);
    }
  }, [router]);


  const saveContent = async () => {
    setContentSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: contentValues }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Nie udało się zapisać treści.");
      setFlash("Zapisano treści. Odśwież stronę główną, aby zobaczyć zmiany.");
      loadVersions();
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    } finally {
      setContentSaving(false);
    }
  };

  const loadVersions = useCallback(async () => {
    setVersionsLoading(true);
    try {
      const res = await fetch("/api/admin/versions", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Błąd pobierania wersji.");
      setContentVersions(d.versions || []);
    } catch (e: any) {
      setFlash("Błąd wersji: " + (e?.message || ""));
    } finally {
      setVersionsLoading(false);
    }
  }, [router]);

  const restoreFromVersion = async (id: number) => {
    if (!confirm(`Przywrócić wersję #${id}? Bieżący stan zostanie zapisany jako nowa wersja (będzie można cofnąć).`)) {
      return;
    }
    setRestoringId(id);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/versions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Nie udało się przywrócić wersji.");
      setFlash("Przywrócono wersję #" + id + ". Odświeżam treści…");
      await loadContent();
      await loadVersions();
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    } finally {
      setRestoringId(null);
    }
  };

  const loadPricing = useCallback(async () => {
    setPricingLoading(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/pricing", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Błąd pobierania cen.");
      if (d?.pricing) setPricing(d.pricing);
    } catch (e: any) {
      setFlash("Błąd cen: " + (e?.message || ""));
    } finally {
      setPricingLoading(false);
    }
  }, [router]);

  const savePricing = async () => {
    setPricingSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Nie udało się zapisać cen.");
      setFlash("Zapisano ceny. Odśwież stronę główną / checkout, aby zobaczyć zmiany.");
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    } finally {
      setPricingSaving(false);
    }
  };

  const setPricingField = <K extends keyof PricingForm>(key: K, value: PricingForm[K]) =>
    setPricing((prev) => ({ ...prev, [key]: value }));

  // Ładuj treści i ceny po przejściu na zakładkę


  // --- Kupony: CRUD ---
  const loadCoupons = useCallback(async () => {
    setCouponsLoading(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/coupons", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Błąd pobierania kuponów.");
      setCoupons(d.coupons || []);
    } catch (e: any) {
      setFlash("Błąd kuponów: " + (e?.message || ""));
    } finally {
      setCouponsLoading(false);
    }
  }, [router]);

  const resetCouponDraft = () => {
    setCouponDraft(emptyCoupon());
    setCouponEditing(null);
  };

  const editCoupon = (c: AdminCoupon) => {
    setCouponEditing(c.code);
    setCouponDraft({
      code: c.code,
      percent: c.percent,
      active: c.active,
      max_uses: c.max_uses == null ? "" : String(c.max_uses),
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
      note: c.note || "",
    });
  };

  const saveCoupon = async () => {
    setCouponSaving(true);
    setFlash(null);
    try {
      const isEdit = couponEditing !== null;
      const payload = {
        code: couponDraft.code.trim().toUpperCase(),
        percent: Number(couponDraft.percent),
        active: couponDraft.active,
        max_uses: couponDraft.max_uses.trim() === "" ? null : Number(couponDraft.max_uses),
        expires_at: couponDraft.expires_at ? new Date(couponDraft.expires_at + "T23:59:59").toISOString() : null,
        note: couponDraft.note.trim() || null,
      };
      const res = await fetch("/api/admin/coupons", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Nie udało się zapisać kuponu.");
      setFlash(isEdit ? "Zaktualizowano kupon." : "Dodano kupon.");
      resetCouponDraft();
      await loadCoupons();
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    } finally {
      setCouponSaving(false);
    }
  };

  const removeCoupon = async (code: string) => {
    if (!confirm(`Usunąć kupon ${code}?`)) return;
    setFlash(null);
    try {
      const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Nie udało się usunąć kuponu.");
      setFlash("Usunięto kupon.");
      if (couponEditing === code) resetCouponDraft();
      await loadCoupons();
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    }
  };

  useEffect(() => {
    if (tab === "content" && contentFields.length === 0) {
      loadContent();
      loadVersions();
    }
    if (tab === "pricing") {
      loadPricing();
    }
    if (tab === "coupons") {
      loadCoupons();
    }
  }, [tab, contentFields.length, loadContent, loadVersions, loadPricing, loadCoupons]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const startEdit = (table: "book" | "users", row: any) => {
    setFlash(null);
    if (table === "book") {
      setEdit({
        id: row.id,
        patch: {
          status: row.status ?? "",
          customer_name: row.customer_name ?? "",
          customer_phone: row.customer_phone ?? "",
          shipping_address_line1: row.shipping_address_line1 ?? "",
          shipping_city: row.shipping_city ?? "",
          shipping_postal_code: row.shipping_postal_code ?? "",
        },
      });
    } else {
      setEdit({ id: row.id, patch: { status: row.status ?? "" } });
    }
  };

  const save = async () => {
    if (!edit) return;
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: tab === "book" ? "book_orders" : "users",
          id: edit.id,
          patch: edit.patch,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Nie udało się zapisać.");
      setEdit(null);
      setFlash("Zapisano zmiany.");
      await load();
    } catch (e: any) {
      setFlash("Błąd: " + (e?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const fmtMoney = (grosze: any, currency = "pln") => {
    if (grosze == null) return "—";
    const v = Number(grosze) / 100;
    try {
      return v.toLocaleString("pl-PL", { style: "currency", currency: (currency || "pln").toUpperCase() });
    } catch {
      return v.toFixed(2) + " " + currency;
    }
  };
  const fmtDate = (s: any) => (s ? new Date(s).toLocaleString("pl-PL") : "—");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-black">Panel admina</h1>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={load} className="text-slate-400 hover:text-white">Odśwież</button>
            <button
              onClick={logout}
              className="rounded-xl bg-rose-500/90 hover:bg-rose-500 px-4 py-2 font-bold text-white"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        {/* Statystyki */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              ["Zamówienia książki", stats.bookTotal],
              ["Książki opłacone", stats.bookPaid],
              ["Książki nieopłacone", stats.bookPending],
              ["Konta", stats.usersTotal],
              ["Kurs opłacony", stats.usersPaid],
              ["Kurs nieopłacony", stats.usersUnpaid],
            ].map(([label, val], i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-2xl font-black text-white">{String(val)}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        )}

        {err && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs p-3">
            {err}
          </div>
        )}
        {flash && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs p-3">
            {flash}
          </div>
        )}

        {/* Zakładki */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("book")}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === "book" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            Zamówienia książki
          </button>
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === "users" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            Konta kursu
          </button>
          <button
            onClick={() => setTab("content")}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === "content" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            Treści strony
          </button>
          <button
            onClick={() => setTab("pricing")}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === "pricing" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            Ceny
          </button>
          <button
            onClick={() => setTab("coupons")}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === "coupons" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            Kupony
          </button>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm py-10 text-center">Ładowanie…</div>
        ) : tab === "content" ? (
          <div className="space-y-6">
            {contentLoading ? (
              <div className="text-slate-400 text-sm py-10 text-center">Ładowanie treści…</div>
            ) : (
              (() => {
                const groups = Array.from(
                  new Set(contentFields.map((f) => f.group))
                );
                return groups.map((g) => (
                  <div key={g} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
                    <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
                      {g}
                    </h3>
                    <div className="space-y-4">
                      {contentFields
                        .filter((f) => f.group === g)
                        .map((f) => (
                          <div key={f.key}>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              {f.label}
                            </label>
                            {f.type === "textarea" ? (
                              <textarea
                                value={contentValues[f.key] ?? ""}
                                onChange={(e) =>
                                  setContentValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                                }
                                rows={3}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                              />
                            ) : (
                              <input
                                value={contentValues[f.key] ?? ""}
                                onChange={(e) =>
                                  setContentValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                                }
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                              />
                            )}
                            <div className="mt-1 text-[10px] text-slate-600">
                              klucz: {f.key}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ));
              })()
            )}

            {/* Historia wersji */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
              <button
                type="button"
                onClick={() => {
                  setShowVersions((v) => !v);
                  if (!showVersions && contentVersions.length === 0) loadVersions();
                }}
                className="w-full flex items-center justify-between gap-3 text-left"
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-rose-400">
                  Historia wersji {contentVersions.length > 0 ? `(${contentVersions.length})` : ""}
                </h3>
                <span className="text-slate-400 text-xs font-bold">{showVersions ? "Ukryj" : "Pokaż"}</span>
              </button>

              {showVersions && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-end">
                    <button
                      onClick={loadVersions}
                      disabled={versionsLoading}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold disabled:opacity-60"
                    >
                      {versionsLoading ? "Ładowanie…" : "Odśwież listę"}
                    </button>
                  </div>

                  {contentVersions.length === 0 && !versionsLoading && (
                    <div className="text-slate-500 text-xs py-4 text-center">
                      Brak zapisanych wersji. Wersja powstaje przy każdym zapisie treści.
                    </div>
                  )}

                  {contentVersions.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-white font-semibold">
                            #{v.id} <span className="text-slate-400 font-normal">· {fmtDate(v.created_at)}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {v.label || "Zapis treści"}
                            {typeof v.changed_count === "number" && v.changed_count > 0 && (
                              <span className="text-amber-400 font-semibold"> · {v.changed_count} {v.changed_count === 1 ? "zmiana" : v.changed_count < 5 ? "zmiany" : "zmian"}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => restoreFromVersion(v.id)}
                          disabled={restoringId === v.id}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-60"
                        >
                          {restoringId === v.id ? "Przywracanie…" : "Przywróć"}
                        </button>
                      </div>
                      {v.changes && Object.keys(v.changes).length > 0 && (
                        <div className="mt-2 border-t border-slate-800/80 pt-2">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Zmienione pola:</div>
                          <ul className="space-y-0.5">
                            {Object.entries(v.changes).map(([key, label]) => (
                              <li key={key} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                <span className="text-rose-400 mt-0.5">•</span>
                                <span className="min-w-0">
                                  <span className="font-semibold">{label}</span>
                                  <span className="text-slate-600"> ({key})</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={loadContent}
                disabled={contentLoading || contentSaving}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Odrzuć zmiany
              </button>
              <button
                onClick={saveContent}
                disabled={contentSaving}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold disabled:opacity-60"
              >
                {contentSaving ? "Zapisywanie…" : "Zapisz treści"}
              </button>
            </div>
          </div>
        ) : tab === "coupons" ? (
          <div className="space-y-6">
            {/* Formularz dodawania / edycji */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
                {couponEditing ? `Edytuj kupon: ${couponEditing}` : "Nowy kupon"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Kod</label>
                  <input
                    value={couponDraft.code}
                    disabled={couponEditing !== null}
                    onChange={(e) => setCouponDraft({ ...couponDraft, code: e.target.value.toUpperCase() })}
                    placeholder="np. WIOSNA25"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Rabat (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={couponDraft.percent}
                    onChange={(e) => setCouponDraft({ ...couponDraft, percent: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Limit użyć (opcjonalnie)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponDraft.max_uses}
                    onChange={(e) => setCouponDraft({ ...couponDraft, max_uses: e.target.value })}
                    placeholder="bez limitu"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ważny do (opcjonalnie)</label>
                  <input
                    type="date"
                    value={couponDraft.expires_at}
                    onChange={(e) => setCouponDraft({ ...couponDraft, expires_at: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Notatka (opcjonalnie)</label>
                  <input
                    value={couponDraft.note}
                    onChange={(e) => setCouponDraft({ ...couponDraft, note: e.target.value })}
                    placeholder="np. kampania e-mail luty"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={couponDraft.active}
                      onChange={(e) => setCouponDraft({ ...couponDraft, active: e.target.checked })}
                      className="h-4 w-4 accent-rose-500"
                    />
                    Aktywny
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                {couponEditing && (
                  <button onClick={resetCouponDraft} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                    Anuluj edycję
                  </button>
                )}
                <button
                  onClick={saveCoupon}
                  disabled={couponSaving}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold disabled:opacity-60"
                >
                  {couponSaving ? "Zapisywanie…" : couponEditing ? "Zapisz zmiany" : "Dodaj kupon"}
                </button>
              </div>
            </div>

            {/* Lista kuponów */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
                  Kupony ({coupons.length})
                </h3>
                <button onClick={loadCoupons} disabled={couponsLoading} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold disabled:opacity-60">
                  {couponsLoading ? "Ładowanie…" : "Odśwież"}
                </button>
              </div>
              {coupons.length === 0 && !couponsLoading ? (
                <div className="text-slate-500 text-xs py-8 text-center">Brak kuponów. Dodaj pierwszy kupon powyżej.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-950/60 text-slate-400 text-left">
                      <tr>
                        <th className="px-4 py-2 font-bold">Kod</th>
                        <th className="px-4 py-2 font-bold">Rabat</th>
                        <th className="px-4 py-2 font-bold">Użycia</th>
                        <th className="px-4 py-2 font-bold">Ważny do</th>
                        <th className="px-4 py-2 font-bold">Status</th>
                        <th className="px-4 py-2 font-bold text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => {
                        const expired = c.expires_at && new Date(c.expires_at).getTime() < Date.now();
                        const limited = c.max_uses != null && c.uses >= c.max_uses;
                        return (
                          <tr key={c.code} className="border-t border-slate-800/80">
                            <td className="px-4 py-2 font-bold text-white whitespace-nowrap">
                              {c.code}
                              {c.note && <div className="text-[10px] text-slate-500 font-normal">{c.note}</div>}
                            </td>
                            <td className="px-4 py-2 text-rose-300 font-bold">{c.percent}%</td>
                            <td className="px-4 py-2 text-slate-300 whitespace-nowrap">
                              {c.uses}{c.max_uses != null ? ` / ${c.max_uses}` : ""}
                            </td>
                            <td className="px-4 py-2 text-slate-400 whitespace-nowrap">
                              {c.expires_at ? c.expires_at.slice(0, 10) : "—"}
                            </td>
                            <td className="px-4 py-2">
                              {!c.active ? (
                                <span className="text-slate-500">Wyłączony</span>
                              ) : expired ? (
                                <span className="text-amber-400">Wygasł</span>
                              ) : limited ? (
                                <span className="text-amber-400">Limit użyć</span>
                              ) : (
                                <span className="text-emerald-400 font-semibold">Aktywny</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right whitespace-nowrap">
                              <button onClick={() => editCoupon(c)} className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold mr-2">
                                Edytuj
                              </button>
                              <button onClick={() => removeCoupon(c.code)} className="text-xs px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold">
                                Usuń
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : tab === "pricing" ? (
          <div className="space-y-6">
            {pricingLoading ? (
              <div className="text-slate-400 text-sm py-10 text-center">Ładowanie cen…</div>
            ) : (
              <>
                {/* KURS */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
                    Kurs (dostęp online)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Cena katalogowa (zł)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricing.courseOriginal / 100}
                        onChange={(e) => setPricingField("courseOriginal", Math.round(Number(e.target.value) * 100))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                      />
                      <div className="mt-1 text-[10px] text-slate-600">Cena przekreślona (przed promocją).</div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Cena sprzedaży (zł)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricing.coursePrice / 100}
                        onChange={(e) => setPricingField("coursePrice", Math.round(Number(e.target.value) * 100))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                      />
                      <div className="mt-1 text-[10px] text-slate-600">Aktualna cena, jaką płaci klient.</div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Etykieta promocji (opcjonalnie)
                      </label>
                      <input
                        value={pricing.coursePromoLabel}
                        onChange={(e) => setPricingField("coursePromoLabel", e.target.value)}
                        placeholder='np. "Promocja -25%" lub "Tylko do końca tygodnia"'
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pricing.coursePromoActive}
                          onChange={(e) => setPricingField("coursePromoActive", e.target.checked)}
                          className="h-4 w-4 accent-rose-500"
                        />
                        <span className="text-sm text-slate-300">
                          Pokaż promocję (przekreślona cena katalogowa + etykieta i rabat)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* KSIĄŻKA */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 mb-4">
                    Książka (wersja drukowana)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Cena książki (zł)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricing.bookPrice / 100}
                        onChange={(e) => setPricingField("bookPrice", Math.round(Number(e.target.value) * 100))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Dostawa standard (zł)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricing.shippingStandard / 100}
                        onChange={(e) => setPricingField("shippingStandard", Math.round(Number(e.target.value) * 100))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Dostawa ekspres (zł)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricing.shippingExpress / 100}
                        onChange={(e) => setPricingField("shippingExpress", Math.round(Number(e.target.value) * 100))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-500/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={loadPricing}
                    disabled={pricingLoading || pricingSaving}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Odrzuć zmiany
                  </button>
                  <button
                    onClick={savePricing}
                    disabled={pricingSaving}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold disabled:opacity-60"
                  >
                    {pricingSaving ? "Zapisywanie…" : "Zapisz ceny"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : tab === "book" ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">E-mail</th>
                  <th className="px-3 py-2">Klient</th>
                  <th className="px-3 py-2">Adres</th>
                  <th className="px-3 py-2">Kwota</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {bookOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                      Brak zamówień.
                    </td>
                  </tr>
                )}
                {bookOrders.map((o) => (
                  <tr key={o.id} className="border-t border-slate-800/70">
                    <td className="px-3 py-2 text-slate-500">{o.id}</td>
                    <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{fmtDate(o.created_at)}</td>
                    <td className="px-3 py-2">{o.email}</td>
                    <td className="px-3 py-2">{o.customer_name || o.shipping_name || "—"}</td>
                    <td className="px-3 py-2 text-slate-400">
                      {[o.shipping_address_line1, o.shipping_postal_code, o.shipping_city]
                        .filter(Boolean)
                        .join(", ") || o.inpost_locker || "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-300 whitespace-nowrap">{fmtMoney(o.amount_total, o.currency)}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg font-bold ${
                          o.status === "paid"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {o.status || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => startEdit("book", o)} className="text-rose-400 hover:text-rose-300 font-semibold">
                        Edytuj
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">E-mail</th>
                  <th className="px-3 py-2">Zapłacono</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                      Brak kont.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800/70">
                    <td className="px-3 py-2 text-slate-500">{u.id}</td>
                    <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 text-slate-300 whitespace-nowrap">
                      {u.price != null ? (
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-white">{fmtMoney(u.price, "pln")}</span>
                          {u.price_original != null && u.price_original > u.price && (
                            <span className="text-[11px] text-slate-500 line-through">
                              było {fmtMoney(u.price_original, "pln")}
                            </span>
                          )}
                          {u.price_list != null && u.price_original != null && u.price_list < u.price_original && (
                            <span className="text-[11px] text-emerald-400">
                              promocja −{fmtMoney(u.price_original - u.price_list, "pln")}
                            </span>
                          )}
                          {u.coupon_code && (
                            <span className="text-[11px] text-rose-400">kupon: {u.coupon_code}</span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg font-bold ${
                          u.status === "paid"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {u.status || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => startEdit("users", u)} className="text-rose-400 hover:text-rose-300 font-semibold">
                        Edytuj
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal edycji */}
      {edit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur p-4"
          onClick={() => !saving && setEdit(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-white">
              Edycja {tab === "book" ? "zamówienia" : "konta"} #{edit.id}
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              {Object.entries(edit.patch).map(([k, v]) => (
                <div key={k}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {k}
                  </label>
                  {k === "status" ? (
                    <select
                      value={String(v)}
                      onChange={(e) =>
                        setEdit((prev) => prev && { ...prev, patch: { ...prev.patch, [k]: e.target.value } })
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2"
                    >
                      {(tab === "book" ? ["pending", "paid", "cancelled"] : ["unpaid", "paid"]).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={String(v ?? "")}
                      onChange={(e) =>
                        setEdit((prev) => prev && { ...prev, patch: { ...prev.patch, [k]: e.target.value } })
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 text-white px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setEdit(null)}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Anuluj
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold disabled:opacity-60"
              >
                {saving ? "Zapisywanie…" : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
