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
  phone: "+966 56 926 4771",
  phoneHref: "tel:+966569264771",
  whatsapp: "https://wa.me/966569264771",
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
      ar: "أحلّل متطلبات الخدمات الرقمية وأوثّقها، وأرسم مسارات العمل، وأشارك مع فرق متعددة التخصصات في تنفيذها وفق Agile.",
    },
  },
  {
    period: { en: "2025 - 2026", ar: "2025 - 2026" },
    title: {
      en: "WASL Graduation Project - Mobile + Backend Platform",
      ar: "مشروع التخرج وصل - منصة جوال وخدمات خلفية",
    },
    detail: {
      en: "Contributed to an integrated transportation and accommodation platform with a Flutter front-end, Spring Boot APIs, booking flows, ratings and admin operations.",
      ar: "ساهمت في تطوير منصة للنقل والسكن الطلابي باستخدام Flutter وSpring Boot، مع الحجز والتقييم ولوحة الإدارة.",
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
      ar: "أنجزت أكثر من 262 ساعة تطوعية موثّقة في المبادرات المجتمعية والتوعية الرقمية ضمن مستهدفات رؤية السعودية 2030.",
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
      ar: "أبني أساسًا متينًا في معمارية البرمجيات وهياكل البيانات وهندسة المتطلبات ونمذجة UML والاختبار. المعدل التراكمي الحالي 3.73 من 4.00.",
    },
  },
];

