// src/app/userpage/rozdzial/[id]/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import ChapterClient from "./ChapterClient";
import { getChapter, LAST_CHAPTER } from "../../chapters";

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

export default async function ChapterPage(
  { params }: { params: Promise<{ id: string }> } // Next 15: params to Promise
) {
  const { id } = await params; // trzeba await
  const auth = await getAuth();
  if (!auth) redirect("/login");

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("email,status")
    .eq("email", auth.email)
    .maybeSingle();

  if (!user || user.status !== "paid") {
    redirect("/userpage");
  }

    const chapter = getChapter(id);
  if (!chapter) redirect("/userpage");

    const pdfSrc = chapter.pdf;
  const isLast = Number(id) === LAST_CHAPTER;
  const prev = chapter.id > 1 ? getChapter(chapter.id - 1) : undefined;
  const next = isLast ? undefined : getChapter(chapter.id + 1);

    return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link
            href="/userpage"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Wróć do rozdziałów</span>
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full max-w-[55%] truncate">
            <svg className="w-3.5 h-3.5 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="truncate">{auth.email}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            Rozdział {chapter.id} z {LAST_CHAPTER}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {chapter.title}
          </h1>
          {chapter.desc && (
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">{chapter.desc}</p>
          )}
        </div>

        <ChapterClient pdfSrc={pdfSrc} email={auth.email} isLast={isLast} />

        <div className="mt-8 flex items-center justify-between gap-3">
          {prev ? (
            <Link
              href={`/userpage/rozdzial/${prev.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-rose-500/40 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              ← Rozdział {prev.id}
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={`/userpage/rozdzial/${next.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 transition-all"
            >
              Rozdział {next.id} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `@media print { .chapter-view { display: none !important; } }`,
          }}
        />
      </main>
    </div>
  );
}

