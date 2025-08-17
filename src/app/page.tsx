import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhatYouGet from "./components/WhatYouGet";
import WhyItWorks from "./components/WhyItWorks";
import Purchase from "./components/Purchase";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

import Userpage from "./components/Userpage"; // <- jeśli to komponent w app/, inaczej popraw ścieżkę

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function isLoggedIn() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return true;
  } catch {
    return false;
  }
}

export default async function Page() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    // >>> Użytkownik zalogowany: strona główna = Userpage
    return <Userpage />;
  }

  // >>> Niezalogowany: landing jak do tej pory
  return (
    <div className="bg-[#0f1222] text-white antialiased">
      <Header />
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
