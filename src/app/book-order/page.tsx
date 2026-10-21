import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import BookOrderClient from "./BookOrderClient";

export const dynamic = "force-dynamic";

async function getUserEmail(): Promise<string> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return "";
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return String(payload.email ?? "");
  } catch {
    return "";
  }
}

export default async function BookOrderPage() {
  const userEmail = await getUserEmail();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[170px] pointer-events-none rounded-full" />

      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href={userEmail ? "/userpage" : "/"}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Wróć
          </Link>
          <span className="text-xs font-semibold text-slate-400">Zamówienie wersji drukowanej</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Poradnik – wersja drukowana
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Egzemplarz fizyczny wysyłany kurierem. Koszt i sposób dostawy widoczne poniżej, przed zapłatą.
          </p>
        </div>

        <BookOrderClient defaultEmail={userEmail} />
      </main>
    </div>
  );
}
