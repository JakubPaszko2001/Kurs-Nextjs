// src/app/lib/siteContent.ts
// Treści strony głównej edytowalne z panelu admina.
// Każdy klucz ma wartość domyślną (fallback) = obecny tekst na stronie,
// więc strona działa poprawnie nawet bez wierszy w bazie.
import { supabaseAdmin } from "./supabaseAdmin";

export type ContentField = {
  key: string;
  label: string;      // etykieta w panelu
  group: string;      // sekcja (np. "Hero")
  type: "text" | "textarea"; // pole jedno- lub wieloliniowe
  defaultValue: string;
};

// ============================================================
//  DEFINICJE PÓL (etap 1: HERO)
// ============================================================
export const CONTENT_FIELDS: ContentField[] = [
  // --- Hero: badge / nagłówek ---
  {
    key: "hero_badge",
    label: "Plakietka nad nagłówkiem",
    group: "Hero",
    type: "text",
    defaultValue: "Przewodnik dla par i indywidualnie",
  },
  {
    key: "hero_title_lead",
    label: "Nagłówek – część 1 (biała)",
    group: "Hero",
    type: "text",
    defaultValue: "Co zrobić, gdy Twoja",
  },
  {
    key: "hero_title_highlight",
    label: "Nagłówek – część 2 (kolorowa)",
    group: "Hero",
    type: "text",
    defaultValue: "druga połówka nie chce ?",
  },
  {
    key: "hero_paragraph_1",
    label: "Akapit 1 (wyróżniony)",
    group: "Hero",
    type: "textarea",
    defaultValue:
      "Ty masz ochotę. Druga osoba znowu mówi „nie teraz”. A Ty coraz częściej zastanawiasz się, czy za chwilę seks całkowicie zniknie z Waszego związku.",
  },
  {
    key: "hero_paragraph_2",
    label: "Akapit 2",
    group: "Hero",
    type: "textarea",
    defaultValue:
      "Nie czekaj, aż kolejne odmowy, frustracja i napięcie staną się codziennością. Poznaj konkretny plan, który pokaże Ci, co naprawdę może zabijać ochotę i co zmienić, aby zwiększyć szanse na częstszy seks oraz powrót prawdziwej bliskości.",
  },
  {
    key: "hero_cta_text",
    label: "Tekst przycisku CTA",
    group: "Hero",
    type: "text",
    defaultValue: "Chcę odzyskać seks i bliskość",
  },
  // --- Hero: karta po prawej ---
  {
    key: "hero_card_badge",
    label: "Karta – mała plakietka",
    group: "Hero",
    type: "text",
    defaultValue: "Szybki start",
  },
  {
    key: "hero_card_title",
    label: "Karta – tytuł",
    group: "Hero",
    type: "text",
    defaultValue: "Dyskretny plan działania",
  },
  {
    key: "hero_card_item_1_title",
    label: "Karta – punkt 1 (pogrubienie)",
    group: "Hero",
    type: "text",
    defaultValue: "Bez lania wody:",
  },
  {
    key: "hero_card_item_1_text",
    label: "Karta – punkt 1 (treść)",
    group: "Hero",
    type: "textarea",
    defaultValue:
      "Konkretne wskazówki, scenariusze rozmów i 4-tygodniowy plan, który możesz zacząć wdrażać od dzisiaj.",
  },
  {
    key: "hero_card_item_2_text",
    label: "Karta – punkt 2 (treść)",
    group: "Hero",
    type: "textarea",
    defaultValue: "Bez błagania. Bez kolejnych awantur. Bez udawania, że problemu nie ma.",
  },

  // ============================================================
  //  JAK TO DZIAŁA (HowItWorks)
  // ============================================================
  {
    key: "hiw_badge",
    label: "Plakietka sekcji",
    group: "Jak to działa",
    type: "text",
    defaultValue: "Prosty proces",
  },
  {
    key: "hiw_title",
    label: "Nagłówek sekcji",
    group: "Jak to działa",
    type: "text",
    defaultValue: "Jak to działa?",
  },
  // Krok 1
  {
    key: "hiw_step1_number",
    label: "Krok 1 – numer",
    group: "Jak to działa",
    type: "text",
    defaultValue: "01",
  },
  {
    key: "hiw_step1_title",
    label: "Krok 1 – tytuł",
    group: "Jak to działa",
    type: "text",
    defaultValue: "Kupujesz i otwierasz dostęp",
  },
  {
    key: "hiw_step1_desc",
    label: "Krok 1 – opis",
    group: "Jak to działa",
    type: "textarea",
    defaultValue:
      "Otrzymujesz kompletny przewodnik i sprawdzasz, dlaczego Twoje dotychczasowe próby mogły nie przynosić efektu.",
  },
  // Krok 2
  {
    key: "hiw_step2_number",
    label: "Krok 2 – numer",
    group: "Jak to działa",
    type: "text",
    defaultValue: "02",
  },
  {
    key: "hiw_step2_title",
    label: "Krok 2 – tytuł",
    group: "Jak to działa",
    type: "text",
    defaultValue: "Odkrywasz, co gasi ochotę",
  },
  {
    key: "hiw_step2_desc",
    label: "Krok 2 – opis",
    group: "Jak to działa",
    type: "textarea",
    defaultValue:
      "Rozpoznajesz błędy, napięcia i bariery, przez które druga osoba coraz częściej mówi „nie teraz”.",
  },
  // Krok 3
  {
    key: "hiw_step3_number",
    label: "Krok 3 – numer",
    group: "Jak to działa",
    type: "text",
    defaultValue: "03",
  },
  {
    key: "hiw_step3_title",
    label: "Krok 3 – tytuł",
    group: "Jak to działa",
    type: "text",
    defaultValue: "Zaczynasz działać inaczej",
  },
  {
    key: "hiw_step3_desc",
    label: "Krok 3 – opis",
    group: "Jak to działa",
    type: "textarea",
    defaultValue:
      "Wprowadzasz konkretne zmiany, które mogą pomóc odbudować napięcie, pożądanie i częstszą bliskość.",
  },

  // ============================================================
  //  CO DOSTAJESZ (WhatYouGet) – nagłówek + stopka CTA
  //  (moduły zostaną dodane w kolejnym etapie)
  // ============================================================
  {
    key: "wyg_badge",
    label: "Plakietka sekcji",
    group: "Co dostajesz",
    type: "text",
    defaultValue: "Zawartość Poradnika",
  },
  {
    key: "wyg_title_lead",
    label: "Nagłówek – część 1 (biała)",
    group: "Co dostajesz",
    type: "text",
    defaultValue: "Co dokładnie",
  },
  {
    key: "wyg_title_highlight",
    label: "Nagłówek – część 2 (kolorowa)",
    group: "Co dostajesz",
    type: "text",
    defaultValue: "dostajesz?",
  },
  {
    key: "wyg_intro",
    label: "Wstęp pod nagłówkiem",
    group: "Co dostajesz",
    type: "textarea",
    defaultValue:
      "Przestań zgadywać, dlaczego znowu słyszysz „nie”. Możesz dalej próbować w ten sam sposób i liczyć, że sytuacja zmieni się sama. Możesz też wreszcie sprawdzić, co naprawdę stoi pomiędzy Tobą a bliskością, której Ci brakuje.",
  },
  {
    key: "wyg_bottom_title",
    label: "Stopka CTA – nagłówek",
    group: "Co dostajesz",
    type: "text",
    defaultValue: "Odbuduj bliskość i porozumienie w relacji",
  },
  {
    key: "wyg_bottom_text",
    label: "Stopka CTA – opis",
    group: "Co dostajesz",
    type: "textarea",
    defaultValue:
      "Zdobądź kompletny poradnik, program 4-tygodniowy oraz zestaw praktycznych ćwiczeń. Dostęp otrzymujesz natychmiast po złożeniu zamówienia.",
  },
  {
    key: "wyg_cta_text",
    label: "Stopka CTA – tekst przycisku",
    group: "Co dostajesz",
    type: "text",
    defaultValue: "Chcę otrzymać dostęp",
  },

  // ============================================================
  //  DLACZEGO TO DZIAŁA (WhyItWorks)
  // ============================================================
  {
    key: "why_badge",
    label: "Plakietka sekcji",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Rozsądne podejście",
  },
  {
    key: "why_title_lead",
    label: "Nagłówek – część 1 (biała)",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Dlaczego to",
  },
  {
    key: "why_title_highlight",
    label: "Nagłówek – część 2 (kolorowa)",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "działa?",
  },
  // Karta "Czym to NIE jest"
  {
    key: "why_not_badge",
    label: "Karta NIE – mała plakietka",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Czym to nie jest",
  },
  {
    key: "why_not_title",
    label: "Karta NIE – tytuł",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Bez złudzeń i presji",
  },
  {
    key: "why_not_item_1",
    label: "Karta NIE – punkt 1",
    group: "Dlaczego to działa",
    type: "textarea",
    defaultValue:
      "To nie jest poradnik o tym, żeby grzecznie czekać, przestać mieć potrzeby i pogodzić się z brakiem seksu.",
  },
  {
    key: "why_not_item_2",
    label: "Karta NIE – punkt 2",
    group: "Dlaczego to działa",
    type: "textarea",
    defaultValue:
      "Nie jest to również zestaw tanich sztuczek, które mają zmusić drugą osobę do zbliżenia. Presja, pretensje i manipulacja zwykle prowadzą do jeszcze większego dystansu.",
  },
  // Karta "Czym to JEST"
  {
    key: "why_is_badge",
    label: "Karta JEST – mała plakietka",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Czym to jest",
  },
  {
    key: "why_is_title",
    label: "Karta JEST – tytuł",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Sprawdzony plan działania",
  },
  {
    key: "why_is_item_1",
    label: "Karta JEST – punkt 1",
    group: "Dlaczego to działa",
    type: "textarea",
    defaultValue:
      "Ten plan pokazuje, dlaczego ochota może zanikać, które zachowania pogarszają sytuację i co możesz zrobić inaczej.",
  },
  {
    key: "why_is_item_2",
    label: "Karta JEST – punkt 2",
    group: "Dlaczego to działa",
    type: "textarea",
    defaultValue:
      "Nie możesz włączyć pożądania jednym zdaniem. Możesz jednak usunąć część rzeczy, które je blokują, odzyskać inicjatywę i stworzyć warunki, w których seks ma znacznie większą szansę ponownie stać się naturalną częścią Waszego związku.",
  },
  // Dolny cytat
  {
    key: "why_quote_title",
    label: "Cytat – nagłówek",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "„Koniec ze zgadywaniem.”",
  },
  {
    key: "why_quote_text",
    label: "Cytat – podtytuł",
    group: "Dlaczego to działa",
    type: "text",
    defaultValue: "Dajemy Ci plan, z którym wreszcie możesz zacząć działać.",
  },

  // ============================================================
  //  PROBLEM (ProblemBlock)
  // ============================================================
  {
    key: "problem_title_lead",
    label: "Nagłówek – część 1 (biała)",
    group: "Problem",
    type: "text",
    defaultValue: "Najgorsza nie jest jedna odmowa.",
  },
  {
    key: "problem_title_highlight",
    label: "Nagłówek – część 2 (kolorowa)",
    group: "Problem",
    type: "text",
    defaultValue: "Najgorsze jest to, co dzieje się później.",
  },
  {
    key: "problem_paragraph_1",
    label: "Akapit 1",
    group: "Problem",
    type: "textarea",
    defaultValue:
      "Najpierw słyszysz «nie dzisiaj». Później przestajesz pytać, bo nie chcesz znowu poczuć się odrzucony albo odrzucona. Dotyk staje się ostrożny. Rozmowy coraz krótsze. Jedna osoba czuje presję, druga frustrację.",
  },
  {
    key: "problem_paragraph_2",
    label: "Akapit 2",
    group: "Problem",
    type: "textarea",
    defaultValue:
      "W końcu oboje zaczynacie zachowywać się tak, jakby seks przestał być ważny. Ale problem nie znika. Rośnie pomiędzy Wami.",
  },
  {
    key: "problem_final",
    label: "Zdanie końcowe (wyróżnione)",
    group: "Problem",
    type: "textarea",
    defaultValue:
      "Ten plan pomoże Ci przerwać ten schemat, zanim brak seksu stanie się Waszą nową normalnością.",
  },
  {
    key: "problem_cta_text",
    label: "Tekst przycisku",
    group: "Problem",
    type: "text",
    defaultValue: "Nie chcę już tkwić w tym schemacie",
  },

  // ============================================================
  //  CENNIK / ZAKUP (Purchase)
  // ============================================================
  {
    key: "purchase_badge",
    label: "Plakietka sekcji",
    group: "Cennik",
    type: "text",
    defaultValue: "Szybki i dyskretny dostęp",
  },
  {
    key: "purchase_title_lead",
    label: "Nagłówek – część 1 (biała)",
    group: "Cennik",
    type: "text",
    defaultValue: "Możesz dalej zgadywać.",
  },
  {
    key: "purchase_title_highlight",
    label: "Nagłówek – część 2 (kolorowa)",
    group: "Cennik",
    type: "text",
    defaultValue: "Albo zacząć działać.",
  },
  {
    key: "purchase_subtitle",
    label: "Podtytuł sekcji",
    group: "Cennik",
    type: "textarea",
    defaultValue:
      "14 dni na sprawdzenie całego planu. Błyskawiczny i w 100% anonimowy dostęp natychmiast po opłaceniu zamówienia.",
  },
  {
    key: "purchase_card_badge",
    label: "Karta – plakietka u góry",
    group: "Cennik",
    type: "text",
    defaultValue: "Pełen Dostęp",
  },
  {
    key: "purchase_card_title",
    label: "Karta – nazwa produktu",
    group: "Cennik",
    type: "text",
    defaultValue: "Plan odzyskania bliskości",
  },
  {
    key: "purchase_card_desc",
    label: "Karta – opis produktu",
    group: "Cennik",
    type: "textarea",
    defaultValue:
      "Konkretna instrukcja dla osoby, która chce przestać słyszeć wyłącznie „nie teraz” i zrozumieć, co naprawdę zmieni sytuację.",
  },
  {
    key: "purchase_price_note",
    label: "Karta – dopisek pod ceną",
    group: "Cennik",
    type: "text",
    defaultValue: "Jednorazowa opłata • Dostęp na zawsze",
  },
  {
    key: "purchase_feature_1",
    label: "Karta – korzyść 1",
    group: "Cennik",
    type: "text",
    defaultValue: "12 konkretnych rozdziałów",
  },
  {
    key: "purchase_feature_2",
    label: "Karta – korzyść 2",
    group: "Cennik",
    type: "text",
    defaultValue: "4-tygodniowy plan działania",
  },
  {
    key: "purchase_feature_3",
    label: "Karta – korzyść 3",
    group: "Cennik",
    type: "text",
    defaultValue: "Scenariusze trudnych rozmów",
  },
  {
    key: "purchase_feature_4",
    label: "Karta – korzyść 4",
    group: "Cennik",
    type: "text",
    defaultValue: "Ćwiczenia pomagające odbudować napięcie",
  },
  {
    key: "purchase_feature_5",
    label: "Karta – korzyść 5",
    group: "Cennik",
    type: "text",
    defaultValue: "Fakty i rozwiązania oparte na badaniach",
  },
  {
    key: "purchase_feature_6",
    label: "Karta – korzyść 6",
    group: "Cennik",
    type: "text",
    defaultValue: "Prywatny i dyskretny dostęp",
  },
  {
    key: "purchase_cta_text",
    label: "Karta – tekst przycisku",
    group: "Cennik",
    type: "text",
    defaultValue: "Kupuję plan i zaczynam działać",
  },
  {
    key: "purchase_under_cta",
    label: "Karta – dopisek pod przyciskiem",
    group: "Cennik",
    type: "text",
    defaultValue: "Bezpieczny zakup z 14-dniową gwarancją",
  },
  {
    key: "purchase_payments_note",
    label: "Stopka – info o płatnościach",
    group: "Cennik",
    type: "text",
    defaultValue: "Bezpieczne płatności (SSL)",
  },

  // ============================================================
  //  FAQ
  // ============================================================
  {
    key: "faq_badge",
    label: "Plakietka sekcji",
    group: "FAQ",
    type: "text",
    defaultValue: "Warto wiedzieć",
  },
  {
    key: "faq_title",
    label: "Nagłówek sekcji",
    group: "FAQ",
    type: "text",
    defaultValue: "Najczęściej zadawane pytania",
  },
  {
    key: "faq_contact_label",
    label: "Tekst nad e-mailem",
    group: "FAQ",
    type: "text",
    defaultValue: "Masz inne pytanie? Napisz do nas:",
  },
  {
    key: "faq_q1_question", label: "Pytanie 1 – treść", group: "FAQ", type: "text", defaultValue: "Czy to kurs?" },
  { key: "faq_q1_answer", label: "Pytanie 1 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Nie. To konkretny przewodnik i 4-tygodniowy plan działania. Nie musisz oglądać wielu godzin nagrań. Czytasz kolejne części i od razu wybierasz rozwiązania pasujące do Waszej sytuacji." },
  { key: "faq_q2_question", label: "Pytanie 2 – treść", group: "FAQ", type: "text", defaultValue: "Czy ten poradnik jest dla mnie, jeśli prawie zawsze to ja inicjuję?" },
  { key: "faq_q2_answer", label: "Pytanie 2 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Tak. Pomoże Ci zrozumieć, dlaczego druga osoba może unikać zbliżenia, które działania pogarszają sytuację i jak odzyskać inicjatywę bez naciskania." },
  { key: "faq_q3_question", label: "Pytanie 3 – treść", group: "FAQ", type: "text", defaultValue: "Czy po zastosowaniu planu druga osoba będzie chciała częściej?" },
  { key: "faq_q3_answer", label: "Pytanie 3 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Nie da się uczciwie zagwarantować reakcji drugiej osoby. Plan pomaga jednak rozpoznać to, co może blokować ochotę, i wprowadzić zmiany zwiększające szanse na powrót pożądania oraz bliskości." },
  { key: "faq_q4_question", label: "Pytanie 4 – treść", group: "FAQ", type: "text", defaultValue: "Czy druga połówka musi wiedzieć, że korzystam z poradnika?" },
  { key: "faq_q4_answer", label: "Pytanie 4 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Nie. Możesz zacząć samodzielnie. Poradnik nie opiera się na ukrytych sztuczkach, tylko na zmianie sposobu działania, rozmowy i budowania bliskości." },
  { key: "faq_q5_question", label: "Pytanie 5 – treść", group: "FAQ", type: "text", defaultValue: "Co, jeśli problem może wynikać z bólu, choroby albo leków?" },
  { key: "faq_q5_answer", label: "Pytanie 5 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Poradnik pomoże Ci zauważyć takie sygnały, ale nie zastępuje diagnozy. W takiej sytuacji właściwym krokiem jest konsultacja z lekarzem lub odpowiednim specjalistą." },
  { key: "faq_q6_question", label: "Pytanie 6 – treść", group: "FAQ", type: "text", defaultValue: "Jak działa gwarancja i co, jeśli poradnik mi nie pomoże?" },
  { key: "faq_q6_answer", label: "Pytanie 6 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Masz 14 dni na sprawdzenie całego planu. Jeśli po zapoznaniu się z całością uznasz, że nie dostajesz konkretnego planu działania, napisz na cozrobic@viholding.pl w ciągu 14 dni od zakupu. Zwrócimy 149 zł, a dostęp zostanie zamknięty. Gwarancja dotyczy dostępu online i została opisana w regulaminie (§8a)." },
  { key: "faq_q7_question", label: "Pytanie 7 – treść", group: "FAQ", type: "text", defaultValue: "Czy mogę zaprosić drugą osobę do korzystania z materiałów?" },
  { key: "faq_q7_answer", label: "Pytanie 7 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Tak. Po zakupie w swoim panelu możesz wygenerować prywatny link z zaproszeniem do drugiej osoby lub wpisać jej e-mail, aby rozdziały były wysyłane etapami (co kilka dni). Dzięki temu partner czy partnerka poznaje materiał we własnym tempie, bez presji." },
  { key: "faq_q8_question", label: "Pytanie 8 – treść", group: "FAQ", type: "text", defaultValue: "Chcę też książkę w wersji drukowanej. Jak ją zamówić?" },
  { key: "faq_q8_answer", label: "Pytanie 8 – odpowiedź", group: "FAQ", type: "textarea", defaultValue: "Książkę zamówisz osobno — bezpośrednio po zakupie dostępu online lub później ze swojego panelu, przez stronę zamówienia. Dostęp online i książka to dwa odrębne produkty: dostęp aktywuje się natychmiast, a książkę wysyłamy kurierem lub do paczkomatu InPost." },

  // ============================================================
  //  FINALNE CTA (FinalCTA)
  // ============================================================
  {
    key: "final_badge",
    label: "Plakietka sekcji",
    group: "Finalne CTA",
    type: "text",
    defaultValue: "Czas na decyzję",
  },
  {
    key: "final_title_lead",
    label: "Nagłówek – część 1 (biała)",
    group: "Finalne CTA",
    type: "text",
    defaultValue: "Za miesiąc możesz być",
  },
  {
    key: "final_title_highlight",
    label: "Nagłówek – część 2 (kolorowa)",
    group: "Finalne CTA",
    type: "text",
    defaultValue: "dokładnie w tym samym miejscu",
  },
  {
    key: "final_paragraph_1",
    label: "Akapit 1 (w ramce)",
    group: "Finalne CTA",
    type: "textarea",
    defaultValue:
      "Kolejne „nie dzisiaj”. Kolejne rozczarowanie. Kolejny wieczór, podczas którego oboje udajecie, że wszystko jest w porządku.",
  },
  {
    key: "final_paragraph_2",
    label: "Akapit 2 (wyróżniony)",
    group: "Finalne CTA",
    type: "text",
    defaultValue: "Albo pierwszy konkretny krok w stronę zmiany.",
  },
  {
    key: "final_paragraph_3",
    label: "Akapit 3",
    group: "Finalne CTA",
    type: "textarea",
    defaultValue:
      "Nie masz pełnej kontroli nad ochotą drugiej osoby. Masz jednak wpływ na to, co zrobisz teraz, jak rozpoczniesz rozmowę i czy przestaniesz powtarzać schemat, który do tej pory nie działał.",
  },
  {
    key: "final_cta_text",
    label: "Tekst przycisku",
    group: "Finalne CTA",
    type: "text",
    defaultValue: "Chcę zmienić tę sytuację",
  },

  // ============================================================
  //  FOOTER
  // ============================================================
  {
    key: "footer_brand",
    label: "Nazwa serwisu",
    group: "Stopka",
    type: "text",
    defaultValue: "Co zrobić, gdy Twoja druga połówka nie chce",
  },
  {
    key: "footer_rights",
    label: "Tekst praw autorskich",
    group: "Stopka",
    type: "text",
    defaultValue: "Wszelkie prawa zastrzeżone.",
  },
  {
    key: "footer_email",
    label: "E-mail kontaktowy",
    group: "Stopka",
    type: "text",
    defaultValue: "cozrobic@viholding.pl",
  },
  {
    key: "footer_contact",
    label: "Etykieta linku kontakt",
    group: "Stopka",
    type: "text",
    defaultValue: "Kontakt",
  },
  {
    key: "footer_disclaimer",
    label: "Disclaimer na dole",
    group: "Stopka",
    type: "textarea",
    defaultValue:
      "Materiał ma charakter edukacyjny i nie zastępuje indywidualnej pomocy medycznej, psychologicznej ani seksuologicznej.",
  },
];

