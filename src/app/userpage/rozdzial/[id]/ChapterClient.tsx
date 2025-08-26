"use client";

import dynamic from "next/dynamic";
import ClientGuards from "./ClientGuards";
import OrderBookButton from "../../../book/OrderBookButton";

// PDF tylko w przeglądarce (bez SSR)
const ProtectedPDF = dynamic(() => import("./ProtectedPDF"), { ssr: false });

export default function ChapterClient({
  pdfSrc,
  email,
  isLast,
}: {
  pdfSrc: string;
  email: string;
  isLast: boolean;
}) {
  return (
    <div className="chapter-view">
      <ClientGuards email={email} />

      <div className="mt-6">
        <ProtectedPDF src={pdfSrc} />
      </div>

      {isLast && (
        <div className="mt-6">
          <OrderBookButton />
        </div>
      )}
    </div>
  );
}
