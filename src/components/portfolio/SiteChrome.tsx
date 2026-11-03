"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

import { DigitalTwinChat } from "@/components/digital-twin-chat";
import { personalInfo } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { INPUT_MODE_KEY, syncThemeChrome, THEME_KEY } from "@/lib/theme";
import { Icon } from "./Icon";
import { TwinTrigger } from "./TwinTrigger";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  syncThemeChrome(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* The theme still works when storage is unavailable. */
  }
}

export function SiteChrome({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const s = dict.spec;
  const otherLocale = locale === "ar" ? "en" : "ar";
  const otherPath = path.replace(`/${locale}`, `/${otherLocale}`);

  useEffect(() => {
    const root = document.documentElement;
    syncThemeChrome(root.dataset.theme === "dark" ? "dark" : "light");
    const keyboard = () => {
      if (root.dataset.inputMode !== "keyboard")
        root.dataset.inputMode = "keyboard";
    };
    const pointer = () => {
      if (root.dataset.inputMode !== "pointer")
        root.dataset.inputMode = "pointer";
    };
    const pageSwap = (event: PageSwapEvent) => {
      const mode =
        root.dataset.inputMode === "keyboard" ? "keyboard" : "pointer";
      try {
        sessionStorage.setItem(INPUT_MODE_KEY, mode);
      } catch {
        /* The current document still skips keyboard motion. */
      }
      if (mode === "keyboard") event.viewTransition?.skipTransition();
    };
    document.addEventListener("keydown", keyboard);
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("wheel", pointer, { passive: true });
    window.addEventListener("pageswap", pageSwap);
    return () => {
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("wheel", pointer);
      window.removeEventListener("pageswap", pageSwap);
    };
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        {dict.skipToContent}
      </a>
      <header className="site-header">
        <div className="header-shell">
          <a
            className="site-wordmark"
            href={`/${locale}`}
            aria-label={s.hero.name}
          >
            <span className="wordmark-name" aria-hidden="true">
              {locale === "ar" ? "زيـاد" : s.hero.firstName}
            </span>
          </a>
          <nav className="site-nav" aria-label={s.navigation}>
            <a
              href={`/${locale}#s4`}
              aria-current={
                path.includes("/projects/") ? "location" : undefined
              }
            >
              {s.s4.heading}
            </a>
            <a href={`/${locale}#about`}>{s.s1.heading}</a>
          </nav>
          <div className="site-tools">
            <a
              className="language-switch"
              href={otherPath}
              hrefLang={otherLocale}
              aria-label={dict.localeSwitch.aria}
            >
              <Icon name="globe" />
            </a>
            <button
              className="theme-switch"
              onClick={toggleTheme}
              type="button"
            >
              <span
                className="theme-label-light"
                aria-label={s.theme.switchToDark}
              >
                <Icon name="moon" />
              </span>
              <span
                className="theme-label-dark"
                aria-label={s.theme.switchToLight}
              >
                <Icon name="sun" />
              </span>
            </button>
            <a
              className="contact-button"
              href={personalInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.s7.contact}
              <Icon name="arrow" />
            </a>
          </div>
        </div>
      </header>
      {children}
      <footer id="contact" className="site-footer" aria-label={s.s7.heading}>
        <div className="footer-main page-width">
          <div className="footer-invitation">
            <h2>{s.s7.heading}</h2>
            <a
              className="contact-button footer-whatsapp"
              href={personalInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.s7.contact}
              <Icon name="arrow" />
            </a>
            {path !== `/${locale}` && <TwinTrigger label={s.s6.open} />}
          </div>
          <nav className="footer-navigation" aria-label={s.navigation}>
            <h3>{s.footer.navigation}</h3>
            <a href={`/${locale}#s4`}>{s.s4.heading}</a>
            <a href={`/${locale}#about`}>{s.s1.heading}</a>
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.s5.annexView}
            </a>
          </nav>
          <div className="footer-connect">
            <h3>{s.footer.contact}</h3>
            <a className="footer-email" href={`mailto:${personalInfo.email}`}>
              <Icon name="mail" />
              {s.s7.emailLabel}
            </a>
            <div className="footer-links">
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Image
                  src="/brands/linkedin.svg"
                  width={20}
                  height={20}
                  alt=""
                />
                <span>LinkedIn</span>
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <Image
                  className="brand-monochrome"
                  src="/brands/github.svg"
                  width={20}
                  height={20}
                  alt=""
                />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom page-width">
          <span>{s.footer.prepared}</span>
          <bdi>© 2026</bdi>
          <a href="#main-content">
            {s.footer.backTo0}
            <Icon name="down" className="up-arrow" />
          </a>
        </div>
      </footer>
      <dialog
        id="twin-dialog"
        className="twin-dialog"
        ref={dialog}
        aria-label={dict.twin.panelTitle}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="twin-dialog-top">
          <span>{s.s6.title}</span>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={s.s6.close}
          >
            <Icon name="close" />
          </button>
        </div>
        <DigitalTwinChat locale={locale} content={dict.twin} />
      </dialog>
    </>
  );
}
