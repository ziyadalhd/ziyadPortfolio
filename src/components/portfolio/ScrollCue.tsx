"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/** Grow only the cue itself; scrolling stays entirely native. */
export function ScrollCue({ label }: { label: string }) {
  const cue = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const arrow = cue.current!.querySelector("svg")!;
    const hero = cue.current!.closest(".home-hero")!;
    let height = hero.clientHeight;
    let frame = 0;
    const resize = new ResizeObserver(() => {
      height = hero.clientHeight;
    });
    const update = () => {
      frame = 0;
      arrow.style.transform = `scale(${1 + Math.min(1, Math.max(0, scrollY / height)) * 0.8})`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    resize.observe(hero);
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <a ref={cue} className="hero-scroll" href="#s4" aria-label={label}>
      <Icon name="down" />
    </a>
  );
}
