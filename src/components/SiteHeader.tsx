"use client";

import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "#about", label: "About", id: "about" },
  { href: "#journey", label: "Journey", id: "journey" },
  { href: "#portfolio", label: "Portfolio", id: "portfolio" },
  { href: "#digital-twin", label: "Twin", id: "digital-twin" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);
  const ratioMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratioMapRef.current.set(e.target.id, e.intersectionRatio));
        let bestId = "";
        let bestRatio = 0;
        ratioMapRef.current.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        if (bestRatio > 0 && bestId) setActiveSection(bestId);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) firstNavLinkRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      role="banner"
      style={{
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        transition: "background 300ms ease, box-shadow 300ms ease, backdrop-filter 300ms ease",
        background: scrolled
          ? "rgba(6,8,15,0.88)"
          : "rgba(255,255,255,0.025)",
        backdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "blur(8px)",
        boxShadow: scrolled
          ? "0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset"
          : "none",
      }}
    >
      {/* Amber top shimmer */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.55) 35%, rgba(251,146,60,0.45) 65%, transparent 100%)",
        }}
      />

      {/* ── Single unified row ── */}
      <div className="flex items-center gap-4 px-5 py-3.5 md:px-6 md:py-0 md:h-[58px]">

        {/* Name — left anchor */}
        <a
          href="#hero"
          aria-label="Back to top"
          className="shrink-0 select-none"
          style={{ textDecoration: "none" }}
        >
          <span
            className="text-base font-extrabold tracking-tight text-white md:text-[1.05rem]"
            style={{ fontFamily: "var(--font-syne)", lineHeight: 1 }}
          >
            Ziyad
            <span style={{ color: "var(--clr-amber)" }}>.</span>
          </span>
        </a>

        {/* Separator — desktop only */}
        <div
          aria-hidden="true"
          className="hidden md:block shrink-0 h-5 w-px"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />

        {/* Desktop nav — center */}
        <nav
          className="hidden md:flex items-center gap-0.5 flex-1"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "" : undefined}
                className="header-nav-link relative flex items-center px-3.5 h-9 rounded-lg text-[0.8rem] font-semibold"
                style={{
                  fontFamily: "var(--font-syne)",
                  letterSpacing: "0.025em",
                  textDecoration: "none",
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                    style={{ background: "var(--clr-amber)" }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3">
          {/* Status badge — desktop */}
          <div
            className="hidden md:inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold"
            style={{
              fontFamily: "var(--font-syne)",
              letterSpacing: "0.04em",
              border: "1px solid rgba(52,211,153,0.22)",
              background: "rgba(52,211,153,0.06)",
              color: "rgba(110,231,183,0.85)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Available
          </div>

          {/* Mobile hamburger */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center"
            style={{
              minHeight: "36px",
              width: "36px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--clr-muted)",
              cursor: "pointer",
              transition: "border-color 150ms ease, color 150ms ease",
            }}
          >
            <span
              className="relative flex flex-col items-center justify-center gap-[5px]"
              style={{ width: 16, height: 12 }}
              aria-hidden="true"
            >
              <span
                className="block w-4 rounded-full transition-all duration-200"
                style={{
                  height: "1.5px",
                  background: "currentColor",
                  transformOrigin: "center",
                  transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block w-3 self-start rounded-full transition-all duration-200"
                style={{
                  height: "1.5px",
                  background: "currentColor",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-4 rounded-full transition-all duration-200"
                style={{
                  height: "1.5px",
                  background: "currentColor",
                  transformOrigin: "center",
                  transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer — CSS grid-rows height animation ── */}
      <div
        id="mobile-nav"
        role="navigation"
        aria-label="Primary navigation"
        style={{
          display: "grid",
          gridTemplateRows: menuOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 260ms cubic-bezier(0.23, 1, 0.32, 1)",
          borderTop: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="flex flex-col px-3 py-2 gap-0.5">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  ref={index === 0 ? firstNavLinkRef : undefined}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive ? "" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="header-mobile-link flex items-center justify-between px-4 rounded-xl text-sm font-semibold"
                  style={{
                    fontFamily: "var(--font-syne)",
                    minHeight: "48px",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "999px",
                        background: "var(--clr-amber)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </a>
              );
            })}

            {/* Mobile status badge */}
            <div
              className="mx-4 mt-1 mb-2 flex items-center gap-2 rounded-xl px-4 py-3"
              style={{
                border: "1px solid rgba(52,211,153,0.2)",
                background: "rgba(52,211,153,0.05)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span
                className="text-xs font-semibold"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "rgba(110,231,183,0.8)",
                  letterSpacing: "0.05em",
                }}
              >
                Open to opportunities
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
