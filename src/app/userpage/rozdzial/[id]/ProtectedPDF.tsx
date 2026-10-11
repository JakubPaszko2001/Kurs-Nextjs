// src/app/userpage/rozdzial/[id]/ProtectedPDF.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Worker skopiowany do /public — działa niezawodnie w Turbopack/Next 15.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
export default function ProtectedPDF({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dopasowanie szerokości strony PDF do kontenera
  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const update = () => setWidth(Math.min(el.clientWidth, 900));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div
        className="rounded-3xl border border-slate-800 bg-slate-900/60 p-3 sm:p-5 backdrop-blur-xl"
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserSelect: "none" as any }}
    >
      <Document
        file={src}
          onLoadSuccess={(info) => {
            setNumPages(info.numPages);
            setError(null);
          }}
          onLoadError={(e) =>
            setError(
              "Nie udało się wczytać pliku PDF. Odśwież stronę lub spróbuj ponownie później."
            )
          }
          loading={
            <div className="py-16 text-center text-sm text-slate-400">
              Ładowanie dokumentu…
          </div>
}
          error={
            <div className="py-16 text-center text-sm text-rose-300">
              Nie można wczytać dokumentu.
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="mb-4 last:mb-0 flex justify-center">
              <Page
                pageNumber={i + 1}
                width={width ? width - 24 : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="overflow-hidden rounded-xl bg-white shadow-lg"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

