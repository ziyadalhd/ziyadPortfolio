import { SiteHeader } from "@/components/SiteHeader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { DigitalTwinSection } from "@/components/sections/DigitalTwinSection";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Portfolio } from "@/components/sections/Portfolio";
import { TechnicalFocus } from "@/components/sections/TechnicalFocus";

export default function Home() {
  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#070b14] text-slate-100"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-10 md:gap-16 md:px-10 lg:gap-20">
        <SiteHeader />
        <Hero />
        <About />
        <Journey />
        <TechnicalFocus />
        <Portfolio />
        <DigitalTwinSection />
        <Contact />

        <footer className="pb-2 text-center text-xs uppercase tracking-[0.22em] text-slate-300">
          Ziyad Alhdriti - Engineered with precision
        </footer>
      </div>
    </main>
  );
}
