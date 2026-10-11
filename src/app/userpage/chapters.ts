// src/app/userpage/chapters.ts
// Wspólna lista rozdziałów przewodnika (używana w panelu konta i na stronie rozdziału).

export type Chapter = {
  id: number;
  title: string;
  desc: string;
  pdf: string; // ścieżka w /public
};

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Rozdział 1 - Pożądanie nie jest przyciskiem",
    desc: "Dlaczego pożądanie to nie przełącznik i co to oznacza dla bliskości.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-1.pdf",
  },
  {
    id: 2,
    title: "Rozdział 2 - Co nauka naprawdę mówi o zdrowiu",
    desc: "Fakty i mity o zdrowiu seksualnym w świetle badań.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-2.pdf",
  },
  {
    id: 3,
    title: "Rozdział 3 - Serce, krążenie i bezpieczeństwo wysiłku",
    desc: "Jak zadbać o serce i bezpiecznie wracać do aktywności.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-3.pdf",
  },
  {
    id: 4,
    title: "Rozdział 4 - Stres, dotyk i układ nerwowy",
    desc: "Wpływ stresu na bliskość i rola dotyku w regulacji napięcia.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-4.pdf",
  },
  {
    id: 5,
    title: "Rozdział 5 - Sen po bliskości",
    desc: "Dlaczego sen jest kluczowy i jak poprawić jego jakość.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-5.pdf",
  },
  {
    id: 6,
    title: "Rozdział 6 - Więź, oksytocyna i to, co zostaje po seksie",
    desc: "Biologia więzi i budowanie trwałej bliskości.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-6.pdf",
  },
  {
    id: 7,
    title: "Rozdział 7 - Satysfakcja, dobrostan i pułapka liczenia",
    desc: "Czym jest prawdziwa satysfakcja i dlaczego liczenie szkodzi.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-7.pdf",
  },
  {
    id: 8,
    title: "Rozdział 8 - Pewność siebie i obraz ciała",
    desc: "Praca nad samooceną i akceptacją własnego ciała.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-8.pdf",
  },
  {
    id: 9,
    title: "Rozdział 9 - Ruch, kondycja i kalorie",
    desc: "Aktywność fizyczna wspierająca zdrowie i bliskość.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-9.pdf",
  },
  {
    id: 10,
    title: "Rozdział 10 - Hormony, leki i etapy życia",
    desc: "Jak hormony, leki i etapy życia wpływają na bliskość.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-10.pdf",
  },
  {
    id: 11,
    title: "Rozdział 11 - Związek na lata: rozmowa zamiast presji",
    desc: "Jak rozmawiać o bliskości i budować relację na lata.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-11.pdf",
  },
  {
    id: 12,
    title: "Rozdział 12 - Mity, bezpieczeństwo i wspólny plan",
    desc: "Rozprawiamy się z mitami i tworzymy wspólny plan.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-12.pdf",
  },
  {
    id: 13,
    title: "Rozdział 13 - Zakończenie i mapa dalszych kroków",
    desc: "Podsumowanie i plan dalszych kroków na przyszłość.",
    pdf: "/rozdzialy/Bliskosc_bez_presji_poradnik-part-13.pdf",
  },
];

export const LAST_CHAPTER = chapters[chapters.length - 1].id;

export function getChapter(id: number | string): Chapter | undefined {
  const num = typeof id === "string" ? parseInt(id, 10) : id;
  return chapters.find((c) => c.id === num);
}
