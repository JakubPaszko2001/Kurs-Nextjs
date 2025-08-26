// src/app/userpage/rozdzial/[id]/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import ChapterClient from "./ChapterClient"; // ⬅️ klientowy wrapper

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

export default async function ChapterPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Ścieżka do PDF: 1.pdf, 2.pdf, 3.pdf...
  const pdfSrc = `/protected/chapters/${params.id}.pdf`;

  // Pokaż CTA tylko w ostatnim rozdziale (3)
  const LAST = 3;
  const idNum = Number(params.id);
  const isLast = Number.isFinite(idNum) && idNum === LAST;

  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* pasek */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/userpage" className="text-white/70 hover:text-white">
            ← Wróć do rozdziałów
          </Link>
          <div className="text-white/60 text-sm">
            Zalogowano jako <span className="text-white">{auth.email}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-bold">Rozdział {params.id}</h1>

        {/* Klientowy wrapper: render PDF (ssr:false) + CTA dla ostatniego rozdziału */}
        <ChapterClient
          pdfSrc={pdfSrc}
          email={auth.email}
          isLast={isLast}
        />

        {/* blokada wydruku sekcji z PDF */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@media print { .chapter-view { display: none !important; } }`,
          }}
        />
      </div>
    </div>
  );
}
