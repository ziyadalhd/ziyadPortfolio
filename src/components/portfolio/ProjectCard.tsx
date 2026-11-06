"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Pause offscreen previews without updating React on every animation frame. */
export function ProjectCard({
  slug,
  animated,
  className,
  children,
}: {
  slug: string;
  animated: boolean;
  className?: string;
  children: ReactNode;
}) {
  const card = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!animated) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(card.current!);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <article
      ref={card}
      className={className}
      id={`work-${slug}`}
      data-work-panel={slug}
      data-paused={!visible}
    >
      {children}
    </article>
  );
}