/** Mapa: klucz -> wartość domyślna */
export const DEFAULT_CONTENT: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.defaultValue])
);

/** Zwraca komplet treści: wartości z bazy nadpisują domyślne. */
export async function getSiteContent(): Promise<Record<string, string>> {
  const merged = { ...DEFAULT_CONTENT };
  try {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("key, value");
    if (error) {
      // Brak tabeli / inny błąd – działamy na fallbackach.
      console.error("[siteContent] read error:", error.message);
      return merged;
    }
    for (const row of data ?? []) {
      if (row?.key && typeof row.value === "string") {
        merged[row.key] = row.value;
      }
    }
  } catch (e) {
    console.error("[siteContent] unexpected:", e);
  }
  return merged;
}


// ============================================================
//  WERSJONOWANIE TREŚCI
// ============================================================

export type ContentVersion = {
  id: number;
  created_at: string;
  saved_by: string | null;
  label: string | null;
  changed_count: number;
  changes: Record<string, string>; // key -> etykieta pola
};

/** Pojedyncza zmiana: { key: labelPola } */
export type ContentChange = Record<string, string>;

function labelFor(key: string): string {
  const f = CONTENT_FIELDS.find((x) => x.key === key);
  return f ? f.label : key;
}

/**
 * Porównuje dwa stany i zwraca mapę zmian { key: label }.
 * (Wartość nie trafia do opisu – tylko nazwa pola.)
 */
