import type { MetadataRoute } from "next";

// Bazowy adres – ustaw NEXT_PUBLIC_SITE_URL na Vercelu
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kurs-nextjs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/regulamin`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/polityka-prywatnosci`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
