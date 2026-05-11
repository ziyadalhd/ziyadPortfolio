import { DigitalTwinChat } from "@/components/digital-twin-chat";

const journey = [
  {
    period: "2023 - 2027",
    title: "B.S. Software Engineering - Umm Al-Qura University",
    detail:
      "Building a strong foundation in software architecture, data structures, requirements engineering, UML modeling, and testing. Current GPA: 3.73/4.00.",
  },
  {
    period: "2024 - Present",
    title: "Community Volunteer - National Volunteering Platform",
    detail:
      "Completed 262+ verified hours supporting digital outreach and community initiatives aligned with Saudi Vision 2030.",
  },
  {
    period: "2025 - Present",
    title: "WASL Graduation Project - Mobile + Backend Platform",
    detail:
      "Contributed to an integrated transportation and accommodation platform with Flutter frontend, Spring Boot APIs, booking flows, ratings, and admin operations.",
  },
  {
    period: "2026",
    title: "Independent iOS Build in Swift",
    detail:
      "Delivered a full personal iOS app from scratch using AI-assisted rapid prototyping and local data storage.",
  },
];

const portfolioRoadmap = [
  {
    title: "Case Study: WASL Platform",
    description:
      "Full architecture walkthrough, product decisions, UI system, and engineering tradeoffs.",
    link: "#",
  },
  {
    title: "Case Study: Swift iOS Project",
    description:
      "How I learned Swift quickly and turned requirements into a working application.",
    link: "#",
  },
  {
    title: "Mobile Engineering Playbook",
    description:
      "My reusable development standards for clean architecture, API integration, and testing.",
    link: "#",
  },
];

const skillGroups = [
  "Flutter, Dart, Swift, Java",
  "Spring Boot, REST APIs, Firebase",
  "PostgreSQL, SQL, Git, GitHub",
  "OOP, SDLC, Agile (Scrum), System Design",
];

const valuePillars = [
  "Clean architecture in mobile apps",
  "Fast prototyping with AI-assisted workflows",
  "Reliable API integration and system thinking",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="grid-pattern absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-16 pt-10 md:px-10">
        <header className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
              Software Engineering | Mobile Application Engineer
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
              Ziyad Jaber Alhdriti
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#journey" className="nav-link">
              Journey
            </a>
            <a href="#portfolio" className="nav-link">
              Portfolio
            </a>
            <a href="#digital-twin" className="nav-link">
              Digital Twin
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
              Enterprise meets edgy
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
              Building resilient software with{" "}
              <span className="hero-gradient">startup-level speed</span>.
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              I design and build cross-platform mobile products with structured
              engineering discipline, clean architecture, and polished user
              experience. My focus is turning complex requirements into systems
              people can trust and teams can scale.
            </p>
            <ul className="flex flex-wrap gap-3 text-sm text-slate-200">
              {valuePillars.map((pillar) => (
                <li
                  key={pillar}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2"
                >
                  {pillar}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.linkedin.com/in/ziyad-alhdriti"
                target="_blank"
                rel="noreferrer"
                className="button-primary"
              >
                View LinkedIn
              </a>
              <a
                href="https://github.com/ziyadalhd"
                target="_blank"
                rel="noreferrer"
                className="button-secondary"
              >
                Explore GitHub
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl shadow-cyan-700/10">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Snapshot
            </p>
            <div className="mt-6 space-y-5">
              <Metric label="Expected Graduation" value="2027" />
              <Metric label="GPA" value="3.73 / 4.00" />
              <Metric label="Verified Volunteer Hours" value="262+" />
              <Metric label="Location" value="Makkah, Saudi Arabia" />
            </div>
            <p className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              Open to mobile engineering opportunities and high-growth teams.
            </p>
          </aside>
        </section>

        <section id="about" className="section-card">
          <SectionHeading
            eyebrow="About Me"
            title="Structured engineer. Product mindset. Execution-focused."
          />
          <p className="max-w-4xl text-lg leading-relaxed text-slate-300">
            I am a Software Engineering student with strong interest in mobile
            development and full-stack systems. I enjoy operating at the
            intersection of architecture and user impact: defining requirements,
            shaping system design, implementing production-ready features, and
            validating quality with a disciplined workflow.
          </p>
        </section>

        <section id="journey" className="section-card">
          <SectionHeading
            eyebrow="Career Journey"
            title="Milestones that shaped my engineering approach"
          />
          <div className="timeline mt-8 space-y-6">
            {journey.map((item) => (
              <article
                key={item.title}
                className="relative rounded-2xl border border-white/10 bg-[#0d1322] p-5 transition hover:border-cyan-300/35"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                  {item.period}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-300">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="section-card">
            <SectionHeading
              eyebrow="Technical Focus"
              title="Core engineering stack"
            />
            <ul className="mt-8 space-y-4">
              {skillGroups.map((group) => (
                <li
                  key={group}
                  className="rounded-xl border border-white/10 bg-[#0d1322] px-4 py-3 text-slate-200"
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>

          <div className="section-card">
            <SectionHeading
              eyebrow="Current Objective"
              title="Building high-value mobile products"
            />
            <p className="mt-8 leading-relaxed text-slate-300">
              I am open to roles where I can contribute to mobile product
              engineering, collaborate across backend and design, and continue
              delivering scalable features with speed and quality. I am
              particularly interested in teams that value ownership,
              mentorship, and measurable product outcomes.
            </p>
          </div>
        </section>

        <section id="portfolio" className="section-card">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected work and case studies (expanding soon)"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {portfolioRoadmap.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-[#0d1322] p-5 transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  className="mt-4 inline-block text-sm font-medium text-cyan-200 transition group-hover:text-cyan-100"
                >
                  Coming soon -&gt;
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="digital-twin" className="section-card">
          <SectionHeading
            eyebrow="AI Experience"
            title="Ask my Digital Twin"
          />
          <p className="mt-4 max-w-3xl text-slate-300">
            This assistant is trained on my career background and project
            history. It can answer questions about my skills, journey, and
            professional direction in real time.
          </p>
          <div className="mt-8">
            <DigitalTwinChat />
          </div>
        </section>

        <section id="contact" className="section-card">
          <SectionHeading
            eyebrow="Contact"
            title="Let us build something meaningful"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:ziyadalhdriti@gmail.com"
              className="contact-tile"
            >
              ziyadalhdriti@gmail.com
            </a>
            <a href="tel:+966569264771" className="contact-tile">
              +966 56 926 4771
            </a>
          </div>
        </section>

        <footer className="pb-2 text-center text-xs uppercase tracking-[0.22em] text-slate-500">
          Ziyad Alhdriti - Engineered with precision
        </footer>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1322] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
