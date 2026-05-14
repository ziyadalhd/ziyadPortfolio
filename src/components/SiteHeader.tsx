"use client";

import { useEffect, useRef, useState } from "react";

import { personalInfo } from "@/data/portfolio";

const navItems = [
  { href: "#about", label: "About", id: "about" },
  { href: "#journey", label: "Journey", id: "journey" },
  { href: "#portfolio", label: "Portfolio", id: "portfolio" },
  { href: "#digital-twin", label: "Digital Twin", id: "digital-twin" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);
  // Tracks the latest intersection ratio for each observed section so we
  // always pick the most-visible one, even when callbacks fire separately.
  const ratioMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMapRef.current.set(entry.target.id, entry.intersectionRatio);
        });

        let bestId = "";
        let bestRatio = 0;
        ratioMapRef.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestRatio > 0 && bestId) {
          setActiveSection(bestId);
        }
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Move focus into the nav when the mobile menu opens.
  useEffect(() => {
    if (menuOpen) {
      firstNavLinkRef.current?.focus();
    }
  }, [menuOpen]);

  // Close menu on Escape and return focus to the toggle button.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:flex md:items-center md:justify-between md:p-6">
      <div>
        <p className="eyebrow text-cyan-300">{personalInfo.roleTagline}</p>
        <strong className="mt-2 block text-2xl font-semibold text-white md:text-3xl">
          {personalInfo.name}
        </strong>
      </div>

      <button
        ref={menuButtonRef}
        type="button"
        className="button-secondary mt-5 inline-flex md:hidden"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        {menuOpen ? "Close menu" : "Menu"}
      </button>

      <nav
        id="site-navigation"
        className={`mt-5 flex-col gap-3 text-sm text-slate-300 md:mt-0 md:flex md:flex-row md:items-center md:gap-4 ${
          menuOpen ? "flex" : "hidden"
        }`}
        aria-label="Primary navigation"
      >
        {navItems.map((item, index) => (
          <a
            key={item.href}
            ref={index === 0 ? firstNavLinkRef : undefined}
            href={item.href}
            className="nav-link"
            aria-current={activeSection === item.id ? "true" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
