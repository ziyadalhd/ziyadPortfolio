"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { DigitalTwinChat } from "@/components/digital-twin-chat";
import {
  journey,
  personalInfo,
  projects,
  skillCategories,
  type Project,
} from "@/data/portfolio";
import { LOCALES, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

import { RefTag } from "./RefTag";
import { ResumeActions } from "./ResumeActions";

const RAIL_IDS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const;
const THEME_KEY = "ziyad-spec-theme";

const clauseRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "72px minmax(0,1fr)",
  gap: "24px",
};

function useActiveSection() {
  const [active, setActive] = useState<string>("s0");
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          ratios.current.set(e.target.id, e.intersectionRatio),
        );
        let bestId = "";
        let bestRatio = 0;
        ratios.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0 && bestId) setActive(bestId);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: [0, 0.05, 0.1] },
    );
    RAIL_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // On mobile the rail is a horizontally-scrolling strip, so the highlighted
  // link drifts off-screen as "active" advances. Scroll the rail's own box
  // rather than calling scrollIntoView: that walks every scrollable ancestor
  // and *starts* a scroll even when the delta is zero, which cancels the
  // in-flight smooth scroll from clicking a clause link on desktop and
  // leaves the jump stranded halfway.
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>("[data-rail-links]");
    const link = rail?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!rail || !link) return;
    if (rail.scrollWidth <= rail.clientWidth) return;

    const railBox = rail.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const delta =
      linkBox.left + linkBox.width / 2 - (railBox.left + railBox.width / 2);
    rail.scrollTo({ left: rail.scrollLeft + delta, behavior: "smooth" });
  }, [active]);

  return active;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

// No React state: the toggle reads/flips the attribute the beforeInteractive
// script already set, so there is nothing to reconcile between SSR and
// hydration. The button shows both labels and lets CSS pick the visible one
// (see [data-theme] rules below), keyed off the same attribute.
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // Private browsing or storage disabled: theme still applies for this
    // visit, it just will not persist.
  }
}

type CoverPhase = "shut" | "turning" | "done";

const COVER_HOLD_MS = 1150;
const COVER_TURN_MS = 900;

/**
 * The title page turns like the cover of a bound document, then gets out of
 * the way. Three rules keep it an intro rather than a toll gate: it runs for
 * two seconds, any deliberate input skips the rest of it, and the boot script
 * marks it seen so the locale switch and the back button do not replay it.
 */
function useCoverIntro() {
  const [phase, setPhase] = useState<CoverPhase>("shut");

  useEffect(() => {
    // Two ways the cover never shows: the boot script stamped it as already
    // seen this session, or the visitor asked for reduced motion and CSS
    // hides it outright. Either way the scroll lock must not run — locking
    // the page for two seconds behind a cover nobody can see is the version
    // of this that reads as the site being broken.
    if (
      document.documentElement.hasAttribute("data-cover-seen") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    let turned = false;
    let turnTimer = 0;
    const turn = () => {
      if (turned) return;
      turned = true;
      clearTimeout(holdTimer);
      setPhase("turning");
      turnTimer = window.setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
      }, COVER_TURN_MS);
    };

    const holdTimer = window.setTimeout(turn, COVER_HOLD_MS);
    const skips = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    skips.forEach((e) => window.addEventListener(e, turn, { passive: true }));

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(turnTimer);
      skips.forEach((e) => window.removeEventListener(e, turn));
      document.body.style.overflow = "";
    };
  }, []);

  return phase;
}

function ClauseRow({
  n,
  border = true,
  padTop = true,
  children,
}: {
  n: string;
  border?: boolean;
  padTop?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="reveal"
      style={{
        ...clauseRowStyle,
        padding: `${padTop ? "var(--pad)" : "0"} 0`,
        borderBottom: border ? "1px solid var(--hair)" : undefined,
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "12.5px",
          fontWeight: 500,
          letterSpacing: ".02em",
          color: "var(--accent)",
          paddingTop: "6px",
        }}
      >
        {n}
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <>
      <div
        style={{ ...clauseRowStyle, alignItems: "end", paddingBottom: "16px" }}
      >
        <div
          dir="ltr"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "12.5px",
            fontWeight: 500,
            color: "var(--muted)",
            letterSpacing: ".02em",
          }}
        >
          {n}
        </div>
        <h2
          style={{
            fontSize: "clamp(28px,3.4vw,40px)",
            fontWeight: 800,
            letterSpacing: "-.025em",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ height: "2px", background: "var(--rule)" }} />
    </>
  );
}

