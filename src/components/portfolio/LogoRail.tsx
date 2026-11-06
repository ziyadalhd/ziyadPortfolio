"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Stop decorative motion outside the viewport. */
export function LogoRail({
  children,
  label,
  kind,
}: {
  children: ReactNode;
  label: string;
  kind: "organizations" | "tools";
}) {
  const rail = useRef<HTMLDivElement>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const [repeats, setRepeats] = useState(1);
  useEffect(() => {
    const element = rail.current!;
    const fill = new ResizeObserver(() => {
      setRepeats(
        Math.max(
          1,
          Math.ceil(element.clientWidth / sequence.current!.offsetWidth),
        ),
      );
    });
    fill.observe(element);
    fill.observe(sequence.current!);
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      fill.disconnect();
    };
  }, []);
  return (
    <div
      ref={rail}
      className={`logo-rail ${kind}-rail`}
      data-visible="false"
      role="region"
      aria-label={label}
    >
      <div className="logo-track">
        {[0, 1].map((copy) => (
          <div
            className="logo-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {Array.from({ length: repeats }, (_, index) => (
              <div
                className="logo-sequence"
                key={index}
                ref={copy === 0 && index === 0 ? sequence : undefined}
                aria-hidden={index > 0 ? true : undefined}
              >
                {children}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