export type Project = {
  /** Stable React key and analytics id; never translated. */
  slug: string;
  name: Localized;
  tagline: Localized;
  title: Localized;
  kind: Localized;
  /** Locale-neutral, ASCII digits. */
  period: Localized;
  status:
    | "activeDevelopment"
    | "liveEvent"
    | "graduation"
    | "prototype"
    | "completed";
  summary: Localized;
  highlights: Localized<string[]>;
  caseStudy: {
    problem: Localized;
    role: Localized;
    outcome: Localized;
    process: Localized<string[]>;
    challenge: Localized;
    decision: Localized;
  };
  /** Brand names - never translated. */
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "bayn",
    name: { ar: "نادي بين الثقافي", en: "Bayn Cultural Club" },
    tagline: {
      ar: "منصة لتنظيم الفعاليات الثقافية",
      en: "A place for culture. A platform to bring it together.",
    },
    title: {
      en: "Bayn Cultural Club - Event Management Platform",
      ar: "نادي بين الثقافي - منصة إدارة الفعاليات",
    },
    kind: { en: "Product Platform", ar: "منصة رقمية" },
    period: { en: "2026", ar: "2026" },
    status: "activeDevelopment",
    summary: {
      en: "An Arabic-first platform for running cultural events end to end: a public registration and booking front-end, and a protected admin console for attendance, waitlists and day-of operations.",
      ar: "منصة عربية للتسجيل في الفعاليات الثقافية وحجزها، مع لوحة إدارة للحضور وقوائم الانتظار وتنظيم يوم الفعالية.",
    },
    highlights: {
      en: [
        "Built the public registration and booking flow as an RTL-first interface on the Next.js App Router.",
        "Protected the admin console behind MFA and enforced per-role access inside the database with Postgres Row Level Security, so the rules hold even if the UI is bypassed.",
        "Wired Telegram and WhatsApp notifications for registrations, confirmations and waitlist movement.",
        "Covered the access policies with pgTAP tests, so a broken rule fails the suite instead of leaking data quietly.",
      ],
      ar: [
        "بنيت واجهة عربية للتسجيل والحجز باستخدام Next.js App Router.",
        "حميت لوحة الإدارة بمصادقة متعددة العوامل، وطبّقت صلاحيات الأدوار داخل قاعدة البيانات عبر Postgres Row Level Security.",
        "ربطت Telegram وWhatsApp بتنبيهات التسجيل والتأكيد وتحديث قوائم الانتظار.",
        "اختبرت صلاحيات الوصول باستخدام pgTAP لاكتشاف أخطاء القواعد قبل أن تكشف بيانات المستخدمين.",
      ],
    },
    caseStudy: {
      problem: {
        ar: "تنظيم التسجيل والحضور وقوائم الانتظار للفعاليات الثقافية في مكان واحد.",
        en: "Keep cultural-event registration, attendance and waitlists in one place.",
      },
      role: {
        ar: "بنيت واجهة التسجيل ولوحة الإدارة والصلاحيات والتنبيهات.",
        en: "Built registration, admin operations, access policies and notifications.",
      },
      outcome: {
        ar: "منصة تجمع الحجز وإدارة الفعالية، وما زالت قيد التطوير.",
        en: "A platform combining booking and event operations, still in development.",
      },
      process: {
        ar: [
          "حوّلت احتياجات الفعالية إلى مسار تسجيل وحجز عربي.",
          "بنيت لوحة إدارة للحضور وقوائم الانتظار.",
          "طبّقت الصلاحيات داخل قاعدة البيانات وربطت التنبيهات بالتسجيل.",
          "غطّيت سياسات الوصول باختبارات pgTAP.",
        ],
        en: [
          "Translated event needs into an Arabic registration and booking flow.",
          "Built admin flows for attendance and waitlists.",
          "Enforced database access policies and connected registration notifications.",
          "Covered access policies with pgTAP tests.",
        ],
      },
      challenge: {
        ar: "حماية بيانات التسجيل حتى عند تجاوز واجهة الإدارة.",
        en: "Protect registration data even when the admin interface is bypassed.",
      },
      decision: {
        ar: "وضعت قواعد الوصول في PostgreSQL عبر RLS، وحميت الدخول إلى لوحة الإدارة بمصادقة متعددة العوامل. الواجهة وحدها لا تكفي لفرض الصلاحيات.",
        en: "Enforced access with PostgreSQL RLS and protected admin sign-in with MFA. Interface checks alone cannot enforce permissions.",
      },
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
    name: { ar: "تهاني", en: "Wedding Greetings" },
    tagline: {
      ar: "تهنئة من الضيوف وبطاقة للذكرى",
      en: "Words from the guests. Memories beyond the evening.",
    },
    title: {
      en: "Wedding Greetings - Live Event Message Wall",
      ar: "تهاني الزواج: بطاقات من الضيوف",
    },
    kind: { en: "Live Event Build", ar: "تطبيق لحفل زفاف" },
    period: { en: "2026", ar: "2026" },
    status: "liveEvent",
    summary: {
      en: "An interactive web app designed and shipped for a real wedding: guests scan a QR code and compose a greeting that the browser renders as a 1080x1350 card, with no install and no account.",
      ar: "تطبيق ويب لحفل زفاف: يفتح الضيف رمز QR ويكتب تهنئته، ثم يحفظها بطاقة بدقة 1080×1350 دون حساب أو تثبيت تطبيق.",
    },
    highlights: {
      en: [
        "Rendered the 1080x1350 greeting cards entirely client-side with the Canvas API, including correct Arabic shaping and line breaking.",
        "Ran the whole thing on a serverless Supabase backend with Postgres Row Level Security instead of standing up a server for one evening.",
        "Persisted drafts in localStorage so a guest never lost a message when the venue Wi-Fi dropped mid-typing.",
        "Designed, built and ran it in a compressed timeline against a fixed, immovable event date.",
      ],
      ar: [
        "بنيت توليد بطاقات بدقة 1080×1350 داخل المتصفح عبر Canvas API، مع ضبط اتصال الحروف العربية وتوزيع الأسطر.",
        "استخدمت Supabase لحفظ البيانات، مع Postgres Row Level Security لضبط الوصول إليها.",
        "حفظت المسودات في localStorage ليستعيد الضيف رسالته إذا انقطع الاتصال أثناء الكتابة.",
        "صمّمت التطبيق وبنيته وجهّزته للاستخدام في موعد الحفل.",
      ],
    },
    caseStudy: {
      problem: {
        ar: "يكتب ضيوف الزفاف تهانيهم ويحفظونها بطاقات دون حساب أو تثبيت تطبيق.",
        en: "Let wedding guests write a greeting and save a card without an account or app.",
      },
      role: {
        ar: "صمّمت التطبيق وطوّرت توليد البطاقات وحفظ المسودات، وجهّزته للحفل.",
        en: "Designed and built the app, card rendering and draft storage, and ran it for the event.",
      },
      outcome: {
        ar: "تطبيق استُخدم في حفل زفاف حقيقي، مع بطاقات عربية قابلة للحفظ.",
        en: "An app used at a real wedding, producing downloadable Arabic greeting cards.",
      },
      process: {
        ar: [
          "صمّمت مسارًا يبدأ بمسح رمز QR وينتهي ببطاقة تهنئة.",
          "بنيت توليد البطاقات داخل المتصفح عبر Canvas.",
          "ضبطت الحروف العربية وكسر الأسطر، وحفظت المسودات محليًا.",
          "شغّلت التطبيق للحفل ضمن الموعد المحدد.",
        ],
        en: [
          "Designed a flow from scanning a QR code to creating a greeting card.",
          "Built card rendering in the browser with Canvas.",
          "Handled Arabic shaping and line breaks, and persisted drafts locally.",
          "Ran the app for the wedding within its fixed deadline.",
        ],
      },
      challenge: {
        ar: "موعد حفل ثابت، ورسائل يجب ألا تضيع عند انقطاع شبكة القاعة.",
        en: "A fixed event date, with messages that must survive interrupted venue Wi-Fi.",
      },
      decision: {
        ar: "ولّدت البطاقات داخل المتصفح وحفظت المسودات في localStorage. استخدمت Supabase للخدمات الخلفية لتجنّب تجهيز خادم لحفل واحد.",
        en: "Rendered cards in the browser and stored drafts in localStorage. Used Supabase for the backend to avoid provisioning a server for one event.",
      },
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
    name: { ar: "وصل", en: "Wasl" },
    tagline: {
      ar: "النقل والسكن الطلابي، في مكان واحد.",
      en: "Student transport and accommodation, in one place.",
    },
    title: {
      en: "Wasl - Student Transportation & Accommodation Platform",
      ar: "وصل - منصة النقل والسكن الطلابي",
    },
    kind: { en: "Graduation Project", ar: "مشروع التخرج" },
    period: { en: "2025 - 2026", ar: "2025 - 2026" },
    status: "completed",
    summary: {
      en: "A student-focused mobile platform combining university buses, private drivers and shared housing, with booking, online payments, a wallet, notifications and ratings.",
      ar: "منصة جوال تجمع الحافلات الجامعية والسائقين والسكن المشترك للطلاب، مع الحجز والدفع الإلكتروني والمحفظة والتنبيهات والتقييمات.",
    },
    highlights: {
      en: [
        "Built cross-platform mobile screens from the system design and SRS documentation, supporting three roles: Student, Provider and Admin.",
        "Integrated the Flutter front-end with Spring Boot REST APIs for data exchange, user flows and service operations.",
        "Implemented the booking and service-request workflows that connect students with providers.",
        "The platform includes online payments, a wallet, real-time notifications and ratings, with separate Student, Provider and Admin roles.",
      ],
      ar: [
        "بنيت شاشات جوال متعددة المنصات انطلاقًا من تصميم النظام ووثيقة المتطلبات SRS، بدعم ثلاثة أدوار: الطالب والمزوّد والمشرف.",
        "ربطت واجهة Flutter بواجهات Spring Boot البرمجية لتبادل البيانات وإدارة مسارات المستخدم وعمليات الخدمة.",
        "نفّذت مسارات الحجز وطلبات الخدمة التي تربط الطلاب بمزوّدي الخدمات.",
        "تضم المنصة الدفع الإلكتروني والمحفظة والتنبيهات الفورية والتقييمات، بأدوار مستقلة للطالب والمزوّد والمشرف.",
      ],
    },
    caseStudy: {
      problem: {
        ar: "منصة تجمع خدمات النقل والسكن للطلاب، مع الحجز والتقييم وإدارة الخدمات.",
        en: "Transport and housing are fragmented across platforms that do not fully address student needs around availability, cost and clear booking flows.",
      },
      role: {
        ar: "طوّرت شاشات Flutter وربطتها بواجهات API، وساهمت في مسارات الحجز.",
        en: "Contributed Flutter screens, API integration and booking workflows.",
      },
      outcome: {
        ar: "مشروع تخرج جماعي للنقل والسكن الطلابي، اكتمل نهاية الفصل الثاني من العام الدراسي 2025–2026، ويشمل الحجز والدفع والمحفظة والتقييمات.",
        en: "A team graduation project completed at the end of semester two, 2025–2026, combining student transport and housing with booking, payments, a wallet and ratings.",
      },
      process: {
        ar: [
          "انطلقت من تصميم النظام ووثيقة المتطلبات SRS.",
          "بنيت شاشات Flutter لأدوار الطالب والمزوّد والمشرف.",
          "ربطت الشاشات بواجهات Spring Boot لتبادل البيانات.",
          "نفّذت مسارات الحجز وطلبات الخدمة.",
        ],
        en: [
          "Worked from the system design and SRS documentation.",
          "Built Flutter screens for Student, Provider and Admin roles.",
          "Connected screens to Spring Boot APIs for data exchange.",
          "Implemented booking and service-request workflows.",
        ],
      },
      challenge: {
        ar: "جمع خدمات النقل والسكن والحجز والدفع في مسارات واضحة لثلاثة أدوار، مع ربط واجهة الجوال بالخدمات الخلفية.",
        en: "Bring transport, housing, booking and payments into clear flows for three user roles, connecting the mobile interface to backend services.",
      },
      decision: {
        ar: "بنيت واجهة Flutter فوق واجهات REST في Spring Boot وفق تصميم المشروع. مساهمتي تشمل الواجهة والتكامل ومسارات الحجز ضمن عمل الفريق.",
        en: "Built Flutter flows over the project’s Spring Boot REST APIs. My contribution covers the interface, integration and booking workflows within the team.",
      },
    },
    stack: [
      "Flutter",
      "Dart",
      "Spring Boot",
      "Java",
      "REST APIs",
      "PostgreSQL",
      "Supabase",
      "Flyway",
      "Moyasar",
      "Git",
      "Agile/Scrum",
    ],
  },
  {
    slug: "h2o-calm",
    name: { ar: "ارتواء", en: "Irtiwa" },
    tagline: { ar: "كل رشفة، خطوة لهدفك.", en: "Every sip, a little closer." },
    title: {
      en: "Irtiwa - Daily Water Intake Tracker",
      ar: "ارتواء - متابعة شرب الماء",
    },
    kind: { en: "iOS Application", ar: "تطبيق iOS" },
    period: { en: "2026", ar: "2026" },
    status: "activeDevelopment",
    summary: {
      en: "A bilingual iOS app for tracking water intake and bottles, with an adjustable daily goal, reminders and widgets. Data stays on the device, with no account required.",
      ar: "تطبيق عربي وإنجليزي لمتابعة شرب الماء والعلب، مع هدف يومي قابل للتعديل وتذكيرات وويدجت. البيانات محلية، دون حساب.",
    },
    highlights: {
      en: [
        "Learned Swift and SwiftUI while building a native iOS app.",
        "Persisted entries locally so progress survives across sessions.",
        "Added bottle tracking, reminders and widgets for daily use.",
      ],
      ar: [
        "تعلّمت Swift وSwiftUI ذاتيًا أثناء بناء تطبيق iOS.",
        "حفظت الإدخالات محليًا ليبقى تقدّم المستخدم محفوظًا بين الجلسات.",
        "أضفت متابعة العلب والتذكيرات والويدجت للاستخدام اليومي.",
      ],
    },
    caseStudy: {
      problem: {
        ar: "يساعدك على تسجيل شرب الماء ومتابعة العلب وهدفك اليومي.",
        en: "Log water intake and track a daily goal without losing progress.",
      },
      role: {
        ar: "بنيت التطبيق باستخدام SwiftUI، مع تسجيل الماء ومتابعة العلب والحفظ المحلي والتذكيرات والويدجت.",
        en: "Built the SwiftUI interface, water and bottle tracking, local persistence, reminders and widgets.",
      },
      outcome: {
        ar: "تطبيق iOS يجمع تسجيل الماء ومتابعة العلب والهدف اليومي، والعمل مستمر.",
        en: "An iOS app combining water logging, bottle tracking and a daily goal, with development ongoing.",
      },
      process: {
        ar: [
          "تعلّمت Swift وSwiftUI أثناء بناء التطبيق.",
          "بنيت حساب الهدف اليومي وتسجيل كميات الماء.",
          "حفظت الإدخالات محليًا لاستعادة التقدّم بين الجلسات.",
          "أضفت متابعة العلب والتذكيرات والويدجت.",
        ],
        en: [
          "Learned Swift and SwiftUI while building the app.",
          "Built daily-goal calculation and water-entry tracking.",
          "Persisted entries locally to retain progress across sessions.",
          "Added bottle tracking, reminders and widgets.",
        ],
      },
      challenge: {
        ar: "جمع تسجيل الماء ومتابعة العلب والتقدّم اليومي في تجربة واضحة.",
        en: "Bring water logging, bottle tracking and daily progress into one clear experience.",
      },
      decision: {
        ar: "استخدمت SwiftUI لواجهة iOS وحفظت البيانات محليًا، ليبدأ المستخدم تسجيل الماء دون إنشاء حساب.",
        en: "Used SwiftUI for the iOS interface and kept data local, so users can start logging water without creating an account.",
      },
    },
    stack: ["Swift", "SwiftUI", "Xcode", "Local Persistence"],
  },
];

export const galleryProjects = projects.toSorted(
  (a, b) => Number(b.slug === "h2o-calm") - Number(a.slug === "h2o-calm"),
);

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
