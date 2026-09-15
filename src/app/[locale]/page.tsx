import { SiteHeader } from "@/components/SiteHeader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { DigitalTwinSection } from "@/components/sections/DigitalTwinSection";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Portfolio } from "@/components/sections/Portfolio";
import { TechnicalFocus } from "@/components/sections/TechnicalFocus";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-base text-slate-100"
    >
      <a href="#hero" className="skip-link">
        {dict.skipToContent}
      </a>

      {/* Ambient background layers */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute left-0 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] rounded-full bg-amber-600/8 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 pb-20 pt-8 md:gap-16 md:px-10 lg:gap-20 lg:pt-12">
        <div className="animate-slide-up delay-0">
          <SiteHeader content={dict.nav} locale={locale} />
        </div>

        <div className="animate-slide-up delay-100">
          <Hero content={dict.hero} locale={locale} />
        </div>

        <div className="animate-slide-up delay-200">
          <About content={dict.about} />
        </div>

        <div className="animate-slide-up delay-300">
          <Journey content={dict.journey} locale={locale} />
        </div>

        <div className="animate-slide-up delay-400">
          <TechnicalFocus content={dict.focus} />
        </div>

        <div className="animate-slide-up delay-500">
          <Portfolio content={dict.portfolio} locale={locale} />
        </div>

        <div className="animate-slide-up delay-600">
          <DigitalTwinSection content={dict.twin} locale={locale} />
        </div>

        <div className="animate-slide-up delay-700">
          <Contact content={dict.contact} />
        </div>

        <footer className="pb-2 text-center">
          <span className="eyebrow text-[0.62rem] text-slate-600">
            {dict.footer.tagline}
          </span>
        </footer>
      </div>
    </main>
  );
}
