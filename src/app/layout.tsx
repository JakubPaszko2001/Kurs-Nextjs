import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bazowy adres serwisu – ustaw NEXT_PUBLIC_SITE_URL na Vercelu (np. https://kurs-nextjs.vercel.app)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kurs-nextjs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Co zrobić, gdy druga połówka nie chce? | Plan odzyskania bliskości",
    template: "%s | Plan odzyskania bliskości",
  },
  description:
    "Konkretny przewodnik i 4-tygodniowy plan dla osób, które chcą odbudować seks, pożądanie i bliskość w związku.",
  keywords: [
    "gdy druga połówka nie chce",
    "brak ochoty na seks",
    "odbudowa bliskości w związku",
    "plan odzyskania bliskości",
    "poradnik dla par",
    "pożądanie w związku",
    "nierównowaga libido",
  ],
  authors: [{ name: "Plan odzyskania bliskości" }],
  creator: "Plan odzyskania bliskości",
  publisher: "Plan odzyskania bliskości",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE_URL,
    siteName: "Plan odzyskania bliskości",
    title: "Co zrobić, gdy druga połówka nie chce? | Plan odzyskania bliskości",
    description:
      "Konkretny przewodnik i 4-tygodniowy plan dla osób, które chcą odbudować seks, pożądanie i bliskość w związku.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Co zrobić, gdy druga połówka nie chce?",
    description:
      "Konkretny przewodnik i 4-tygodniowy plan odbudowy bliskości i pożądania w związku.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
      manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/android-icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-icon-180x180.png", sizes: "180x180" },
      { url: "/apple-icon.png" },
    ],
    other: [
      { rel: "msapplication-TileImage", url: "/ms-icon-144x144.png" },
    ],
  },
  other: {
    "msapplication-TileColor": "#0f1222",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f1222",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
