import type { Locale } from "@/i18n/config";

/** Content entities carry their own translations; UI chrome lives in src/i18n. */
export type Localized<T = string> = Record<Locale, T>;

export const personalInfo = {
  name: "Ziyad Jaber Alhdriti",
  role: {
    en: "Software Engineering student, Mobile Application Engineer",
    ar: "طالب هندسة برمجيات، مهندس تطبيقات جوال",
  } as Localized,
  roleTagline: {
    en: "Software Engineering | Mobile Application Engineer",
    ar: "هندسة برمجيات | مهندس تطبيقات جوال",
  } as Localized,
  location: { en: "Makkah, Saudi Arabia", ar: "مكة المكرمة، السعودية" } as Localized,
  linkedin: "https://www.linkedin.com/in/ziyad-alhdriti",
  linkedinDisplay: "www.linkedin.com/in/ziyad-alhdriti",
  github: "https://github.com/ziyadalhd",
  githubDisplay: "github.com/ziyadalhd",
  email: "ziyadalhdriti@gmail.com",
  /** Served from /public; see README. Deliberately has no phone number. */
  resume: "/ziyad-alhdriti-resume.pdf",
  gpa: "3.73 / 4.00",
  expectedGraduation: "2027",
  volunteerHours: "262+",
} as const;

export const journey: {
  period: Localized;
  title: Localized;
  detail: Localized;
}[] = [
  {
    period: { en: "2023 - 2027", ar: "2023 - 2027" },
    title: {
      en: "B.S. Software Engineering - Umm Al-Qura University",
      ar: "بكالوريوس هندسة البرمجيات - جامعة أم القرى",
    },
    detail: {
      en: "Building a strong foundation in software architecture, data structures, requirements engineering, UML modeling, and testing. Current GPA: 3.73/4.00.",
      ar: "بناء أساس متين في معمارية البرمجيات وهياكل البيانات وهندسة المتطلبات ونمذجة UML والاختبار. المعدل التراكمي الحالي: 3.73 من 4.00.",
    },
  },
  {
    period: { en: "2024 - Present", ar: "2024 - حتى الآن" },
    title: {
      en: "Community Volunteer - National Volunteering Platform",
      ar: "متطوع مجتمعي - المنصة الوطنية للعمل التطوعي",
    },
    detail: {
      en: "Completed 262+ verified hours supporting digital outreach and community initiatives aligned with Saudi Vision 2030.",
      ar: "أنجزت أكثر من 262 ساعة موثّقة في دعم المبادرات المجتمعية والتوعية الرقمية بما يتوافق مع رؤية السعودية 2030.",
    },
  },
  {
    period: { en: "2025 - Present", ar: "2025 - حتى الآن" },
    title: {
      en: "WASL Graduation Project - Mobile + Backend Platform",
      ar: "مشروع التخرج WASL - منصة جوال وواجهات خلفية",
    },
    detail: {
      en: "Contributed to an integrated transportation and accommodation platform with Flutter frontend, Spring Boot APIs, booking flows, ratings, and admin operations.",
      ar: "ساهمت في منصة متكاملة للنقل والسكن بواجهة Flutter وواجهات برمجية على Spring Boot، تشمل مسارات الحجز والتقييمات وعمليات الإدارة.",
    },
  },
  {
    period: { en: "2026", ar: "2026" },
    title: {
      en: "Independent iOS Build in Swift",
      ar: "تطبيق iOS مستقل بلغة Swift",
    },
    detail: {
      en: "Delivered a full personal iOS app from scratch using AI-assisted rapid prototyping and local data storage.",
      ar: "طوّرت تطبيق iOS شخصياً من الصفر باستخدام النمذجة السريعة بمساعدة الذكاء الاصطناعي وتخزين البيانات محلياً.",
    },
  },
];

export type ProjectLink = {
  kind: "repo" | "demo" | "caseStudy" | "store";
  href: string;
};

export type Project = {
  /** Stable React key and analytics id; never translated. */
  slug: string;
  title: Localized;
  kind: Localized;
  /** Locale-neutral, ASCII digits. */
  period: Localized;
  status: "shipped" | "inProgress" | "personal";
  summary: Localized;
  highlights: Localized<string[]>;
  /** Brand names — never translated. */
  stack: string[];
  icon?: "mobile" | "architecture" | "code";
  links?: ProjectLink[];
  image?: { src: string; width: number; height: number; alt: Localized };
};

