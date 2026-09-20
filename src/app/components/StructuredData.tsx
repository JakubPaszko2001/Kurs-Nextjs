import React from "react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kurs-nextjs.vercel.app";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Plan odzyskania bliskości – pełen dostęp",
  description:
    "Konkretny przewodnik i 4-tygodniowy plan dla osób, które chcą odbudować seks, pożądanie i bliskość w związku.",
  brand: {
    "@type": "Brand",
    name: "Plan odzyskania bliskości",
  },
  category: "Poradnik / E-book",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Czy to kurs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nie. To konkretny przewodnik i 4-tygodniowy plan działania. Nie musisz oglądać wielu godzin nagrań. Czytasz kolejne części i od razu wybierasz rozwiązania pasujące do Waszej sytuacji.",
      },
    },
    {
      "@type": "Question",
      name: "Czy ten poradnik jest dla mnie, jeśli prawie zawsze to ja inicjuję?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak. Pomoże Ci zrozumieć, dlaczego druga osoba może unikać zbliżenia, które działania pogarszają sytuację i jak odzyskać inicjatywę bez naciskania.",
      },
    },
    {
      "@type": "Question",
      name: "Czy po zastosowaniu planu druga osoba będzie chciała częściej?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nie da się uczciwie zagwarantować reakcji drugiej osoby. Plan pomaga jednak rozpoznać to, co może blokować ochotę, i wprowadzić zmiany zwiększające szanse na powrót pożądania oraz bliskości.",
      },
    },
    {
      "@type": "Question",
      name: "Czy druga połówka musi wiedzieć, że korzystam z poradnika?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nie. Możesz zacząć samodzielnie. Poradnik nie opiera się na ukrytych sztuczkach, tylko na zmianie sposobu działania, rozmowy i budowania bliskości.",
      },
    },
    {
      "@type": "Question",
      name: "Co, jeśli problem może wynikać z bólu, choroby albo leków?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Poradnik pomoże Ci zauważyć takie sygnały, ale nie zastępuje diagnozy. W takiej sytuacji właściwym krokiem jest konsultacja z lekarzem lub odpowiednim specjalistą.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Plan odzyskania bliskości",
  url: SITE_URL,
  inLanguage: "pl-PL",
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
