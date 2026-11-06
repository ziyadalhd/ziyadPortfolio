"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getPourFrame } from "@/lib/irtiwa-scroll";
import { bottleInside, bottleOutside } from "@/data/irtiwa-artwork";

import "./irtiwa-showcase.css";

const CUP_INSIDE = "M6 5H26V7H25V13H24V19H23V25H22V27H10V25H9V19H8V13H7V7H6Z";
const CUP_OUTSIDE = "M4 3H28V9H27V15H26V21H25V27H24V29H8V27H7V21H6V15H5V9H4Z";
export function IrtiwaShowcase({
  locale,
  content,
}: {
  locale: Locale;
  content: Dictionary["spec"]["s4"]["irtiwa"];
}) {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current!;
    const stage = scene.querySelector<HTMLElement>(".irtiwa-stage")!;
    const bottle = scene.querySelector<SVGGElement>("[data-pour-bottle]")!;
    const water = scene.querySelector<SVGPathElement>("[data-cup-water]")!;
    const bottleWater = scene.querySelector<SVGRectElement>(
      "[data-bottle-water]",
    )!;
    const stream = scene.querySelector<SVGPathElement>("[data-pour-stream]")!;
    const artwork = scene.querySelector<SVGGElement>("[data-pour-artwork]")!;
    const clip = scene.querySelector<SVGPathElement>("[data-water-clip]")!;
    const phone = scene.querySelector<HTMLElement>(".irtiwa-phone")!;
    const hint = scene.querySelector<HTMLElement>(".irtiwa-scroll-hint")!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let stageTop = 0;
    let travel = 1;
    let visible = true;
    let lastProgress = -1;

    const draw = () => {
      frame = 0;
      const progress = motion.matches
        ? 1
        : Math.max(
            0,
            Math.min(
              1,
              (stageTop - scene.getBoundingClientRect().top) / travel,
            ),
          );
      if (progress === lastProgress) return;
      lastProgress = progress;
      const pose = getPourFrame(progress);
      bottle.setAttribute(
        "transform",
        `translate(${pose.spoutX} ${pose.spoutY}) rotate(${pose.angle}) scale(4.5) translate(-16 -3)`,
      );
      water.setAttribute("d", pose.waterPath);
      water.dataset.level = String(pose.waterY);
      clip.setAttribute("d", pose.waterPath);
      bottleWater.setAttribute("y", String(pose.bottleWaterY));
      stream.setAttribute(
        "d",
        `M${pose.spoutX} ${pose.spoutY} C${pose.spoutX - 5} 210 365 225 365 ${235 + pose.waterY * 7.5}`,
      );
      stream.style.opacity = String(pose.stream);
      artwork.setAttribute("transform", `translate(${pose.reveal * 60} 0)`);
      phone.style.opacity = String(pose.reveal);
      phone.style.transform = motion.matches
        ? "none"
        : `translateY(${(1 - pose.reveal) * 40}px) rotate(-5deg)`;
      hint.style.opacity = String(1 - pose.fill);
      scene.dataset.pourProgress = String(progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const measure = () => {
      stageTop = parseFloat(getComputedStyle(stage).top);
      travel = Math.max(1, scene.offsetHeight - stage.offsetHeight);
      lastProgress = -1;
      schedule();
    };
    const scroll = () => {
      if (visible && !motion.matches) schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "100px" },
    );

    measure();
    observer.observe(scene);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", measure);
    motion.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section
      id="irtiwa"
      className="irtiwa-scroll"
      ref={sceneRef}
      aria-labelledby="irtiwa-title"
    >
      <div className="irtiwa-stage">
        <div className="irtiwa-heading">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 id="irtiwa-title">{content.title}</h2>
          <p>{content.body}</p>
        </div>
        <span className="irtiwa-watermark" aria-hidden="true">
          {content.name}
        </span>
        <div className="irtiwa-art">
          <svg
            viewBox="0 0 640 500"
            role="img"
            aria-label={content.artworkLabel}
          >
            <defs>
              <clipPath id="irtiwa-cup-inside">
                <path d={CUP_INSIDE} />
              </clipPath>
              <clipPath id="irtiwa-bottle-inside">
                <path d={bottleInside} />
              </clipPath>
              <clipPath id="irtiwa-water-fill">
                <path data-water-clip d="M0 27H32V32H0Z" />
              </clipPath>
            </defs>
            <g data-pour-artwork>
              <ellipse
                className="irtiwa-shadow"
                cx="365"
                cy="466"
                rx="98"
                ry="9"
              />
              <ellipse
                className="irtiwa-shadow"
                cx="205"
                cy="302"
                rx="44"
                ry="5"
              />
              <g
                data-pour-bottle
                transform="translate(205 90) scale(4.5) translate(-16 -3)"
                shapeRendering="crispEdges"
              >
                <path d={bottleOutside} className="pixel-outline" />
                <path d={bottleInside} className="pixel-interior" />
                <g clipPath="url(#irtiwa-bottle-inside)">
                  <rect
                    data-bottle-water
                    x="0"
                    y="13"
                    width="32"
                    height="48"
                    className="pixel-water"
                  />
                  <rect
                    x="11.661"
                    y="12.862"
                    width="1.25"
                    height="5"
                    fill="#f0faff"
                  />
                </g>
                {[19.889, 22.655].flatMap((y) =>
                  [9.283, 19.59].map((x) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      width="3.12"
                      height="1.08"
                      className="pixel-depth"
                    />
                  )),
                )}
                <rect
                  x="12.195"
                  y="43.91"
                  width="7.622"
                  height="1.062"
                  className="pixel-depth"
                />
              </g>
              <path
                data-pour-stream
                d="M365 140V420"
                fill="none"
                stroke="#80b8d0"
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0"
              />
              <g
                transform="translate(245 235) scale(7.5)"
                shapeRendering="crispEdges"
              >
                <path d={CUP_OUTSIDE} className="pixel-outline" />
                <path d={CUP_INSIDE} className="pixel-interior" />
                <g clipPath="url(#irtiwa-cup-inside)">
                  <path
                    data-cup-water
                    data-level="27"
                    d="M0 27H32V32H0Z"
                    className="pixel-water"
                  />
                  <g clipPath="url(#irtiwa-water-fill)">
                    <path d="M0 24H32V32H0Z" className="pixel-depth" />
                    <path
                      d="M12 20H14V24H12ZM14 24H16V26H14Z"
                      fill="#dbf4ff"
                      opacity=".42"
                    />
                  </g>
                </g>
                <path
                  d="M8 3H14V4H8ZM8 7H10V13H8ZM10 13H12V15H10Z"
                  fill="#f0faff"
                />
              </g>
            </g>
          </svg>
        </div>
        <figure className="irtiwa-phone">
          <Image
            src={`/projects/irtiwa/02-bottle-${locale}.png`}
            width={1320}
            height={2868}
            alt={content.screenLabel}
            sizes="(max-width: 640px) 125px, 200px"
          />
          <figcaption>{content.screenCaption}</figcaption>
        </figure>
        <div className="irtiwa-scroll-hint" aria-hidden="true">
          <span>↓</span>
          {content.scroll}
        </div>
        <footer className="irtiwa-footer">
          <span>
            <bdi>iOS · SwiftUI</bdi>
          </span>
          <Image
            className="irtiwa-original-mark"
            src="/projects/irtiwa/logo.svg"
            alt={content.name}
            width={32}
            height={32}
          />
        </footer>
      </div>
    </section>
  );
}
