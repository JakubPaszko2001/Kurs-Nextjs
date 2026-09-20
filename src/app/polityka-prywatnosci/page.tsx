import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka prywatności | Co zrobić, gdy druga połówka nie chce?",
  description:
    "Polityka prywatności – zasady przetwarzania danych osobowych i wykorzystywania plików cookies.",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-white/70 hover:text-white">
          ← Wróć na stronę główną
        </Link>

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold">Polityka prywatności</h1>
        <p className="mt-2 text-white/60 text-sm">
          Ostatnia aktualizacja: 1 stycznia 2026
        </p>

        <div className="mt-8 space-y-6 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white">1. Administrator danych</h2>
            <p className="mt-2">
              Administratorem Twoich danych osobowych jest [NAZWA FIRMY] z siedzibą pod adresem
              [ADRES], NIP: [NIP], kontakt: [ADRES E-MAIL]. Dane administratora należy uzupełnić
              przed publikacją.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">2. Zakres i cel przetwarzania danych</h2>
            <p className="mt-2">Przetwarzamy Twoje dane w następujących celach:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>utworzenie i obsługa konta (adres e-mail, hasło),</li>
              <li>realizacja zamówień i udostępnienie dostępu do Przewodnika (adres e-mail),</li>
              <li>realizacja dostawy produktu fizycznego (imię i nazwisko, adres, telefon),</li>
              <li>obsługa płatności (obsługiwana przez operatora Stripe),</li>
              <li>kontakt w sprawach reklamacji i wsparcia,</li>
              <li>wypełnienie obowiązków księgowych i prawnych.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">3. Podstawa prawna</h2>
            <p className="mt-2">
              Dane przetwarzamy na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy), lit. c
              (obowiązek prawny), lit. f (prawnie uzasadniony interes – np. obrona przed
              roszczeniami) oraz – w zakresie komunikacji marketingowej – na podstawie zgody
              (art. 6 ust. 1 lit. a RODO).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">4. Odbiorcy danych</h2>
            <p className="mt-2">Twoje dane mogą być przekazywane podmiotom:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Stripe – obsługa płatności,</li>
              <li>Supabase – przechowywanie danych w bazie,</li>
              <li>InPost – realizacja dostawy paczkomatem,</li>
              <li>dostawcy usług hostingowych i poczty e-mail,</li>
              <li>biuro rachunkowe – w zakresie wymaganym przepisami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">5. Okres przechowywania danych</h2>
            <p className="mt-2">
              Dane przechowujemy przez okres niezbędny do realizacji celów, dla których zostały
              zgromadzone, a w przypadku rozliczeń – przez okres wymagany przepisami prawa
              podatkowego (co do zasady 5 lat).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">6. Twoje prawa</h2>
            <p className="mt-2">Masz prawo do:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>dostępu do swoich danych oraz otrzymania ich kopii,</li>
              <li>sprostowania (poprawiania) danych,</li>
              <li>usunięcia danych („prawo do bycia zapomnianym”),</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>wniesienia sprzeciwu wobec przetwarzania,</li>
              <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">7. Pliki cookies</h2>
            <p className="mt-2">
              1. Serwis wykorzystuje pliki cookies niezbędne do działania, w tym cookie sesyjne
              służące do utrzymania zalogowania.
            </p>
            <p className="mt-2">
              2. Cookie „session” ma charakter techniczny, jest zaszyfrowane i służy wyłącznie do
              uwierzytelnienia użytkownika.
            </p>
            <p className="mt-2">
              3. Możesz samodzielnie zarządzać plikami cookies w ustawieniach swojej przeglądarki.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">8. Bezpieczeństwo danych</h2>
            <p className="mt-2">
              Stosujemy środki techniczne i organizacyjne mające na celu ochronę danych, w tym
              szyfrowanie połączenia (SSL) oraz dostęp do danych wyłącznie dla uprawnionych osób.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">9. Kontakt</h2>
            <p className="mt-2">
              W sprawach dotyczących ochrony danych osobowych skontaktuj się pod adresem e-mail:
              [ADRES E-MAIL].
            </p>
          </section>

          <p className="text-sm text-white/50 pt-4 border-t border-white/10">
            Uwaga: powyższa polityka prywatności jest wzorem i przed publikacją wymaga uzupełnienia
            danych Administratora oraz weryfikacji prawnej.
          </p>
        </div>
      </div>
    </div>
  );
}
