// src/app/Userpage.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseAdmin } from "../lib/supabaseAdmin"; // Popraw ścieżkę jeśli potrzebujesz

type JwtPayload = { sub?: string; email?: string };
type Purchase = {
  id: number;
  product_id: string;
  product_name: string | null;
  status: "paid" | "pending" | "refunded" | "canceled";
  created_at: string;
};

async function getSessionUser() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const p = payload as JwtPayload;
    if (!p.sub) return null;
    return { id: Number(p.sub), email: p.email ?? "" };
  } catch {
    return null;
  }
}

export default async function Userpage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f1222] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1a1d2e] rounded-2xl shadow-xl p-8 border border-white/10 text-center">
          <h1 className="text-2xl font-bold mb-3">Nie jesteś zalogowany</h1>
          <p className="text-white/70">Przejdź do logowania, aby zobaczyć swoje produkty.</p>
          <a
            href="/login"
            className="inline-block mt-6 bg-rose-500 hover:bg-rose-400 rounded-lg py-2 px-4 font-semibold"
          >
            Zaloguj się
          </a>
        </div>
      </div>
    );
  }

  // Pobierz zakupy użytkownika z Supabase (po stronie serwera, service role)
  const { data, error } = await supabaseAdmin
    .from("purchases")
    .select("id, product_id, product_name, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const purchases = (data ?? []) as Purchase[];

  return (
    <div className="min-h-screen bg-[#0f1222] text-white px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Twoje produkty</h1>
            <p className="text-white/60 text-sm">Zalogowano jako {user.email}</p>
          </div>

          <form action="/api/logout" method="post">
            <button className="bg-rose-500 hover:bg-rose-400 rounded-lg py-2 px-4 font-semibold">
              Wyloguj się
            </button>
          </form>
        </header>

        {/* Lista zakupów */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-4 mb-6">
            Wystąpił błąd podczas pobierania zakupów: {error.message}
          </div>
        )}

        {purchases.length === 0 ? (
          <div className="bg-[#1a1d2e] border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Brak zakupionych produktów</h2>
            <p className="text-white/60">
              Gdy kupisz produkt, pojawi się tutaj. Przejdź do sekcji zakupów na stronie głównej.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {purchases.map((p) => (
              <li
                key={p.id}
                className="bg-[#1a1d2e] border border-white/10 rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <div className="text-lg font-semibold">
                    {p.product_name ?? p.product_id}
                  </div>
                  <div className="text-white/60 text-sm">
                    ID: {p.product_id} • Status: {p.status} • {new Date(p.created_at).toLocaleString()}
                  </div>
                </div>

                {p.status === "paid" ? (
                  <a
                    href={`/download/${p.product_id}`}
                    className="bg-rose-500 hover:bg-rose-400 rounded-lg py-2 px-4 font-semibold"
                  >
                    Pobierz
                  </a>
                ) : (
                  <span className="text-white/60 text-sm">Oczekuje na płatność</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
