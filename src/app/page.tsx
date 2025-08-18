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

async function getAuth() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return { loggedIn: false, email: null as string | null };

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return { loggedIn: true, email: (payload as any)?.email ?? null };
  } catch {
    return { loggedIn: false, email: null };
  }
}

export default async function Page() {
  const { loggedIn, email } = await getAuth();

  return (
    <div className="bg-[#0f1222] text-white antialiased">
      {/* przekaż informację o zalogowaniu do Headera, aby zmienić przycisk */}
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
