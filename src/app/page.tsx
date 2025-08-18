// src/app/page.tsx
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhatYouGet from "./components/WhatYouGet";
import WhyItWorks from "./components/WhyItWorks";
import Purchase from "./components/Purchase";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

type AuthInfo = {
  loggedIn: boolean;
  email: string | null;
};

async function getAuth(): Promise<AuthInfo> {
  const cookieStore = await cookies(); // Next 15: async cookies()
  const token = cookieStore.get("session")?.value;
  if (!token) return { loggedIn: false, email: null };

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    // bez `any`: wyciągamy email w bezpieczny sposób
    const p = payload as Record<string, unknown>;
    const email = typeof p.email === "string" ? p.email : null;

    return { loggedIn: true, email };
  } catch {
    return { loggedIn: false, email: null };
  }
}

export default async function Page() {
  const { loggedIn, email } = await getAuth();

  return (
    <div className="bg-[#0f1222] text-white antialiased">
      {/* Przekazujemy info do Headera (upewnij się, że Header przyjmuje te propsy) */}
      <Header loggedIn={loggedIn} userEmail={email ?? undefined} />

      <main>
        <Hero />
        <HowItWorks />
        <WhatYouGet />
        <WhyItWorks />
        <Purchase />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
