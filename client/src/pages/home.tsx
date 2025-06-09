import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Templates from "@/components/templates";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Templates />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
