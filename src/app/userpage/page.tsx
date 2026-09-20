// src/app/userpage/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../lib/supabaseAdmin"; // popraw ścieżkę jeśli u Ciebie inna

export const dynamic = "force-dynamic";

/* --- Ikony SVG --- */
const ArrowLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BookOpenIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const LockClosedIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckBadgeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

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
      <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-rose-600/10 blur-[160px] pointer-events-none rounded-full" />

        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Wróć na stronę główną</span>
            </Link>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              <UserIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>{auth.email}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 relative z-10">
          <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 text-center backdrop-blur-xl shadow-2xl">
            <h1 className="text-2xl font-extrabold text-white">Panel Użytkownika</h1>
            <p className="mt-3 text-sm text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 py-2.5 px-4 rounded-xl inline-block">
              Wystąpił błąd podczas pobierania danych: {error.message}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const isPaid = user?.status === "paid";

  const chapters = [
    {
      id: 1,
      title: "Rozdział 1 — Start i fundamenty",
      desc: "Zrozumienie podstawowych mechanizmów i pierwsze krok w kierunku zmiany.",
      href: "/userpage/rozdzial/1",
    },
    {
      id: 2,
      title: "Rozdział 2 — Plan krok po kroku",
      desc: "Przejrzysta ścieżka postępowania i budowanie prawidłowych nawyków.",
      href: "/userpage/rozdzial/2",
    },
    {
      id: 3,
      title: "Rozdział 3 — Scenariusze rozmów i działania",
      desc: "Gotowe rozwiązania, przykłady wypowiedzi i strategie reagowania.",
      href: "/userpage/rozdzial/3",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[170px] pointer-events-none rounded-full" />

      {/* Navigation Topbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Wróć na stronę główną</span>
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <UserIcon className="w-3.5 h-3.5 text-rose-400" />
            <span>{auth.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14 relative z-10">
        {/* Title & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Twoje produkty
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Zarządzaj swoimi zasobami i przechodź do kolejnych lekcji.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <CheckBadgeIcon className="w-4 h-4" />
                Dostęp aktywny
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                <LockClosedIcon className="w-3.5 h-3.5" />
                Dostęp nieaktywny
              </span>
            )}
          </div>
        </div>

        {/* Dynamic State View */}
        {!isPaid ? (
          /* BRAK DOSTĘPU */
          <div className="mt-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-purple-600/20 rounded-[32px] blur-xl opacity-50" />
            <div className="relative rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 sm:p-10 backdrop-blur-xl text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <LockClosedIcon className="w-7 h-7" />
              </div>

              <div className="max-w-md">
                <h2 className="text-xl font-extrabold text-white">Dostęp nie został wykupiony</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Wygląda na to, że przewodnik nie jest przypisany do Twojego konta. Wykup pełen dostęp, aby natychmiast odblokować wszystkie materiały.
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white px-6 py-3.5 text-sm font-extrabold shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Kup dostęp do przewodnika
              </Link>
            </div>
          </div>
        ) : (
          /* AKTYWNY DOSTĘP */
          <div className="mt-8 space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
                    Pełen Dostęp
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Plan odzyskania bliskości
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                    Gratulacje! Twój dostęp jest aktywny. Wybierz interesujący Cię rozdział z listy poniżej i rozpocznij lekturę.
                  </p>
                </div>
              </div>

              {/* Lista rozdziałów */}
              <div className="mt-8 space-y-3">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={chapter.href}
                    className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-rose-500/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:bg-rose-500/10 border border-slate-800 group-hover:border-rose-500/30 flex items-center justify-center text-slate-400 group-hover:text-rose-400 transition-colors shrink-0">
                        <BookOpenIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                          {chapter.desc}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-900 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center text-slate-500 transition-all shrink-0 ml-2">
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}