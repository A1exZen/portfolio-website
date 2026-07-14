import type { ProcessStep } from "../components/ui/ProcessTimeline";
import { designProcess } from "../data/process";
import { defaultProjects, type Project } from "../data/projects";

/** One image slot: a label for the placeholder + an optional real source.
 * `position` is a CSS object-position, for screenshots whose focal point
 * isn't centred (e.g. a phone mockup off to one side of a wide canvas).
 * `href`, when set, makes the slot a clickable link (e.g. a live project). */
export type ImageSlot = {
  label: string;
  src?: string;
  position?: string;
  href?: string;
};

export type DisciplineIcon = "figma" | "react" | "notion";

export type ServiceItem = {
  icon: DisciplineIcon;
  title: string;
  body: string;
  deliverables: string[];
};

export type PackageItem = {
  name: string;
  /** e.g. "from $800" — keep the "from" inside so currency/format stays free. */
  price: string;
  timeline: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
};

export type Testimonial = {
  quote: string;
  /** Person's name — leave empty until the client approves the wording. */
  name: string;
  role: string;
  project: string;
};

export type FaqItem = { q: string; a: string };

export type SiteContent = {
  meta: { name: string; title: string };
  hero: {
    line1: string;
    line2: string;
    subtitle: string;
    cards: ImageSlot[];
  };
  showcase: {
    focal: ImageSlot;
    cards: ImageSlot[];
  };
  services: {
    intro: string;
    items: ServiceItem[];
  };
  /** Client-facing engagement journey (not the internal design process). */
  journey: {
    intro: string;
    steps: { title: string; body: string }[];
  };
  packages: {
    intro: string;
    items: PackageItem[];
    note: string;
  };
  testimonials: {
    intro: string;
    items: Testimonial[];
  };
  faq: FaqItem[];
  background: {
    intro: string[];
    stats: { value: string; label: string }[];
  };
  skills: {
    process: ProcessStep[];
    groups: { index: string; label: string; tags: string[] }[];
  };
  resume: { description: string; pdfUrl: string };
  projects: Project[];
  contact: {
    intro: string;
    socials: { label: string; href: string }[];
    email: string;
  };
  footer: {
    name: string;
    socials: { label: string; href: string }[];
  };
};

