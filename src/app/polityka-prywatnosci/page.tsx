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

              Administratorem Twoich danych osobowych jest CAR FOR YOU sp. z o.o. z siedzibą
              pod adresem ul. Warszawska 6/32, 15-063 Białystok, NIP: 9662100107, REGON:
              362766440, KRS: 0000581279.
            </p>
            <p className="mt-2">
              Kontakt w sprawach ochrony danych osobowych: e-mail cozrobic@viholding.pl.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">2. Zakres i cel przetwarzania danych</h2>
            <p className="mt-2">Przetwarzamy Twoje dane w następujących celach:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>utworzenie i obsługa konta (adres e-mail, hasło),</li>
              <li>realizacja zamówień i udostępnienie dostępu do Przewodnika (adres e-mail),</li>
              <li>realizacja dostawy produktu fizycznego – książki (imię i nazwisko, adres, telefon),</li>
              <li>obsługa płatności (realizowana przez operatora Stripe),</li>
              <li>obsługa zaproszenia drugiej osoby – dane osoby zaproszonej (adres e-mail, zgoda) przetwarzamy po tym, jak osoba ta sama zaakceptuje zaproszenie i dobrowolnie poda swój adres,</li>
              <li>wysyłka materiałów e-mailem i obsługa rezygnacji z wysyłki,</li>
              <li>kontakt w sprawach reklamacji i wsparcia,</li>
              <li>wypełnienie obowiązków księgowych i prawnych.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">3. Podstawa prawna</h2>
            <p className="mt-2">
              Dane przetwarzamy na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy), lit. c
              (obowiązek prawny), lit. f (prawnie uzasadniony interes – np. obrona przed
              roszczeniami) oraz – w zakresie komunikacji marketingowej i wysyłki materiałów na
              adres osoby zaproszonej – na podstawie zgody (art. 6 ust. 1 lit. a RODO).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">4. Odbiorcy danych (dostawcy usług)</h2>
            <p className="mt-2">
              Twoje dane mogą być powierzane następującym podmiotom przetwarzającym,
              wykorzystywanym przez Serwis:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong>Stripe</strong> (Stripe Payments Europe, Ltd.) – obsługa płatności online,</li>
              <li><strong>Supabase</strong> – przechowywanie danych w bazie danych (konta, zamówienia, zgody, harmonogram wysyłek),</li>
              <li><strong>Vercel</strong> – hosting i udostępnianie aplikacji oraz strony internetowej,</li>
              <li><strong>Resend</strong> – wysyłka wiadomości e-mail (materiały, potwierdzenia, zaproszenia, rezygnacja z wysyłki),</li>
              <li><strong>InPost</strong> – realizacja dostawy książki (paczkomat),</li>
              <li>biuro rachunkowe – w zakresie wymaganym przepisami podatkowymi.</li>
            </ul>
            <p className="mt-2">
              Podmioty te przetwarzają dane wyłącznie w zakresie niezbędnym do świadczenia
              powierzonych usług i na podstawie odpowiednich umów powierzenia przetwarzania.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">5. Zaproszenie drugiej osoby</h2>
            <p className="mt-2">
              1. Kupujący może przekazać bliskiej osobie prywatny link z zaproszeniem.{" "}
              <strong>Nie zbieramy adresu e-mail osoby zaproszonej od kupującego przed
              akceptacją zaproszenia.</strong>
            </p>
            <p className="mt-2">
              2. Osoba zaproszona decyduje samodzielnie: otwiera link, podaje swój adres e-mail
              i wyraża zgodę na otrzymywanie materiałów. Dopiero wtedy rozpoczyna się wysyłka
              rozdziałów.
            </p>
            <p className="mt-2">
              3. Osoba zaproszona może w każdej chwili zrezygnować z dalszych wiadomości za
              pomocą linku „stop” w treści wiadomości. Zgodę można wycofać w dowolnym momencie,
              co nie wpływa na zgodność z prawem przetwarzania dokonanego wcześniej.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">6. Okres przechowywania danych</h2>
            <p className="mt-2">
              Dane przechowujemy przez okres niezbędny do realizacji celów, dla których zostały
              zgromadzone, a w przypadku rozliczeń – przez okres wymagany przepisami prawa
              podatkowego (co do zasady 5 lat).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">7. Twoje prawa</h2>
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
            <h2 className="text-xl font-bold text-white">8. Pliki cookies</h2>
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
            <h2 className="text-xl font-bold text-white">9. Bezpieczeństwo danych</h2>
            <p className="mt-2">
              Stosujemy środki techniczne i organizacyjne mające na celu ochronę danych, w tym
              szyfrowanie połączenia (SSL) oraz dostęp do danych wyłącznie dla uprawnionych osób.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">10. Kontakt</h2>
            <p className="mt-2">
              W sprawach dotyczących ochrony danych osobowych skontaktuj się pod adresem e-mail:
              cozrobic@viholding.pl.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
