export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f1222] text-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">Dziękujemy za zakup 🎉</h1>
        <p className="mt-3 text-white/80">
          Dostęp został aktywowany. Przejdź do <a href="/userpage" className="text-rose-400 underline">Twojej strony</a>.
        </p>
      </div>
    </div>
  );
}
