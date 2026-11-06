"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { technologyLogos } from "@/data/technology-logos";
import type { Locale } from "@/i18n/config";

/** Reserve room for the actual hidden count instead of wrapping the logos. */
export function TechnologyStrip({
  tools,
  locale,
  label,
}: {
  tools: string[];
  locale: Locale;
  label: string;
}) {
  const list = useRef<HTMLUListElement>(null);
  const [visibleCount, setVisibleCount] = useState(Math.min(2, tools.length));
  useEffect(() => {
    const element = list.current!;
    const measure = () => {
      const styles = getComputedStyle(element);
      const size = parseFloat(styles.getPropertyValue("--tech-size"));
      const gap = parseFloat(styles.columnGap);
      const counter = parseFloat(styles.getPropertyValue("--tech-more-size"));
      const fullWidth = tools.length * size + (tools.length - 1) * gap;
      setVisibleCount(
        element.clientWidth >= fullWidth
          ? tools.length
          : Math.max(
              0,
              Math.floor((element.clientWidth - counter) / (size + gap)),
            ),
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [tools.length]);
  const hidden = tools.slice(visibleCount);
  return (
    <ul ref={list} className="stack-study-tools" aria-label={label}>
      {tools.slice(0, visibleCount).map((tool) => (
        <li key={tool} title={tool} data-brand={tool}>
          <Image
            src={`/tech/${technologyLogos[tool]}`}
            alt={tool}
            width={36}
            height={36}
          />
        </li>
      ))}
      {hidden.length > 0 && (
        <li
          className="stack-study-more"
          title={hidden.join(", ")}
          aria-label={`${locale === "ar" ? "تقنيات أخرى" : "More technologies"}: ${hidden.join(", ")}`}
        >
          <bdi dir="ltr">
            +
            {hidden.length.toLocaleString(
              locale === "ar" ? "ar-SA-u-nu-arab" : "en-US",
            )}
          </bdi>
        </li>
      )}
    </ul>
  );
}
