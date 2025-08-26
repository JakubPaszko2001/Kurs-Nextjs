// src/app/userpage/rozdzial/[id]/ProtectedPDF.tsx
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ProtectedPDF({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div
      className="relative rounded-2xl border border-white/10 bg-[#1a1d2e] p-4"
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserSelect: "none" as any }}
    >
      <Document
        file={src}
        onLoadSuccess={(info) => setNumPages(info.numPages)}
        loading={<div className="text-white/60">Ładowanie…</div>}
        error={<div className="text-rose-300">Failed to load PDF file.</div>}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i} className="mb-6 last:mb-0">
            <Page
              pageNumber={i + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={1.2}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