export const defaultContent: SiteContent = {
  meta: {
    name: "Alex Zenchik",
    title: "Websites & Apps, Designed and Built from Idea to Launch",
  },
  hero: {
    line1: "I DESIGN & BUILD",
    line2: "WEBSITES & APPS",
    subtitle:
      "From idea to launch — strategy, UX/UI design, and development handled end to end. You explain the goal - I ship the product.",
    cards: [
      {
        label: "Auk IoT App",
        src: "/images/project-preview/Auk-Preview.png",
      },
      {
        label: "Device Pairing",
        src: "/images/project-preview/landing-landio.png",
      },
      {
        label: "Light Scheduling",
        src: "/images/project-preview/cover-legenda.png",
      },
      {
        label: "SaaS Dashboard",
        src: "/images/project-preview/macbook-finora.png",
      },
      {
        label: "Design System",
        src: "/images/project-preview/landing-hanzo.png",
      },
      {
        label: "E-commerce Checkout",
        src: "/images/project-preview/macbook-pizza.jpg",
        position: "left center",
      },
      {
        label: "Design → Code",
        src: "/images/project-preview/landing-build.png",
        position: "20% center",
      },
    ],
  },
  showcase: {
    focal: {
      label: "Finora — Finance Dashboard",
      src: "/images/project-preview/macbook-finora.png",
    },
    // Add an `href` to any card to make it a clickable link to a live project.
    cards: [
      {
        label: "Hanzo — Design Studio",
        src: "/images/project-preview/landing-hanzo.png",
      },
      {
        label: "Landio — AI Automation",
        src: "/images/project-preview/landing-landio.png",
      },
      {
        label: "ЖК «Легенда» — Real Estate",
        src: "/images/project-preview/cover-legenda.png",
      },
      {
        label: "Food Ordering Dashboard",
        src: "/images/project-preview/macbook-pizza.jpg",
        position: "left center",
      },
      {
        label: "Auk — Mobile App",
        src: "/images/project-preview/Auk-Preview.png",
      },
      {
        label: "Build — Web3 Platform",
        src: "/images/project-preview/landing-build.png",
      },
      {
        label: "Auk — Website",
        src: "/images/project-preview/AukWebsite.png",
        href: "https://www.auk.com/",
      },
      {
        label: "PeakLog — Health Dashboard",
        src: "/images/project-preview/PeakLog.png",
      },
    ],
  },
  services: {
    intro:
      "Most projects fail in the gaps — between the brief and the design, the design and the code, the code and the launch. My job is to remove the gaps: one person carries your product from the first conversation to a working release.",
    items: [
      {
        icon: "figma",
        title: "Websites that work for your business",
        body: "Landing pages, business websites, and online stores — designed around what you're selling and built to load fast, rank well, and convert visitors into enquiries.",
        deliverables: [
          "Landing pages",
          "Business & marketing websites",
          "E-commerce stores",
          "Redesigns of existing sites",
        ],
      },
      {
        icon: "react",
        title: "Web & mobile apps",
        body: "Dashboards, SaaS products, client portals, and mobile apps — from the first wireframe to the app store. I've shipped IoT companion apps, B2B platforms, and storefronts end to end.",
        deliverables: [
          "SaaS products & dashboards",
          "Mobile apps (iOS / Android)",
          "MVPs for startups",
          "Internal tools & portals",
        ],
      },
      {
        icon: "notion",
        title: "Design that developers can build",
        body: "UX/UI design with implementation baked in — because I write the code too. Audits of existing products, full redesigns, and design systems that survive contact with engineering.",
        deliverables: [
          "UX/UI design in Figma",
          "Product redesigns",
          "Design systems & component libraries",
          "UX audits",
        ],
      },
    ],
  },
  journey: {
    intro:
      "A clear process, so you always know what's happening and what comes next.",
    steps: [
      {
        title: "Intro call",
        body: "We talk about your goals, your users, and your constraints. Free, ~30 minutes, no obligation — you leave with a clear recommendation either way.",
      },
      {
        title: "Scope & proposal",
        body: "You get a written proposal with a fixed scope, timeline, and price. No vague estimates — you know exactly what you're getting and when.",
      },
      {
        title: "Design",
        body: "Wireframes first, then high-fidelity design in Figma. You see and approve the product before a single line of code is written.",
      },
      {
        title: "Build",
        body: "I develop the product myself, so nothing is lost in translation. You get clickable progress builds — not status reports.",
      },
      {
        title: "Launch & support",
        body: "Deployment, analytics, and a support window after release. I don't disappear when the invoice is paid.",
      },
    ],
  },
  packages: {
    intro:
      "Every project is scoped individually, but these are honest starting points — so you know roughly what to expect before we talk.",
    items: [
      {
        name: "Landing Page",
        price: "from $500",
        timeline: "1–2 weeks",
        blurb:
          "For validating an idea or promoting a single product or service.",
        features: [
          "Custom design — no templates",
          "Mobile-first and fast",
          "Copy and structure guidance",
          "Deployment + analytics set up",
        ],
      },
      {
        name: "Business Website / Store",
        price: "from $1,500",
        timeline: "3–5 weeks",
        blurb:
          "A full website or e-commerce store that presents your business properly.",
        features: [
          "Multi-page custom design",
          "CMS or store setup",
          "SEO fundamentals built in",
          "2 weeks of post-launch support",
        ],
        highlighted: true,
      },
      {
        name: "Web / Mobile App (MVP)",
        price: "from $3,000",
        timeline: "6–10 weeks",
        blurb:
          "A working product your first users can log into — designed and built end to end.",
        features: [
          "Product scoping & UX design",
          "Design system included",
          "Frontend + backend development",
          "Production / app-store launch",
        ],
      },
    ],
    note: "Not sure which fits? Tell me about the project — I'll recommend the simplest option that gets you there, even if it's the cheapest one.",
  },
  testimonials: {
    // NOTE: drafts written from real project facts. Send each to the client
    // for approval (or replace with their own wording), and fill in `name`
    // before deploying.
    intro: "What clients say about working with me.",
    items: [
      {
        quote:
          "We had a smart gardening device and no app to control it. Alex handled the whole thing — the UX, the design, and the app itself, including Bluetooth pairing — and shipped it to both app stores. After launch he kept iterating with us as real user feedback came in.",
        name: "",
        role: "Product team",
        project: "Auk — smart plant-care device",
      },
      {
        quote:
          "Alex built our client-intake and sales platform from scratch. What stood out was the discovery: he asked how our agency actually sells before designing anything. The result matches our real workflow — which is exactly where every off-the-shelf CRM we tried had failed.",
        name: "",
        role: "Partner",
        project: "Legal services agency",
      },
      {
        quote:
          "Our mobile checkout was losing customers. Alex redesigned the flow and rebuilt it himself — six steps became three, with guest checkout by default. Communication was fast, the timeline was met, and we didn't have to coordinate between a designer and a developer.",
        name: "",
        role: "Owner",
        project: "Online store",
      },
    ],
  },
  faq: [
    {
      q: "How much will my project cost?",
      a: "Landing pages start around $500, full websites and stores around $1,500, and web/mobile apps around $3,000. The final price depends on scope — after a free intro call you get a written proposal with a fixed price, so there are no surprises mid-project.",
    },
    {
      q: "How long does a project take?",
      a: "A landing page: 1–2 weeks. A business website or store: 3–5 weeks. An app MVP: 6–10 weeks. Your proposal includes a concrete timeline, and you see clickable progress builds throughout — not just a reveal at the end.",
    },
    {
      q: "Why hire me instead of an agency?",
      a: "Speed and coherence. There's no project manager relaying messages and no designer-to-developer handoff where details die. You talk directly to the person doing the work, and the product that ships is the product you approved in design.",
    },
    {
      q: "Can you work with my existing team or designs?",
      a: "Yes. I can implement designs your team has already made in Figma, design for your in-house developers, or audit and improve an existing product. End-to-end is my default, but not a requirement.",
    },
    {
      q: "How do we communicate during the project?",
      a: "Async-first: regular written updates with links to live progress builds, plus a weekly call if you want one. I work with clients across time zones and adapt to yours.",
    },
    {
      q: "What happens after launch?",
      a: "Every project includes a post-launch support window for fixes and adjustments. After that, most clients keep working with me on new features — but there's no lock-in: you own the code, the design files, and the accounts.",
    },
  ],
  background: {
    intro: [
      "I'm Alex — a product designer and developer. I spent 3+ years building production software before moving into design, which means I cover the whole path from idea to launched product without handing you off between people.",
      "I've worked with startups and businesses worldwide — an IoT hardware company, a legal services agency, online stores — turning loose ideas into clear, user-centred products that actually ship.",
    ],
    stats: [
      { value: "3+ yrs", label: "Engineering" },
      { value: "10+", label: "Shipped projects" },
      { value: "2", label: "Apps in app stores" },
    ],
  },
  skills: {
    process: designProcess,
    groups: [
      {
        index: "01",
        label: "Design",
        tags: [
          "Figma (Pro)",
          "UX Research",
          "User Flows & IA",
          "Wireframing",
          "High-Fidelity Prototyping",
          "Design Systems",
          "Component Libraries",
          "Usability Testing",
          "Mobile Design",
          "Design Handoff",
        ],
      },
      {
        index: "02",
        label: "Development",
        tags: [
          "React & Next.js",
          "React Native (Expo)",
          "TypeScript",
          "Node.js & NestJS",
          "PostgreSQL & MongoDB",
          "REST APIs & OAuth",
          "Firebase & Stripe",
          "Tailwind CSS",
          "Docker",
        ],
      },
      {
        index: "03",
        label: "Specialities",
        tags: [
          "IoT & BLE Communication",
          "Real-Time Data Sync",
          "E-commerce Platforms",
          "Dashboard Design",
          "Design-to-Dev Handoff",
          "End-to-End Ownership",
        ],
      },
    ],
  },
  resume: {
    description:
      "Traditional resume format for recruiters and hiring teams. Two versions available: design-focused or engineering-focused.",
    pdfUrl: "/resume.pdf",
  },
  projects: defaultProjects,
  contact: {
    intro:
      "Tell me about your project — what you're building, who it's for, and where you're stuck. I reply within 24 hours with honest next steps, whether or not we end up working together.",
    socials: [
      { label: "Fiverr", href: "https://www.fiverr.com/a1exzenchik" },
      { label: "Telegram", href: "http://telegram.me/lesha_zenchik" },
      { label: "LinkedIn", href: "https://linkedin.com/in/alexey-zenchik/" },
      { label: "Email", href: "mailto:alexey129800@gmail.com" },
    ],
    email: "alexey129800@gmail.com",
  },
  footer: {
    name: "Alex Zenchik · Design & Development, Idea → Launch",
    socials: [
      { label: "Fiverr", href: "https://www.fiverr.com/a1exzenchik" },
      { label: "Telegram", href: "http://telegram.me/lesha_zenchik" },
      { label: "LinkedIn", href: "https://linkedin.com/in/alexey-zenchik/" },
      { label: "Email", href: "mailto:alexey129800@gmail.com" },
      { label: "GitHub", href: "https://github.com/A1exZen" },
    ],
  },
};

export const CONTENT_VERSION = 3;
