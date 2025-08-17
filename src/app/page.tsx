import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhatYouGet from "./components/WhatYouGet";
import WhyItWorks from "./components/WhyItWorks";
import Purchase from "./components/Purchase";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Page() {

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
