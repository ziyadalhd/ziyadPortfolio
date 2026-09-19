import type { Locale } from "@/i18n/config";

/** Content entities carry their own translations; UI chrome lives in src/i18n. */
export type Localized<T = string> = Record<Locale, T>;

export const personalInfo = {
  name: "Ziyad Jaber Alhdriti",
  role: {
    en: "Software Engineering student, Full-Stack & Mobile Application Engineer",
    ar: "طالب هندسة برمجيات، مهندس تطبيقات ويب وجوال",
  } as Localized,
  location: {
    en: "Makkah, Saudi Arabia",
    ar: "مكة المكرمة، المملكة العربية السعودية",
  } as Localized,
  linkedin: "https://www.linkedin.com/in/ziyad-alhdriti",
  linkedinDisplay: "www.linkedin.com/in/ziyad-alhdriti",
  github: "https://github.com/ziyadalhd",
  githubDisplay: "github.com/ziyadalhd",
  email: "ziyadalhdriti@gmail.com",
  /** Served from /public; see README. Must be the phone-free revision. */
  resume: "/ziyad-jaber-alhdriti-cv.pdf",
  gpa: "3.73 / 4.00",
  expectedGraduation: "2027",
  volunteerHours: "262+",
} as const;

export const journey: {
  period: Localized;
  title: Localized;
  detail: Localized;
  /** Small accent chip; marks professional work apart from study and volunteering. */
  tag?: Localized;
  /** Renders a "specified in full at §x.y" cross-reference to a requirement. */
  refClause?: string;
}[] = [
  {
    period: { en: "2026 - Present", ar: "2026 - حتى الآن" },
    tag: { en: "Professional experience", ar: "خبرة مهنية" },
    title: {
      en: "Software Engineering / Business Analysis Intern - Holy Makkah Municipality",
      ar: "متدرب هندسة برمجيات وتحليل أعمال - أمانة العاصمة المقدسة",
    },
    detail: {
      en: "Analysing and documenting the requirements and business cycles behind digital services, modelling the procedures as process maps, and working inside cross-functional Agile teams to move them from paper into delivery.",
      ar: "أحلّل وأوثّق متطلبات الخدمات الرقمية ودورات العمل المرتبطة بها، وأنمذج الإجراءات على شكل مخططات إجرائية، وأعمل ضمن فرق متعددة التخصصات وفق منهجيات Agile لنقل هذه الإجراءات من التوثيق إلى التنفيذ.",
    },
  },
  {
    period: { en: "2025 - Present", ar: "2025 - حتى الآن" },
    title: {
      en: "WASL Graduation Project - Mobile + Backend Platform",
      ar: "مشروع التخرج وصل - منصة جوال وخدمات خلفية",
    },
    detail: {
      en: "Contributed to an integrated transportation and accommodation platform with a Flutter front-end, Spring Boot APIs, booking flows, ratings and admin operations.",
      ar: "ساهمت في منصة متكاملة للنقل والسكن الطلابي بواجهة Flutter وخدمات Spring Boot، تشمل مسارات الحجز والتقييم وعمليات الإدارة.",
    },
    refClause: "4.3",
  },
  {
    period: { en: "2024 - Present", ar: "2024 - حتى الآن" },
    title: {
      en: "Community Volunteer - National Volunteering Platform",
      ar: "متطوع مجتمعي - المنصة الوطنية للعمل التطوعي",
    },
    detail: {
      en: "Completed 262+ verified hours supporting digital outreach and community initiatives aligned with Saudi Vision 2030.",
      ar: "أنجزت أكثر من 262 ساعة موثّقة في دعم المبادرات المجتمعية والتوعية الرقمية، بما يتوافق مع رؤية السعودية 2030.",
    },
  },
  {
    period: { en: "2023 - 2027", ar: "2023 - 2027" },
    title: {
      en: "B.S. Software Engineering - Umm Al-Qura University",
      ar: "بكالوريوس هندسة البرمجيات - جامعة أم القرى",
    },
    detail: {
      en: "Building a strong foundation in software architecture, data structures, requirements engineering, UML modelling and testing. Current GPA: 3.73/4.00.",
      ar: "أبني أساساً متيناً في معمارية البرمجيات وهياكل البيانات وهندسة المتطلبات ونمذجة UML والاختبار. المعدل التراكمي الحالي 3.73 من 4.00.",
    },
  },
];

