import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Regulamin | Co zrobić, gdy druga połówka nie chce?",
  description:
    "Regulamin świadczenia usług drogą elektroniczną oraz sprzedaży przewodnika cyfrowego i książki.",
};

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-[#0f1222] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-white/70 hover:text-white">
          ← Wróć na stronę główną
        </Link>

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold">Regulamin</h1>
        <p className="mt-2 text-white/60 text-sm">
          Ostatnia aktualizacja: 1 stycznia 2026
        </p>

        <div className="mt-8 space-y-6 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white">§1. Postanowienia ogólne</h2>
            <p className="mt-2">
              1. Niniejszy regulamin określa zasady korzystania ze sklepu internetowego
              dostępnego pod adresem strony („Serwis”) oraz zasady sprzedaży produktów
              cyfrowych i fizycznych oferowanych za jego pośrednictwem.
            </p>
            <p className="mt-2">
              2. Sprzedawcą jest CAR FOR YOU sp. z o.o. z siedzibą pod adresem
              ul. Warszawska 6/32, 15-063 Białystok, NIP: 9662100107, REGON: 362766440,
              KRS: 0000581279, adres e-mail do kontaktu: cozrobic@viholding.pl.
            </p>
            <p className="mt-2">
              3. Kontakt z Sprzedawcą odbywa się drogą elektroniczną pod adresem e-mail
              wskazanym w ust. 2.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§2. Definicje</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong>Klient</strong> – osoba fizyczna, prawna lub jednostka organizacyjna, która dokonuje zamówienia w Serwisie.</li>
              <li><strong>Konsument</strong> – Klient będący osobą fizyczną dokonującą zakupu niezwiązanego bezpośrednio z działalnością gospodarczą.</li>
              <li><strong>Przewodnik</strong> – produkt cyfrowy w formie materiału tekstowego/PDF dostępny w Serwisie.</li>
              <li><strong>Produkt fizyczny</strong> – książka w formie drukowanej wysyłana za pośrednictwem kuriera lub paczkomatu.</li>
              <li><strong>Zamówienie</strong> – oświadczenie woli Klienta zmierzające do zawarcia umowy sprzedaży.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§3. Rodzaje i zakres usług</h2>
            <p className="mt-2">
              1. Sprzedawca oferuje:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Przewodnik cyfrowy – dostęp do treści po opłaceniu zamówienia,</li>
              <li>książkę w formie drukowanej – dostarczaną przesyłką.</li>
            </ul>
            <p className="mt-2">
              2. Charakter poradnika: materiały mają charakter wyłącznie edukacyjno-informacyjny
              i nie stanowią porady medycznej, psychologicznej, prawnej ani innej porady
              specjalistycznej. W przypadku problemów zdrowotnych zaleca się konsultację z
              lekarzem lub odpowiednim specjalistą.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§4. Rejestracja i konto klienta</h2>
            <p className="mt-2">
              1. Do korzystania z Przewodnika wymagane jest utworzenie konta (podanie adresu
              e-mail oraz hasła).
            </p>
            <p className="mt-2">
              2. Klient zobowiązany jest do podania danych zgodnych z prawdą oraz do
              zachowania poufności hasła.
            </p>
            <p className="mt-2">
              3. Zabronione jest udostępnianie dostępu do konta oraz treści Przewodnika osobom
              trzecim. Zasady dotyczące zaproszenia drugiej osoby opisuje §6a.
            </p>
            <p className="mt-2">
              4. Hasło przechowywane jest w bazie danych dostawcy usług chmurowych (Supabase).
              Klient powinien używać hasła unikalnego i nie udostępniać go osobom trzecim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§5. Zawarcie umowy i płatności</h2>
            <p className="mt-2">
              1. Umowa zostaje zawarta z chwilą potwierdzenia zamówienia i zaksięgowania
              płatności.
            </p>
            <p className="mt-2">
              2. Płatności obsługiwane są przez zewnętrznego operatora płatności{" "}
              <strong>Stripe</strong> (Stripe Payments Europe, Ltd.). Sprzedawca nie przetwarza
              ani nie przechowuje danych kart płatniczych – są one przekazywane bezpośrednio do
              operatora płatności.
            </p>
            <p className="mt-2">
              3. Ceny podane w Serwisie są cenami brutto wyrażonymi w złotych polskich (PLN).
            </p>
            <p className="mt-2">
              4. Po zaksięgowaniu płatności dostęp online do Przewodnika zostaje aktywowany
              natychmiastowo (§6).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§6. Dostęp do produktu cyfrowego</h2>
            <p className="mt-2">
              1. Przewodnik ma postać treści cyfrowej udostępnianej online w Serwisie po
              zalogowaniu na konto Klienta.
            </p>
            <p className="mt-2">
              2. Dostęp do Przewodnika udzielany jest <strong>natychmiast po zaksięgowaniu
              płatności</strong> – Klient może otworzyć materiał od razu, bez oczekiwania na
              przesyłkę.
            </p>
            <p className="mt-2">
              3. Składając zamówienie, Klient żąda rozpoczęcia dostarczania treści cyfrowej
              przed upływem terminu do odstąpienia od umowy i przyjmuje do wiadomości, że po
              rozpoczęciu świadczenia traci prawo odstąpienia od umowy w zakresie treści
              cyfrowych dostarczanych bez nośnika materialnego (art. 38 pkt 13 ustawy o prawach
              konsumenta). Szczegóły w §8.
            </p>
            <p className="mt-2">
              4. Klient zobowiązany jest do korzystania z materiałów wyłącznie na własne
              potrzeby. Kopiowanie, nagrywanie, rozpowszechnianie i odsprzedaż treści bez
              zgody Sprzedawcy są zabronione.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§6a. Zaproszenie drugiej osoby</h2>
            <p className="mt-2">
              1. Po zakupie dostępu online Klient może w swoim panelu wygenerować prywatny link
              z zaproszeniem do skorzystania z materiałów przez drugą, bliską osobę.
            </p>
            <p className="mt-2">
              2. <strong>Adres e-mail osoby zaproszonej nie jest zbierany od Klienta.</strong>{" "}
              Osoba zaproszona sama otwiera link, podaje swój adres e-mail oraz wyraża zgodę na
              otrzymywanie materiałów, dopiero akceptując zaproszenie.
            </p>
            <p className="mt-2">
              3. Po akceptacji zaproszenia osoba zaproszona otrzymuje rozdziały materiału
              etapami – maksymalnie jedna wiadomość dziennie – i w każdej chwili może
              zrezygnować z dalszych wysyłek za pomocą linku „stop” zawartego w wiadomości.
            </p>
            <p className="mt-2">
              4. Zaproszenie ma charakter prywatny i bezpłatny; nie stanowi odrębnej sprzedaży
              ani udzielenia licencji osobie trzeciej w rozumieniu §4 ust. 3. Klient odpowiada
              za to, komu przekazuje link zaproszenia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§7. Dostawa produktu fizycznego (książka)</h2>
            <p className="mt-2">
              1. Książka w wersji drukowanej jest <strong>odrębnym produktem</strong> od
              dostępu online i zamawiana jest osobno – bezpośrednio po zakupie dostępu online
              albo później z poziomu konta Klienta.
            </p>
            <p className="mt-2">
              2. Książka wysyłana jest na adres wskazany przez Klienta, za pośrednictwem
              kuriera lub paczkomatu InPost.
            </p>
            <p className="mt-2">
              3. Koszt oraz przewidywany czas dostawy określane są przy składaniu zamówienia
              książki.
            </p>
            <p className="mt-2">
              4. Zakup dostępu online nie zawiera książki, a zakup książki nie obejmuje dostępu
              online – chyba że w danym zamówieniu wyraźnie wskazano inaczej.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§8. Prawo odstąpienia od umowy</h2>
            <p className="mt-2">
              1. Konsumentowi przysługuje prawo odstąpienia od umowy w terminie 14 dni od jej
              zawarcia, bez podania przyczyny.
            </p>
            <p className="mt-2">
              2. <strong>Ważne:</strong> zgodnie z art. 38 pkt 13 ustawy o prawach konsumenta
              prawo odstąpienia od umowy nie przysługuje w przypadku umów o dostarczanie treści
              cyfrowych niedostarczanych na nośniku materialnym, jeżeli spełnianie świadczenia
              rozpoczęło się za wyraźną zgodą konsumenta przed upływem terminu do odstąpienia
              od umowy.
            </p>
            <p className="mt-2">
              3. W przypadku produktu fizycznego (książki) Konsument może odstąpić od umowy w
              terminie 14 dni od otrzymania przesyłki. Zwracany produkt powinien być w stanie
              nienaruszonym.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">
              §8a. Dobrowolna gwarancja satysfakcji Sprzedawcy (14 dni)
            </h2>
            <p className="mt-2">
              1. Niezależnie od ustawowych praw konsumenta opisanych w §8, Sprzedawca
              udziela dobrowolnej gwarancji satysfakcji na dostęp online do Przewodnika
              („14 dni na sprawdzenie całego planu”).
            </p>
            <p className="mt-2">
              2. Gwarancja obejmuje zakup dostępu online do Przewodnika w cenie 149 zł.
            </p>
            <p className="mt-2">
              3. Warunki skorzystania z gwarancji:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>zgłoszenie w terminie 14 dni od dnia zakupu,</li>
              <li>oświadczenie Klienta, że zapoznał się z całością materiału,</li>
              <li>zgłoszenie przesłane na adres e-mail: cozrobic@viholding.pl.</li>
            </ul>
            <p className="mt-2">
              4. Po spełnieniu warunków Sprzedawca zwraca Klientowi kwotę 149 zł, a dostęp
              do Przewodnika zostaje zamknięty.
            </p>
            <p className="mt-2">
              5. Gwarancja dotyczy wyłącznie dostępu online do Przewodnika. Zamówiona
              odrębnie książka w wersji drukowanej podlega odrębnym zasadom zwrotu produktu
              fizycznego, opisanym w §8 ust. 3, i nie jest objęta niniejszą gwarancją.
            </p>
            <p className="mt-2">
              6. Skorzystanie z dobrowolnej gwarancji Sprzedawcy nie wyłącza ani nie ogranicza
              uprawnień przysługujących Klientowi na podstawie przepisów prawa, w tym
              ustawowych praw konsumenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§9. Reklamacje</h2>
            <p className="mt-2">
              1. Reklamacje należy składać na adres e-mail wskazany w §1 ust. 2.
            </p>
            <p className="mt-2">
              2. Reklamacja powinna zawierać opis problemu oraz dane umożliwiające identyfikację
              Klienta. Sprzedawca rozpatrzy reklamację w terminie do 14 dni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§10. Ochrona danych osobowych</h2>
            <p className="mt-2">
              Zasady przetwarzania danych osobowych opisane są w Polityce prywatności dostępnej
              w Serwisie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">§11. Postanowienia końcowe</h2>
            <p className="mt-2">
              1. Sprzedawca zastrzega sobie prawo do zmiany Regulaminu. Zmiany obowiązują od
              momentu ich publikacji w Serwisie.
            </p>
            <p className="mt-2">
              2. W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w tym
              Kodeksu cywilnego oraz ustawy o prawach konsumenta.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
