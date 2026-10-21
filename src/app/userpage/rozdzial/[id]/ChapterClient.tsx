"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import ClientGuards from "./ClientGuards";

// PDF tylko w przeglądarce (bez SSR)
const ProtectedPDF = dynamic(() => import("./ProtectedPDF"), { ssr: false });

type Props = {
  pdfSrc: string;
  email: string;
  isLast: boolean; // ← decyduje, czy pokazać CTA
};

export default function ChapterClient({ pdfSrc, email, isLast }: Props) {
  return (
    <div className="chapter-view">
      <ClientGuards email={email} />

      <div className="mt-6">
        <ProtectedPDF src={pdfSrc} />
      </div>

      {/* CTA tylko na ostatnim rozdziale */}
      {isLast && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#1a1d2e] p-6">
            <h3 className="text-lg font-semibold">Podziel się z drugą osobą</h3>
            <p className="text-white/70 mt-1">
              Wygeneruj prywatne zaproszenie w swoim panelu i przekaż je drugiej osobie.
              Otrzyma ona materiał etapami — po jednej części dziennie.
            </p>
            <Link
              href="/userpage"
              className="mt-4 inline-block rounded-xl bg-rose-500 hover:bg-rose-400 px-4 py-2 font-semibold"
            >
              Przejdź do udostępniania
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