export function diffContent(
  before: Record<string, string>,
  after: Record<string, string>
): ContentChange {
  const changes: ContentChange = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const key of keys) {
    const a = before[key] ?? "";
    const b = after[key] ?? "";
    if (a !== b) changes[key] = labelFor(key);
  }
  return changes;
}

/**
 * Zapisuje snapshot aktualnego stanu bazy (tylko wiersze obecne w DB).
 * Wywoływane PRZED nadpisaniem treści, żeby można było wrócić.
 */
export async function snapshotContent(opts?: {
  savedBy?: string | null;
  label?: string | null;
  changes?: ContentChange;
}): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("key, value");
    if (error) {
      console.error("[siteContent] snapshot read error:", error.message);
      return;
    }
    const snapshot: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row?.key) snapshot[row.key] = String(row.value ?? "");
    }
    const changes = opts?.changes ?? {};
    const changedCount = Object.keys(changes).length;
    const { error: insErr } = await supabaseAdmin
      .from("site_content_versions")
      .insert({
        snapshot,
        saved_by: opts?.savedBy ?? null,
        label: opts?.label ?? null,
        changes,
        changed_count: changedCount,
      });
    if (insErr) {
      console.error("[siteContent] snapshot insert error:", insErr.message);
    }
  } catch (e) {
    console.error("[siteContent] snapshot unexpected:", e);
  }
}

