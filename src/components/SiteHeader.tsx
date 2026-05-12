"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
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

  return (
    <header className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:flex md:items-center md:justify-between md:p-6">
      <div>
        <p className="eyebrow text-cyan-300">
          Software Engineering | Mobile Application Engineer
        </p>
        <strong className="mt-2 block text-2xl font-semibold text-white md:text-3xl">
          Ziyad Jaber Alhdriti
        </strong>
      </div>

      <button
        type="button"
        className="button-secondary mt-5 inline-flex md:hidden"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        Menu
      </button>

      <nav
        id="site-navigation"
        className={`mt-5 flex-col gap-3 text-sm text-slate-300 md:mt-0 md:flex md:flex-row md:items-center md:gap-4 ${
          menuOpen ? "flex" : "hidden"
        }`}
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-link"
            aria-current={activeSection === item.id ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
