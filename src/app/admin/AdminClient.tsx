"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Tab = "book" | "users" | "content";

type ContentField = {
  key: string;
  label: string;
  group: string;
  type: "text" | "textarea";
  defaultValue: string;
};

type BookOrder = Record<string, any>;
type User = { id: any; email: string; status: string; created_at?: string };
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

  // Ładuj treści po przejściu na zakładkę
  useEffect(() => {
    if (tab === "content" && contentFields.length === 0) {
      loadContent();
      loadVersions();
    }
  }, [tab, contentFields.length, loadContent]);

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
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                      Brak kont.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800/70">
                    <td className="px-3 py-2 text-slate-500">{u.id}</td>
                    <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                    <td className="px-3 py-2">{u.email}</td>
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