/** Lista wersji (bez pełnego snapshotu), najnowsze pierwsze. */
export async function listVersions(limit = 40): Promise<ContentVersion[]> {
  const { data, error } = await supabaseAdmin
    .from("site_content_versions")
    .select("id, created_at, saved_by, label, changed_count, changes")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as ContentVersion[];
}

/** Pobiera snapshot konkretnej wersji. */
export async function getVersionSnapshot(
  id: number
): Promise<Record<string, string> | null> {
  const { data, error } = await supabaseAdmin
    .from("site_content_versions")
    .select("snapshot")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.snapshot) return null;
  return data.snapshot as Record<string, string>;
}

/**
 * Przywraca wersję: najpierw snapshot bieżącego stanu (można cofnąć),
 * potem nadpisuje treść zapisanym stanem.
 */
export async function restoreVersion(id: number): Promise<number> {
  const snapshot = await getVersionSnapshot(id);
  if (!snapshot) throw new Error("Nie znaleziono wersji.");

  // Snapshot obecnego stanu - żeby przywrócenie też dało się cofnąć.
  const before = await getSiteContent();
  const changes = diffContent(before, snapshot);
  await snapshotContent({
    label: `Przywrócono wersję #${id}`,
    changes,
  });

  const now = new Date().toISOString();
  const rows = Object.entries(snapshot).map(([key, value]) => ({
    key,
    value: String(value ?? ""),
    updated_at: now,
  }));

  if (rows.length > 0) {
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
  }

  return rows.length;
}