export type Project = {
  /** Stable React key and analytics id; never translated. */
  slug: string;
  title: Localized;
  kind: Localized;
  /** Locale-neutral, ASCII digits. */
  period: Localized;
  status: "activeDevelopment" | "liveEvent" | "graduation" | "prototype";
  summary: Localized;
  highlights: Localized<string[]>;
  /** Brand names - never translated. */
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "bayn",
    title: {
      en: "Bayn Cultural Club - Event Management Platform",
      ar: "نادي بين الثقافي - منصة إدارة الفعاليات",
    },
    kind: { en: "Product Platform", ar: "منصة رقمية" },
    period: { en: "2026", ar: "2026" },
    status: "activeDevelopment",
    summary: {
      en: "An Arabic-first platform for running cultural events end to end: a public registration and booking front-end, and a protected admin console for attendance, waitlists and day-of operations.",
      ar: "منصة عربية متكاملة لإدارة الفعاليات الثقافية من طرف إلى طرف: واجهة عامة للتسجيل والحجز، ولوحة تحكم إدارية محميّة لإدارة الحضور وقوائم الانتظار وعمليات يوم الفعالية.",
    },
    highlights: {
      en: [
        "Built the public registration and booking flow as an RTL-first interface on the Next.js App Router.",
        "Protected the admin console behind MFA and enforced per-role access inside the database with Postgres Row Level Security, so the rules hold even if the UI is bypassed.",
        "Wired Telegram and WhatsApp notifications for registrations, confirmations and waitlist movement.",
        "Covered the access policies with pgTAP tests, so a broken rule fails the suite instead of leaking data quietly.",
      ],
      ar: [
        "بنيت واجهة التسجيل والحجز العامة بتصميم عربي الاتجاه أولاً على Next.js App Router.",
        "حميت لوحة التحكم بمصادقة متعددة العوامل، وطبّقت صلاحيات كل دور داخل قاعدة البيانات عبر Postgres Row Level Security، لتبقى القواعد سارية حتى لو جرى تجاوز الواجهة.",
        "ربطت تنبيهات Telegram وWhatsApp بعمليات التسجيل والتأكيد وحركة قوائم الانتظار.",
        "غطّيت سياسات الوصول باختبارات pgTAP، فأي خلل في الصلاحيات يُسقِط الاختبارات بدل أن يسرّب البيانات بصمت.",
      ],
    },
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "Tailwind CSS",
      "pgTAP",
      "Vercel",
    ],
  },
  {
    slug: "wedding-greetings",
    title: {
      en: "Wedding Greetings - Live Event Message Wall",
      ar: "تهاني الزواج - جدار رسائل لحدث مباشر",
    },
    kind: { en: "Live Event Build", ar: "تنفيذ لحدث مباشر" },
    period: { en: "2026", ar: "2026" },
    status: "liveEvent",
    summary: {
      en: "An interactive web app designed and shipped for a real wedding: guests scan a QR code and compose a greeting that the browser renders as a 1080x1350 card, with no install and no account.",
      ar: "تطبيق ويب تفاعلي صُمّم ونُفّذ لحفل زفاف حقيقي: يمسح الضيف رمز QR ويكتب تهنئته، فيولّد المتصفح بطاقة بدقة 1080×1350 دون تثبيت تطبيق ودون إنشاء حساب.",
    },
    highlights: {
      en: [
        "Rendered the 1080x1350 greeting cards entirely client-side with the Canvas API, including correct Arabic shaping and line breaking.",
        "Ran the whole thing on a serverless Supabase backend with Postgres Row Level Security instead of standing up a server for one evening.",
        "Persisted drafts in localStorage so a guest never lost a message when the venue Wi-Fi dropped mid-typing.",
        "Designed, built and ran it in a compressed timeline against a fixed, immovable event date.",
      ],
      ar: [
        "ولّدت بطاقات التهنئة بدقة 1080×1350 داخل المتصفح بالكامل عبر Canvas API، مع ضبط تشكيل الحروف العربية وكسر الأسطر.",
        "شغّلت المنصة على خلفية Supabase بلا خوادم مع Postgres Row Level Security، بدل تجهيز خادم كامل من أجل أمسية واحدة.",
        "حفظت المسوّدات محلياً عبر localStorage، فلا يفقد الضيف رسالته عند انقطاع شبكة القاعة أثناء الكتابة.",
        "صمّمت التطبيق وبنيته وشغّلته ضمن مهلة ضيّقة أمام موعد حدث ثابت لا يقبل التأجيل.",
      ],
    },
    stack: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Supabase",
      "Canvas API",
      "Tailwind CSS",
      "Vercel",
    ],
  },
  {
    slug: "wasl",
    title: {
      en: "Wasl - Student Transportation & Accommodation Platform",
      ar: "وصل - منصة النقل والسكن الطلابي",
    },
    kind: { en: "Graduation Project", ar: "مشروع التخرج" },
    period: { en: "2025 - Present", ar: "2025 - حتى الآن" },
    status: "graduation",
    summary: {
      en: "An integrated mobile platform connecting university students with transportation and accommodation providers, built with a Flutter front-end over Spring Boot REST APIs and PostgreSQL.",
      ar: "منصة جوال متكاملة تربط طلاب الجامعة بمزوّدي خدمات النقل والسكن، مبنية بواجهة Flutter فوق واجهات Spring Boot البرمجية وقاعدة بيانات PostgreSQL.",
    },
    highlights: {
      en: [
        "Built cross-platform mobile screens from the system design and SRS documentation, supporting three roles: Student, Provider and Admin.",
        "Integrated the Flutter front-end with Spring Boot REST APIs for data exchange, user flows and service operations.",
        "Implemented the booking and service-request workflows that connect students with providers.",
      ],
      ar: [
        "بنيت شاشات جوال متعددة المنصات انطلاقاً من تصميم النظام ووثيقة المتطلبات SRS، بدعم ثلاثة أدوار: الطالب والمزوّد والمشرف.",
        "ربطت واجهة Flutter بواجهات Spring Boot البرمجية لتبادل البيانات وإدارة مسارات المستخدم وعمليات الخدمة.",
        "نفّذت مسارات الحجز وطلبات الخدمة التي تربط الطلاب بمزوّدي الخدمات.",
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
    slug: "h2o-calm",
    title: {
      en: "H2O Calm - Daily Water Intake Tracker",
      ar: "H2O Calm - متتبّع شرب الماء اليومي",
    },
    kind: { en: "Personal Learning Project", ar: "مشروع تعلّم شخصي" },
    period: { en: "2026", ar: "2026" },
    status: "prototype",
    summary: {
      en: "A native iOS prototype that calculates and tracks a daily water-intake goal behind a dark neon interface, built while teaching myself Swift and SwiftUI.",
      ar: "نموذج iOS أصلي يحسب هدف شرب الماء اليومي ويتتبّعه بواجهة نيون داكنة، طوّرته أثناء تعلّمي Swift وSwiftUI ذاتياً.",
    },
    highlights: {
      en: [
        "Self-taught Swift and SwiftUI from scratch to ship a working iOS prototype.",
        "Persisted entries locally so progress survives across sessions.",
      ],
      ar: [
        "تعلّمت Swift وSwiftUI ذاتياً من الصفر حتى أنجزت نموذجاً يعمل على iOS.",
        "حفظت الإدخالات محلياً ليبقى تقدّم المستخدم محفوظاً بين الجلسات.",
      ],
    },
    stack: ["Swift", "SwiftUI", "Xcode", "Local Persistence"],
  },
];

export const skillCategories: {
  key: "web" | "mobile" | "backend" | "data" | "quality" | "process";
  techs: string[];
}[] = [
  {
    key: "web",
    techs: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  { key: "mobile", techs: ["Flutter", "Dart", "Swift", "SwiftUI"] },
  { key: "backend", techs: ["Spring Boot", "Java", "Supabase", "REST APIs"] },
  {
    key: "data",
    techs: ["PostgreSQL", "Row Level Security", "SQL", "Firebase"],
  },
  { key: "quality", techs: ["pgTAP", "Vitest", "Playwright", "Git"] },
  {
    key: "process",
    techs: [
      "Agile (Scrum)",
      "Requirements Analysis",
      "Process Mapping",
      "System Design",
    ],
  },
];
