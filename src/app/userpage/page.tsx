// src/app/userpage/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../lib/supabaseAdmin"; // popraw ścieżkę jeśli u Ciebie inna

export const dynamic = "force-dynamic";

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return {
      email: String(payload.email ?? ""),
      id: payload.sub ? String(payload.sub) : undefined,
    };
  } catch {
    return null;
  }
}

export default async function Userpage() {
  const auth = await getAuth();
  if (!auth) {
    redirect("/login");
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("email,status")
    .eq("email", auth.email)
    .maybeSingle();

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1222] text-white">
        {/* pasek z cofnięciem */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-white/70 hover:text-white">
              ← Wróć na stronę główną
            </Link>
            <div className="text-white/60 text-sm">
              Zalogowano jako <span className="text-white">{auth.email}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-bold">Twoje konto</h1>
          <p className="mt-2 text-rose-300">
            Wystąpił błąd podczas pobierania danych: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const isPaid = user?.status === "paid";

  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* pasek z cofnięciem */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Wróć na stronę główną
          </Link>
          <div className="text-white/60 text-sm">
            Zalogowano jako <span className="text-white">{auth.email}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">Twoje produkty</h1>

        {!isPaid ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
            <h2 className="text-xl font-semibold">Dostęp nieaktywny</h2>
            <p className="mt-2 text-white/70">
              Wygląda na to, że przewodnik nie został jeszcze wykupiony.
            </p>
            <Link
              href="/checkout"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-400 px-4 py-2 font-semibold transition-colors"
            >
              Kup dostęp do przewodnika
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
              <h2 className="text-xl font-semibold">Pełen Dostęp do Przewodnika</h2>
              <p className="text-white/70 mt-1">
                Gratulacje — masz aktywny dostęp. Poniżej znajdziesz rozdziały:
              </p>

              <ul className="mt-4 list-disc pl-6 space-y-2 text-white/80">
                <li>
                  <Link className="text-rose-300 hover:text-rose-200" href="/userpage/rozdzial/1">
                    Rozdział 1 — Start i fundamenty
                  </Link>
                </li>
                <li>
                  <Link className="text-rose-300 hover:text-rose-200" href="/userpage/rozdzial/2">
                    Rozdział 2 — Plan krok po kroku
                  </Link>
                </li>
                <li>
                  <Link className="text-rose-300 hover:text-rose-200" href="/userpage/rozdzial/3">
                    Rozdział 3 — Scenariusze rozmów i działania
                  </Link>
                </li>
              </ul>
            </div>
            {/* Bonusy / pliki do pobrania itp. */}
          </div>
        )}
      </div>
    </div>
  );
}
