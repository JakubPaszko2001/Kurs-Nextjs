// src/app/userpage/rozdzial/[id]/page.tsx
// Removed invalid import for PageProps
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import ChapterClient from "./ChapterClient";

export const dynamic = "force-dynamic";

async function getAuth() {
  const token = (await cookies()).get("session")?.value;
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

export default async function ChapterPage({ params }: { params: { id: string } }) {
  const { id } = params; // <— WAŻNE w Next 15
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

  const pdfSrc = `/protected/chapters/${id}.pdf`;

  const LAST = 3; // zmień jeśli masz inny ostatni
  const idNum = Number(id);
  const isLast = Number.isFinite(idNum) && idNum === LAST;

  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
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
        <h1 className="text-3xl font-bold">Rozdział {id}</h1>

        <div className="mt-6">
          <ChapterClient pdfSrc={pdfSrc} email={auth.email} isLast={isLast} />
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `@media print { .chapter-view { display: none !important; } }`,
          }}
        />
      </div>
    </div>
  );
}
