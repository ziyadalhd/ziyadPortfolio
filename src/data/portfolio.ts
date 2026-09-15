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
  phone: "+966 56 926 4771",
  phoneHref: "+966569264771",
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

export const portfolioRoadmap = [
  {
    title: "Case Study: WASL Platform",
    description:
      "Full architecture walkthrough, product decisions, UI system, and engineering tradeoffs.",
  },
  {
    title: "Case Study: Swift iOS Project",
    description:
      "How I learned Swift quickly and turned requirements into a working application.",
  },
  {
    title: "Mobile Engineering Playbook",
    description:
      "My reusable development standards for clean architecture, API integration, and testing.",
  },
];

export const skillGroups = [
  "Flutter, Dart, Swift, Java",
  "Spring Boot, REST APIs, Firebase",
  "PostgreSQL, SQL, Git, GitHub",
  "OOP, SDLC, Agile (Scrum), System Design",
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
