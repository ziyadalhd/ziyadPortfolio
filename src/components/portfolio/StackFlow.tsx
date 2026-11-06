"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Measure only on resize; the browser drives the scroll transforms. */
export function StackFlow({ children }: { children: ReactNode }) {
  const flow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = flow.current!;
    const cards = [...root.querySelectorAll<HTMLElement>(".stack-study-card")];
    let band: IntersectionObserver;
    const measure = () => {
      const header = document.querySelector(".site-header")!;
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      const top = Math.min(
        header.getBoundingClientRect().bottom + 20,
        innerHeight - height - 24,
      );
      root.style.setProperty("--stack-pin", `${top}px`);
      root.dataset.ready = "true";
      band?.disconnect();
      const entered = new Set<number>();
      const bandTop = Math.max(0, top);
      const bottom = Math.max(
        0,
        innerHeight - bandTop - Math.min(160, innerHeight * 0.2),
      );
      band = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const index = cards.indexOf(entry.target as HTMLElement);
            if (entry.isIntersecting) entered.add(index);
            else entered.delete(index);
          }
          const active = Math.max(-1, ...entered);
          cards.forEach((card, index) => {
            card.dataset.covered = String(index < active);
          });
        },
        { rootMargin: `-${bandTop}px 0px -${bottom}px 0px` },
      );
      cards.forEach((card) => band.observe(card));
    };
    const resize = new ResizeObserver(measure);
    cards.forEach((card) => resize.observe(card));
    window.addEventListener("resize", measure);
    measure();
    return () => {
      band.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div ref={flow} className="stack-study-flow page-width">
      {children}
    </div>
  );
}
