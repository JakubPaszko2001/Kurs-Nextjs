// src/app/book/cancel/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* top bar z cofnięciem */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <Link href="/book/checkout" className="text-white/70 hover:text-white">
            ← Wróć do zamówienia
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold">Płatność anulowana</h1>
        <p className="mt-3 text-white/70">
          Nie pobraliśmy środków. Możesz spróbować ponownie w dogodnym momencie.
        </p>

        <div className="mt-8">
          <Link
            href="/book/checkout"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-400 px-5 py-3 font-semibold transition-colors"
          >
            Wróć do koszyka
          </Link>
        </div>
      </div>
    </div>
  );
}