function RailLink({
  href,
  active,
  index,
  label,
  sub,
}: {
  href: string;
  active: boolean;
  index: number;
  label: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      data-rail-link
      data-active={active || undefined}
      aria-current={active ? "true" : undefined}
      style={{
        display: "grid",
        gridTemplateColumns: "20px minmax(0,1fr)",
        columnGap: "10px",
        alignItems: "baseline",
        fontFamily: "var(--mono)",
        fontSize: "12.5px",
        padding: "7px 0",
        paddingInlineStart: "11px",
      }}
    >
      <span data-rail-n>{index}</span>
      <span
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <span data-rail-label>{label}</span>
        <span data-rail-leader aria-hidden="true" />
      </span>
      <span data-rail-sub style={{ gridColumn: 2 }}>
        {sub}
      </span>
    </a>
  );
}

// Filled = it is out there being used; outlined = actively moving; plain
// rule = personal scope. Reads as a status at a glance without a legend.
const pillStyle = (status: Project["status"]): CSSProperties => {
  const base: CSSProperties = { padding: "4px 9px", fontWeight: 600 };
  if (status === "liveEvent")
    return { ...base, background: "var(--accent)", color: "var(--bg)" };
  if (status === "activeDevelopment" || status === "graduation")
    return {
      ...base,
      border: "1px solid var(--accent)",
      color: "var(--accent)",
    };
  return { padding: "4px 9px", border: "1px solid var(--rule)" };
};

