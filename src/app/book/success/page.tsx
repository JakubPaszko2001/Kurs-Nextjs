// src/app/book/success/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function BookSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      {/* pasek z powrotem */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Wróć na stronę główną
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Dziękujemy za zamówienie książki!</h1>
        <p className="mt-3 text-white/70">
          Potwierdzenie płatności i szczegóły wysyłki wyślemy na Twój e-mail.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-rose-500 hover:bg-rose-400 px-5 py-2 font-semibold"
          >
            Wróć na stronę główną
          </Link>
          <Link
            href="/userpage"
            className="rounded-xl border border-white/20 hover:border-white/40 px-5 py-2"
          >
            Moje konto
          </Link>
        </div>
      </div>
    </div>
  );
}