export const projects: Project[] = [
  {
    slug: "wasl",
    title: {
      en: "Wasl — Student Transportation & Accommodation Platform",
      ar: "وصل — منصة النقل والسكن الطلابي",
    },
    kind: { en: "Graduation Project", ar: "مشروع التخرج" },
    period: { en: "2025 – 2026", ar: "2025 – 2026" },
    status: "inProgress",
    icon: "mobile",
    summary: {
      en: "An integrated platform connecting students with transportation and accommodation providers, built with a Flutter front-end over Spring Boot REST APIs and PostgreSQL.",
      ar: "منصة متكاملة تربط الطلاب بمزوّدي خدمات النقل والسكن، مبنية بواجهة Flutter فوق واجهات برمجية على Spring Boot وقاعدة بيانات PostgreSQL.",
    },
    highlights: {
      en: [
        "Built cross-platform mobile screens from system design and SRS documentation, supporting three user roles: Student, Provider and Admin.",
        "Integrated the Flutter front-end with Spring Boot REST APIs for data exchange, user flows and service operations.",
        "Implemented booking and service-request workflows connecting students with providers.",
      ],
      ar: [
        "طوّرت واجهات جوال متعددة المنصات انطلاقاً من تصميم النظام ووثيقة المتطلبات، بدعم ثلاثة أدوار: الطالب والمزوّد والمشرف.",
        "ربطت واجهة Flutter بواجهات Spring Boot البرمجية لتبادل البيانات وإدارة مسارات المستخدم والخدمات.",
        "بنيت مسارات الحجز وطلبات الخدمة التي تربط الطلاب بالمزوّدين.",
      ],
    },
    stack: [
      "Flutter",
      "Dart",
      "Spring Boot",
      "Java",
      "REST APIs",
      "PostgreSQL",
      "Git",
      "Agile/Scrum",
    ],
  },
  {
    slug: "water-tracker",
    title: {
      en: "Daily Water Intake Tracker — iOS App",
      ar: "متتبّع شرب الماء اليومي — تطبيق iOS",
    },
    kind: { en: "Personal Learning Project", ar: "مشروع تعلّم شخصي" },
    period: { en: "2026", ar: "2026" },
    status: "personal",
    icon: "code",
    summary: {
      en: "A native iOS app that calculates and tracks daily water-intake goals, built while teaching myself Swift from scratch.",
      ar: "تطبيق iOS أصلي يحسب أهداف شرب الماء اليومية ويتتبّعها، طوّرته أثناء تعلّمي لغة Swift من الصفر.",
    },
    highlights: {
      en: [
        "Self-taught Swift from scratch to ship a working iOS prototype.",
        "Implemented core application logic and interface components using native iOS patterns.",
        "Added local persistence so entries survive across sessions.",
      ],
      ar: [
        "تعلّمت Swift ذاتياً من الصفر حتى إنجاز نموذج عملي يعمل على iOS.",
        "نفّذت منطق التطبيق الأساسي ومكوّنات الواجهة وفق أنماط iOS الأصلية.",
        "أضفت تخزيناً محلياً يحفظ إدخالات المستخدم بين الجلسات.",
      ],
    },
    stack: ["Swift", "Xcode", "Local Persistence"],
  },
];


export const skillCategories: {
  key: "mobile" | "backend" | "data" | "process";
  techs: string[];
}[] = [
  { key: "mobile", techs: ["Flutter", "Dart", "Swift", "native iOS"] },
  { key: "backend", techs: ["Spring Boot", "Java", "REST APIs", "Firebase"] },
  { key: "data", techs: ["PostgreSQL", "SQL", "Git", "GitHub"] },
  { key: "process", techs: ["OOP", "SDLC", "Agile (Scrum)", "System Design"] },
];


export const valuePillars: Localized[] = [
  {
    en: "Clean architecture in mobile apps",
    ar: "معمارية نظيفة في تطبيقات الجوال",
  },
  {
    en: "Fast prototyping with AI-assisted workflows",
    ar: "نمذجة سريعة بمسار عمل معزّز بالذكاء الاصطناعي",
  },
  {
    en: "Reliable API integration and system thinking",
    ar: "تكامل موثوق مع الواجهات البرمجية وتفكير نظمي",
  },
];