function SlashList({ items }: { items: string[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 10px",
        fontSize: "15.5px",
        color: "var(--muted)",
        fontFamily: "var(--mono)",
      }}
    >
      {items.map((item, i) => (
        <span key={item} style={{ display: "flex", gap: "8px" }}>
          {i > 0 && <span style={{ color: "var(--accent)" }}>/</span>}
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
}

export function SpecPage({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const s = dict.spec;
  const otherLocale = LOCALES.find((l) => l !== locale) ?? locale;
  const active = useActiveSection();
  const progress = useScrollProgress();
  const coverPhase = useCoverIntro();

  const rail = [
    { id: "s0", ...s.rail.s0 },
    { id: "s1", ...s.rail.s1 },
    { id: "s2", ...s.rail.s2 },
    { id: "s3", ...s.rail.s3 },
    { id: "s4", ...s.rail.s4 },
    { id: "s5", ...s.rail.s5 },
    { id: "s6", ...s.rail.s6 },
    { id: "s7", ...s.rail.s7 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <a href="#s0" className="skip-link">
        {dict.skipToContent}
      </a>

      <div
        data-shell
        style={{
          display: "grid",
          gridTemplateColumns: "232px minmax(0,1fr)",
          gap: "48px",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        <nav
          data-rail
          aria-label={s.railHeading}
          style={
            {
              position: "sticky",
              top: 0,
              alignSelf: "start",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              padding: "46px 0 40px",
              borderInlineEnd: "1px solid var(--hair)",
              "--progress": `${progress}%`,
            } as CSSProperties
          }
        >
          <div
            data-rail-head
            style={{
              fontSize: "11px",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontFamily: "var(--mono)",
              color: "var(--muted)",
              marginBottom: "18px",
            }}
          >
            {s.railHeading}
          </div>
          <div
            data-rail-links
            style={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            {rail.map((item, i) => (
              <RailLink
                key={item.id}
                href={`#${item.id}`}
                active={active === item.id}
                index={i}
                label={item.label}
                sub={item.sub}
              />
            ))}
          </div>
          <div
            data-rail-controls
            style={{
              marginTop: "auto",
              display: "flex",
              gap: "8px",
              paddingTop: "22px",
              borderTop: "1px solid var(--hair)",
            }}
          >
            <a
              href={`/${otherLocale}`}
              hrefLang={otherLocale}
              aria-label={dict.localeSwitch.aria}
              style={{
                fontFamily: "var(--mono)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: ".05em",
                padding: "7px 10px",
                border: "1px solid var(--rule)",
                color: "var(--ink)",
              }}
            >
              {dict.localeSwitch.label}
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                fontFamily: "var(--mono)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: ".05em",
                padding: "7px 10px",
                background: "transparent",
                color: "var(--ink)",
                border: "1px solid var(--rule)",
                cursor: "pointer",
                minHeight: 0,
              }}
            >
              <span className="theme-label-light">{s.theme.switchToDark}</span>
              <span className="theme-label-dark">{s.theme.switchToLight}</span>
            </button>
          </div>
        </nav>

        <main
          id="main-content"
          style={{
            paddingBottom: "calc(120px + env(safe-area-inset-bottom, 0px))",
            minWidth: 0,
          }}
        >
          <header id="s0" style={{ padding: "64px 0 0" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "baseline",
                fontSize: "11.5px",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontFamily: "var(--mono)",
                color: "var(--muted)",
              }}
            >
              <span
                dir="ltr"
                style={{ color: "var(--accent)", fontWeight: 600 }}
              >
                SPEC-2026 / REV 4.0
              </span>
              <span>{s.eyebrowSpec}</span>
              <span>{s.eyebrowControlled}</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(44px,8.2vw,104px)",
                fontWeight: 800,
                lineHeight: 0.96,
                letterSpacing: "-.035em",
                margin: "26px 0 0",
                textWrap: "balance",
              }}
            >
              {s.hero.name}
            </h1>
            <p
              style={{
                fontSize: "clamp(19px,2.2vw,26px)",
                lineHeight: 1.35,
                fontWeight: 500,
                color: "var(--muted)",
                margin: "18px 0 0",
                maxWidth: "34ch",
              }}
            >
              {s.hero.subtitle}
            </p>

            <div
              style={{
                height: "2px",
                background: "var(--rule)",
                margin: "44px 0 0",
              }}
            />
            <div
              data-mast
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,minmax(0,1fr))",
              }}
            >
              {[
                {
                  label: s.hero.mast.statusLabel,
                  value: s.hero.mast.statusValue,
                  accent: true,
                },
                {
                  label: s.hero.mast.gpaLabel,
                  value: personalInfo.gpa,
                  ltr: true,
                },
                {
                  label: s.hero.mast.graduationLabel,
                  value: personalInfo.expectedGraduation,
                },
                {
                  label: s.hero.mast.volunteerLabel,
                  value: personalInfo.volunteerHours,
                  ltr: true,
                },
                {
                  label: s.hero.mast.effectiveLabel,
                  value: s.hero.mast.effectiveValue,
                },
              ].map((cell, i) => (
                <div
                  key={cell.label}
                  style={{
                    padding: "18px",
                    paddingInlineStart: i === 0 ? 0 : undefined,
                    borderInlineStart:
                      i === 0 ? undefined : "1px solid var(--hair)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      fontFamily: "var(--mono)",
                      color: "var(--muted)",
                    }}
                  >
                    {cell.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "14.5px",
                      fontWeight: 500,
                      marginTop: "8px",
                      color: cell.accent ? "var(--accent)" : undefined,
                    }}
                  >
                    {cell.ltr ? (
                      <span dir="ltr">{cell.value}</span>
                    ) : (
                      cell.value
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: "2px", background: "var(--rule)" }} />

            <ClauseRow n="0.1" border={false}>
              <p
                style={{
                  fontSize: "clamp(18px,1.9vw,21px)",
                  lineHeight: 1.62,
                  margin: 0,
                  maxWidth: "60ch",
                }}
              >
                {s.hero.intro1}
              </p>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 1.65,
                  margin: "16px 0 0",
                  maxWidth: "60ch",
                  color: "var(--muted)",
                }}
              >
                {s.hero.intro2Pre}
                <RefTag
                  id="4.1"
                  title={projects[0].title[locale]}
                  body={projects[0].summary[locale]}
                />
                {s.hero.intro2Post}
              </p>
            </ClauseRow>
          </header>

          <section id="s1" style={{ paddingTop: "104px" }}>
            <SectionHead n="§1" title={s.s1.heading} />

            <ClauseRow n="1.1">
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-.015em",
                  margin: "0 0 10px",
                }}
              >
                {s.s1.purposeTitle}
              </h3>
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: "62ch",
                }}
              >
                {s.s1.purposeBody}
              </p>
            </ClauseRow>

            <ClauseRow n="1.2">
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-.015em",
                  margin: "0 0 10px",
                }}
              >
                {s.s1.growthTitle}
              </h3>
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: 1.65,
                  margin: "0 0 20px",
                  maxWidth: "62ch",
                }}
              >
                {s.s1.growthIntro}
              </p>
              <ol
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "64ch",
                }}
              >
                {s.s1.growthItems.map((item, i) => (
                  <li
                    key={item.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "34px minmax(0,1fr)",
                      gap: "16px",
                      padding: "16px 0",
                      borderTop: "1px solid var(--hair)",
                      borderBottom:
                        i === s.s1.growthItems.length - 1
                          ? "1px solid var(--hair)"
                          : undefined,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--accent)",
                        paddingTop: "4px",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span>
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--display)",
                          fontSize: "16px",
                          fontWeight: 800,
                          letterSpacing: "-.01em",
                          marginBottom: "6px",
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "16px",
                          lineHeight: 1.6,
                          color: "var(--muted)",
                        }}
                      >
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </ClauseRow>

            <ClauseRow n="1.3">
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-.015em",
                  margin: "0 0 14px",
                }}
              >
                {s.s1.definitionsTitle}
              </h3>
              <dl
                style={{
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: "20px 32px",
                  maxWidth: "66ch",
                }}
              >
                {s.s1.definitions.map((d) => (
                  <div key={d.term}>
                    <dt
                      style={{
                        fontSize: "11px",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        fontFamily: "var(--mono)",
                        color: "var(--accent)",
                      }}
                    >
                      {d.term}
                    </dt>
                    <dd
                      style={{
                        margin: "6px 0 0",
                        fontSize: "15.5px",
                        lineHeight: 1.55,
                        color: "var(--muted)",
                      }}
                    >
                      {d.def}
                    </dd>
                  </div>
                ))}
              </dl>
            </ClauseRow>
          </section>

          <section id="s2" style={{ paddingTop: "104px" }}>
            <SectionHead n="§2" title={s.s2.heading} />
            {journey.map((item, i) => {
              const period = item.period[locale];
              const referenced = item.refClause
                ? projects.find(
                    (p) => `4.${projects.indexOf(p) + 1}` === item.refClause,
                  )
                : undefined;

              return (
                <ClauseRow key={item.title[locale]} n={`2.${i + 1}`}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "8px 14px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      // A period that is pure ASCII ("2023 - 2027") has no
                      // strong direction of its own, so RTL would flip it.
                      dir={/^[\x20-\x7E]+$/.test(period) ? "ltr" : undefined}
                      style={{
                        fontSize: "11.5px",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        fontFamily: "var(--mono)",
                        color: "var(--muted)",
                      }}
                    >
                      {period}
                    </span>
                    {item.tag && (
                      <span
                        style={{
                          fontSize: "10.5px",
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                          fontFamily: "var(--mono)",
                          fontWeight: 600,
                          padding: "3px 8px",
                          border: "1px solid var(--accent)",
                          color: "var(--accent)",
                        }}
                      >
                        {item.tag[locale]}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      letterSpacing: "-.015em",
                      margin: "0 0 10px",
                    }}
                  >
                    {item.title[locale]}
                  </h3>
                  <p
                    style={{
                      fontSize: "16.5px",
                      lineHeight: 1.65,
                      margin: 0,
                      maxWidth: "62ch",
                      color: "var(--muted)",
                    }}
                  >
                    {item.detail[locale]}
                    {referenced && item.refClause && (
                      <>
                        {" "}
                        {s.s2.seeFullPre}
                        <RefTag
                          id={item.refClause}
                          title={referenced.title[locale]}
                          body={referenced.summary[locale]}
                        />
                        .
                      </>
                    )}
                  </p>
                </ClauseRow>
              );
            })}
          </section>

          <section id="s3" style={{ paddingTop: "104px" }}>
            <SectionHead n="§3" title={s.s3.heading} />
            <div
              className="reveal"
              style={{ ...clauseRowStyle, padding: "var(--pad) 0 8px" }}
            >
              <div />
              <p
                style={{
                  fontSize: "16.5px",
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: "62ch",
                  color: "var(--muted)",
                }}
              >
                {s.s3.introPre}
                <RefTag
                  id="4.1"
                  title={projects[0].title[locale]}
                  body={projects[0].summary[locale]}
                />
                .
              </p>
            </div>
            {skillCategories.map((cat, i) => (
              <ClauseRow
                key={cat.key}
                n={`3.${i + 1}`}
                padTop={false}
                border={i < skillCategories.length - 1}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,150px) minmax(0,1fr)",
                    gap: "20px",
                    alignItems: "start",
                    padding: "22px 0",
                  }}
                >
                  <h3 style={{ fontSize: "17px", fontWeight: 800, margin: 0 }}>
                    {s.s3.categories[cat.key]}
                  </h3>
                  <SlashList items={cat.techs} />
                </div>
              </ClauseRow>
            ))}
          </section>

          <section id="s4" style={{ paddingTop: "104px" }}>
            <SectionHead n="§4" title={s.s4.heading} />
            {projects.map((project, i) => (
              <ClauseRow key={project.slug} n={`R-4.${i + 1}`}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 16px",
                    alignItems: "center",
                    fontSize: "11.5px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontFamily: "var(--mono)",
                    color: "var(--muted)",
                    marginBottom: "12px",
                  }}
                >
                  <span>{project.kind[locale]}</span>
                  <span dir="ltr" style={{ color: "var(--accent)" }}>
                    {project.period[locale]}
                  </span>
                  <span style={pillStyle(project.status)}>
                    {s.s4.statusLabels[project.status]}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "clamp(23px,2.6vw,30px)",
                    fontWeight: 800,
                    letterSpacing: "-.02em",
                    lineHeight: 1.15,
                    margin: "0 0 14px",
                    maxWidth: "26ch",
                  }}
                >
                  {project.title[locale]}
                </h3>
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.65,
                    margin: "0 0 26px",
                    maxWidth: "62ch",
                  }}
                >
                  {project.summary[locale]}
                </p>

                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontFamily: "var(--mono)",
                    color: "var(--muted)",
                    marginBottom: "12px",
                  }}
                >
                  {s.s4.acceptanceCriteria}
                </div>
                <ol
                  style={{
                    listStyle: "none",
                    margin: "0 0 26px",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "66ch",
                  }}
                >
                  {project.highlights[locale].map((h, hi) => (
                    <li
                      key={h}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "56px minmax(0,1fr)",
                        gap: "16px",
                        padding: "13px 0",
                        borderTop: "1px solid var(--hair)",
                        borderBottom:
                          hi === project.highlights[locale].length - 1
                            ? "1px solid var(--hair)"
                            : undefined,
                        fontSize: "16px",
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          color: "var(--accent)",
                          fontWeight: 500,
                          fontSize: "12px",
                          paddingTop: "4px",
                        }}
                      >
                        AC-{hi + 1}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>

                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontFamily: "var(--mono)",
                    color: "var(--muted)",
                    marginBottom: "10px",
                  }}
                >
                  {s.s4.dependencies}
                </div>
                <SlashList items={project.stack} />
              </ClauseRow>
            ))}
          </section>

          <section id="s5" style={{ paddingTop: "104px" }}>
            <SectionHead n="§5" title={s.s5.heading} />

            <ClauseRow n="5.1">
              <h3
                style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px" }}
              >
                {s.s5.evidenceTitle}
              </h3>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 1.6,
                  margin: "0 0 22px",
                  maxWidth: "60ch",
                  color: "var(--muted)",
                }}
              >
                {s.s5.evidenceIntro}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr)",
                  minWidth: 0,
                }}
              >
                {[s.s5.tableItem, s.s5.tableValue, s.s5.tableMethod].map(
                  (h, i) => (
                    <div
                      key={h}
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        fontFamily: "var(--mono)",
                        color: "var(--muted)",
                        padding:
                          i === 0
                            ? "0 12px 10px 0"
                            : i === 2
                              ? "0 0 10px 12px"
                              : "0 12px 10px",
                      }}
                    >
                      {h}
                    </div>
                  ),
                )}
                {[
                  {
                    label: s.hero.mast.gpaLabel,
                    value: <span dir="ltr">{personalInfo.gpa}</span>,
                    method: s.s5.rowGpaMethod,
                  },
                  {
                    label: s.s5.rowGraduationLabel,
                    value: personalInfo.expectedGraduation,
                    method: s.s5.rowGraduationMethod,
                  },
                  {
                    label: s.hero.mast.volunteerLabel,
                    value: <span dir="ltr">{personalInfo.volunteerHours}</span>,
                    method: s.s5.rowVolunteerMethod,
                  },
                  {
                    label: s.s5.rowLocationLabel,
                    value: personalInfo.location[locale],
                    method: s.s5.rowLocationMethod,
                  },
                ].map((row, i, arr) => (
                  <Fragment key={row.label}>
                    <div
                      style={{
                        borderTop:
                          i === 0
                            ? "2px solid var(--rule)"
                            : "1px solid var(--hair)",
                        borderBottom:
                          i === arr.length - 1
                            ? "1px solid var(--hair)"
                            : undefined,
                        padding: "14px 12px 14px 0",
                        fontSize: "15.5px",
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        borderTop:
                          i === 0
                            ? "2px solid var(--rule)"
                            : "1px solid var(--hair)",
                        borderBottom:
                          i === arr.length - 1
                            ? "1px solid var(--hair)"
                            : undefined,
                        padding: "14px 12px",
                        fontFamily: "var(--mono)",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {row.value}
                    </div>
                    <div
                      style={{
                        borderTop:
                          i === 0
                            ? "2px solid var(--rule)"
                            : "1px solid var(--hair)",
                        borderBottom:
                          i === arr.length - 1
                            ? "1px solid var(--hair)"
                            : undefined,
                        padding: "14px 0 14px 12px",
                        fontSize: "15.5px",
                        color: "var(--muted)",
                      }}
                    >
                      {row.method}
                    </div>
                  </Fragment>
                ))}
              </div>
            </ClauseRow>

            <ClauseRow n="5.2">
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  margin: "0 0 10px",
                }}
              >
                {s.s5.annexTitle}
              </h3>
              <p
                style={{
                  fontSize: "16.5px",
                  lineHeight: 1.65,
                  margin: "0 0 18px",
                  maxWidth: "60ch",
                  color: "var(--muted)",
                }}
              >
                {s.s5.annexBody}
              </p>
              <ResumeActions content={s.s5} />
            </ClauseRow>
          </section>

          <section id="s6" style={{ paddingTop: "104px" }}>
            <SectionHead n="§6" title={s.s6.heading} />
            <ClauseRow n="6.1" border={false}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  margin: "0 0 10px",
                }}
              >
                {s.s6.title}
              </h3>
              <p
                style={{
                  fontSize: "16.5px",
                  lineHeight: 1.65,
                  margin: "0 0 24px",
                  maxWidth: "60ch",
                  color: "var(--muted)",
                }}
              >
                {s.s6.intro}
              </p>
              <div style={{ border: "1px solid var(--rule)", minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "7px",
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--hair)",
                    fontSize: "10.5px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontFamily: "var(--mono)",
                    color: "var(--accent)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "var(--accent)",
                      animation: "caret 1.6s steps(1) infinite",
                    }}
                  />
                  <span>{dict.twin.liveBadge}</span>
                </div>
                <DigitalTwinChat content={dict.twin} locale={locale} />
              </div>
            </ClauseRow>
          </section>

          <section id="s7" style={{ paddingTop: "104px" }}>
            <SectionHead n="§7" title={s.s7.heading} />
            <ClauseRow n="7.1" border={false} padTop={true}>
              <h3
                style={{
                  fontSize: "clamp(24px,3vw,34px)",
                  fontWeight: 800,
                  letterSpacing: "-.02em",
                  margin: "0 0 12px",
                  maxWidth: "24ch",
                }}
              >
                {s.s7.headline}
              </h3>
              <p
                style={{
                  fontSize: "16.5px",
                  lineHeight: 1.65,
                  margin: "0 0 30px",
                  maxWidth: "58ch",
                  color: "var(--muted)",
                }}
              >
                {s.s7.subtext}
              </p>
              <div
                data-contact
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                  borderTop: "2px solid var(--rule)",
                }}
              >
                {[
                  {
                    label: s.s7.emailLabel,
                    value: personalInfo.email,
                    href: `mailto:${personalInfo.email}`,
                  },
                  {
                    label: s.s7.phoneLabel,
                    value: personalInfo.phone,
                    href: personalInfo.phoneHref,
                    ltr: true,
                  },
                  {
                    label: "LinkedIn",
                    value: personalInfo.linkedinDisplay,
                    href: personalInfo.linkedin,
                    external: true,
                  },
                  {
                    label: "GitHub",
                    value: personalInfo.githubDisplay,
                    href: personalInfo.github,
                    external: true,
                  },
                ].map((tile, i) => (
                  <a
                    key={tile.label}
                    href={tile.href}
                    target={tile.external ? "_blank" : undefined}
                    rel={tile.external ? "noreferrer" : undefined}
                    style={{
                      display: "block",
                      padding: "20px",
                      // Two columns: every other tile opens a row, so it
                      // sheds the divider and the leading indent.
                      paddingInlineStart: i % 2 === 0 ? 0 : "20px",
                      borderBottom: "1px solid var(--hair)",
                      borderInlineStart:
                        i % 2 === 0 ? undefined : "1px solid var(--hair)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        fontFamily: "var(--mono)",
                        color: "var(--muted)",
                      }}
                    >
                      {tile.label}
                    </div>
                    <div
                      dir={tile.ltr ? "ltr" : undefined}
                      style={{
                        fontSize: "17px",
                        fontWeight: 600,
                        marginTop: "7px",
                        unicodeBidi: tile.ltr ? "isolate" : undefined,
                      }}
                    >
                      {tile.value}
                    </div>
                  </a>
                ))}
              </div>
            </ClauseRow>
          </section>

          <footer
            className="reveal"
            style={{
              marginTop: "104px",
              paddingTop: "26px",
              borderTop: "2px solid var(--rule)",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px 40px",
              justifyContent: "space-between",
              fontSize: "11.5px",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontFamily: "var(--mono)",
              color: "var(--muted)",
            }}
          >
            <span>{s.footer.end}</span>
            <span>{s.footer.prepared}</span>
            <a href="#s0" style={{ color: "var(--accent)" }}>
              {s.footer.backTo0}
            </a>
          </footer>
        </main>
      </div>

      {coverPhase !== "done" && (
        <div
          data-cover
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "18px",
            // The sheet turns on its binding edge, so it needs depth from
            // a parent. The desk goes first and the sheet last: the page is
            // then seen turning over the live document, instead of both
            // dissolving together and leaving a beat of empty screen.
            perspective: "2400px",
            background:
              coverPhase === "turning" ? "transparent" : "var(--desk)",
            transition: `background-color ${COVER_TURN_MS * 0.38}ms ease ${COVER_TURN_MS * 0.09}ms`,
            pointerEvents: coverPhase === "turning" ? "none" : "auto",
          }}
        >
          <div
            data-cover-sheet
            style={{
              background:
                "linear-gradient(to var(--spine-far), rgba(0,0,0,.17), rgba(0,0,0,0) 9%) var(--paper)",
              color: "var(--paperink)",
              height: "min(86vh,1000px)",
              aspectRatio: "1 / 1.4142",
              maxWidth: "calc(100vw - 36px)",
              boxSizing: "border-box",
              padding: "4.6em 4.6em 3em",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              fontFamily: "var(--latex)",
              fontSize: "clamp(9px,min(1.5vh,3.1vw),16px)",
              lineHeight: 1.45,
              border: "1px solid var(--paperedge)",
              boxShadow: "0 18px 52px rgba(0,0,0,.34)",
              transformOrigin: "var(--spine) center",
              backfaceVisibility: "hidden",
              transform:
                coverPhase === "turning"
                  ? "rotateY(var(--turn))"
                  : "rotateY(0deg)",
              opacity: coverPhase === "turning" ? 0 : 1,
              transition: `transform ${COVER_TURN_MS}ms cubic-bezier(.62,.03,.32,1), opacity ${COVER_TURN_MS * 0.38}ms ease ${COVER_TURN_MS * 0.62}ms`,
              animation:
                coverPhase === "turning"
                  ? "none"
                  : "coverin .6s cubic-bezier(.2,.7,.2,1) both",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: ".82em",
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "var(--papermute)",
              }}
            >
              {s.cover.kicker}
            </div>

            <div style={{ margin: "auto 0" }}>
              <div style={{ height: "1px", background: "var(--paperrule)" }} />
              <h1
                style={{
                  fontFamily: "var(--latex)",
                  fontWeight: 500,
                  fontSize: "2.85em",
                  lineHeight: 1.12,
                  letterSpacing: "-.006em",
                  margin: ".55em 0 .26em",
                  textWrap: "balance",
                }}
              >
                {s.cover.title}
              </h1>
              <div
                style={{
                  fontSize: "1.4em",
                  fontStyle: "italic",
                  lineHeight: 1.28,
                  margin: "0 0 .7em",
                }}
              >
                {s.cover.subtitle}
              </div>
              <div style={{ height: "1px", background: "var(--paperrule)" }} />

              <div
                style={{
                  marginTop: "1.7em",
                  fontSize: "1.28em",
                  lineHeight: 1.5,
                }}
              >
                <div>{s.hero.name}</div>
                <div style={{ fontSize: ".82em", color: "var(--papermute)" }}>
                  {s.cover.dept}
                </div>
                <div style={{ fontSize: ".82em", color: "var(--papermute)" }}>
                  {s.cover.location}
                </div>
              </div>

              <div style={{ marginTop: "1.25em", fontSize: "1.08em" }}>
                {s.cover.month}
              </div>

              <p
                style={{
                  maxWidth: "44ch",
                  margin: "1.8em auto 0",
                  fontSize: "1em",
                  lineHeight: 1.55,
                  color: "var(--papermute)",
                  fontStyle: "italic",
                }}
              >
                {s.cover.blurb}
              </p>
            </div>

            <div>
              <div
                style={{ height: "1.4px", background: "var(--paperrule)" }}
              />
              <div
                data-cover-meta
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                  gap: ".6em",
                  fontFamily: "var(--mono)",
                  fontSize: ".74em",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--papermute)",
                  padding: ".6em 0",
                  whiteSpace: "nowrap",
                }}
              >
                <div>{s.cover.colId}</div>
                <div>{s.cover.colDate}</div>
                <div>{s.cover.colVersion}</div>
                <div>{s.cover.colStatus}</div>
              </div>
              <div
                style={{
                  height: ".6px",
                  background: "var(--paperrule)",
                  opacity: 0.6,
                }}
              />
              <div
                data-cover-meta
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                  gap: ".6em",
                  fontFamily: "var(--mono)",
                  fontSize: ".86em",
                  padding: ".6em 0",
                  whiteSpace: "nowrap",
                }}
              >
                <div dir="ltr">SPEC-2026-ZJA</div>
                <div dir="ltr">2026-09-17</div>
                <div dir="ltr">Rev 4.0</div>
                <div>{s.cover.statusValue}</div>
              </div>
              <div
                style={{ height: "1.4px", background: "var(--paperrule)" }}
              />
              <div
                style={{
                  marginTop: "1.2em",
                  fontFamily: "var(--mono)",
                  fontSize: ".78em",
                  color: "var(--papermute)",
                }}
              >
                1
              </div>
            </div>
          </div>

          <div
            data-cover-hint
            style={{
              opacity: coverPhase === "turning" ? 0 : 1,
              transition: "opacity .3s ease",
            }}
          >
            {s.cover.hint}
          </div>
        </div>
      )}
    </div>
  );
}
