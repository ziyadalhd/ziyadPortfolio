export const en = {
  meta: {
    title: "Ziyad Jaber Alhdriti | Software Engineer",
    description:
      "Portfolio of Ziyad Jaber Alhdriti, Software Engineering student and full-stack and mobile application engineer in Makkah, Saudi Arabia.",
    ogDescription:
      "Full-stack and mobile engineering portfolio, written as a specification document.",
  },

  localeSwitch: {
    label: "العربية",
    aria: "التبديل إلى العربية",
  },

  skipToContent: "Skip to content",

  twin: {
    liveBadge: "Live",
    panelTitle: "Digital Twin Chat",
    panelSubtitle: "Ask about projects, skills, education, and career journey.",
    seedGreeting:
      "Hi, I am Ziyad's Digital Twin. Feel free to ask about my background, projects, skills, and career direction.",
    starterPrompts: [
      "What are Ziyad's strongest technical skills?",
      "Tell me about the Bayn Cultural Club platform.",
      "What type of opportunities is he looking for?",
    ],
    inputLabel: "Ask about Ziyad's career",
    placeholder:
      "Ask about experience, skills, projects, education, or goals...",
    send: "Send message",
    sending: "Sending…",
    reset: "Reset chat",
    thinking: "Digital Twin is thinking...",
    stillWorking: "Still working — the AI service may be experiencing delays.",
    retry: "Retry",
    roles: {
      user: "You",
      assistant: "Digital Twin",
    },
  },

  notFound: {
    eyebrow: "404",
    title: "This page does not exist.",
    body: "The link may be outdated, or the page may have moved.",
    cta: "Back to the portfolio",
  },

  error: {
    eyebrow: "Something went wrong",
    title: "The portfolio could not load.",
    body: "Please retry. If the issue continues, contact Ziyad directly.",
    cta: "Try again",
    errorIdLabel: "Error ID",
  },

  spec: {
    eyebrowSpec: "Personal specification",
    eyebrowControlled: "Controlled copy",
    theme: { switchToDark: "DARK", switchToLight: "LIGHT" },
    railHeading: "Clause index",
    rail: {
      s0: { label: "Preface", sub: "(Introduction)" },
      s1: { label: "Scope", sub: "(Approach & Status)" },
      s2: { label: "Context", sub: "(Experience & Journey)" },
      s3: { label: "Interfaces", sub: "(Skills & Tech Stack)" },
      s4: { label: "Requirements", sub: "(Projects)" },
      s5: { label: "Verification", sub: "(Record & Résumé)" },
      s6: { label: "Conformance demo", sub: "(Live Demo)" },
      s7: { label: "Change requests", sub: "(Contact & Socials)" },
    },
    hero: {
      name: "Ziyad Jaber Alhdriti",
      subtitle:
        "Software Engineering student, full-stack and mobile application engineer. Makkah, Saudi Arabia.",
      mast: {
        statusLabel: "Status",
        statusValue: "Open to work",
        gpaLabel: "GPA",
        graduationLabel: "Graduation",
        volunteerLabel: "Volunteer hours",
        effectiveLabel: "Effective",
        effectiveValue: "Sept 2026",
      },
      intro1:
        "My name is Ziyad. I study software engineering in Makkah, and most of my day goes into turning vague requirements into things that actually run. So instead of another page telling you I am passionate about technology, I wrote myself the way I write a system: numbered clauses, a stated scope, and acceptance criteria you can check.",
      intro2Pre:
        "Every part of this document has a clause number. Hover any reference like ",
      intro2Post:
        " and it opens right where you are, so you never lose your place.",
    },
    s1: {
      heading: "Scope",
      purposeTitle: "Purpose",
      purposeBody:
        "I am a Software Engineering student who builds full-stack products end to end — web platforms on Next.js and Supabase, mobile apps in Flutter and Swift. I work where architecture meets user impact: defining the requirement, shaping the system design, shipping a production-ready feature, and proving it holds with tests.",
      growthTitle: "Engineering Mindset & Growth",
      growthIntro:
        "How I work, stated up front, because the stack will change and the way you approach it will not.",
      growthItems: [
        {
          title: "Rapid learning",
          body: "I pick up a new framework when the problem calls for it, not when it trends. Swift and SwiftUI for an iOS prototype, Next.js and Supabase for a live event platform — each one was learned against a real deadline and a real user.",
        },
        {
          title: "Production readiness",
          body: "Security and correctness are part of the feature, not a later pass. Access rules live in the database with Postgres Row Level Security so bypassing the UI changes nothing, and pgTAP and Vitest keep those rules honest as the schema moves.",
        },
        {
          title: "User-centric execution",
          body: "I turn operational requirements into products people can actually use — an event flow that works in Arabic first, a greeting card that still saves when the venue Wi-Fi drops. Shipped and used beats elegant and theoretical.",
        },
      ],
      definitionsTitle: "Definitions",
      definitions: [
        {
          term: "Shipped",
          def: "It runs, and somebody other than me has used it.",
        },
        {
          term: "In active development",
          def: "It partly runs, and I am working on it this week.",
        },
        {
          term: "Prototype",
          def: "I wrote it myself to learn, then fixed it when it broke.",
        },
      ],
    },
    s2: {
      heading: "Context",
      seeFullPre: "Specified in full at ",
    },
    s3: {
      heading: "Interfaces",
      introPre:
        "Listed by what I have actually built with, not what I have read about. Most of these came out of ",
      categories: {
        web: "Web",
        mobile: "Mobile",
        backend: "Backend",
        data: "Data",
        quality: "Quality",
        process: "Process",
      },
    },
    s4: {
      heading: "Requirements",
      acceptanceCriteria: "Acceptance criteria",
      dependencies: "Dependencies",
      statusLabels: {
        activeDevelopment: "In active development",
        liveEvent: "Shipped for a live event",
        graduation: "Graduation project",
        prototype: "iOS prototype",
      },
    },
    s5: {
      heading: "Verification",
      evidenceTitle: "Evidence record",
      evidenceIntro:
        "Every number in this document can be traced to a source. This is the source.",
      tableItem: "Item",
      tableValue: "Value",
      tableMethod: "Method",
      rowGpaMethod: "Umm Al-Qura transcript",
      rowGraduationLabel: "Expected graduation",
      rowGraduationMethod: "Registered study plan",
      rowVolunteerMethod: "National Volunteering Platform log",
      rowLocationLabel: "Location",
      rowLocationMethod: "On site, or remote on Riyadh time",
      annexTitle: "Annex A — Résumé",
      annexBody:
        "One page, PDF. The same facts as this document, in the format an applicant tracking system expects.",
      annexView: "View résumé",
      annexDownload: "Download PDF",
      annexClose: "Close",
      annexOpenTab: "Open in a new tab",
    },
    s6: {
      heading: "Conformance demo",
      title: "Digital Twin — live",
      intro:
        "I built an assistant that answers questions about my background and projects in the language of the page. It runs on a live model, so replies vary each time you ask — try it below.",
    },
    s7: {
      heading: "Change requests",
      headline:
        "The fastest path to a new revision of this document is a message from you.",
      subtext:
        "I read every message, and I reply in Arabic or English, whichever you write in.",
      emailLabel: "Email",
      phoneLabel: "Phone",
    },
    footer: {
      end: "End of document — SPEC-2026 / Rev 4.0",
      prepared: "Prepared in Makkah",
      backTo0: "Back to §0",
    },
    cover: {
      kicker: "Software Requirements Specification",
      title: "Ziyad’s Personal Specification",
      subtitle: "SRS Report",
      dept: "Department of Software Engineering",
      location: "Makkah, Saudi Arabia",
      month: "September 2026",
      blurb:
        "A software engineering portfolio structured as an official specification document: every section a clause, every project a requirement with acceptance criteria.",
      colId: "Document ID",
      colDate: "Date",
      colVersion: "Version",
      colStatus: "Status",
      statusValue: "Released",
      hint: "Click anywhere to open",
    },
  },
} as const;
