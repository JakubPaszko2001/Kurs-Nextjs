import Link from "next/link";

export const dynamic = "force-dynamic";

export default function BookOrderSuccess() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-600/15 to-purple-600/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-2xl p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Dziękujemy za zamówienie 🎉</h1>
        <p className="mt-4 text-slate-300 text-sm sm:text-base">
          Płatność została przyjęta. Twoja książka jest przygotowywana do wysyłki —
          szczegóły dostawy potwierdzimy e-mailem.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/userpage"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold px-8 py-4 text-base shadow-xl shadow-rose-500/25 transition-all hover:scale-[1.02]"
          >
            Przejdź do materiałów
          </Link>
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold px-6 py-4 text-sm"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  );
}
