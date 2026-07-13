export type Tone = "neutral" | "dark" | "accent";

export type CaseSection = {
  /** Anchor id — matches the case-study navbar links. */
  id: "problem" | "solution" | "outcome";
  eyebrow: string;
  heading: string;
  body: string[];
  bullets?: string[];
  /** Label for the placeholder image that follows this section. */
  image?: string;
  /** Real image URL / data-URL. When set, replaces the placeholder. */
  imageSrc?: string;
  /** Visual process steps — optionally shown on the "solution" section. */
  process?: { step: string; detail?: string }[];
  /** Result chips — typically used on the "outcome" section. */
  metrics?: { value: string; label: string }[];
};

export type Project = {
  slug: string;
  title: string;
  tag: string;
  tagTone: Tone;
  year: string;
  /** Whether this project has a full case-study page. When false it shows as
   * a "Coming soon" card in the slider and has no detail route. */
  live: boolean;
  /** Description shown on the slider card. */
  cardDesc: string;
  /** Placeholder label + optional real image for the slider card. */
  imgLabel: string;
  imgSrc?: string;
  /** Short paragraph shown under the title on the case study cover. */
  intro: string;
  focus: string;
  area: string;
  role: string;
  sections: CaseSection[];
};

export const defaultProjects: Project[] = [
  {
    slug: "auk-iot-plant-app",
    title:
      "A companion app for a smart gardening device — designed, built, and shipped to both app stores",
    tag: "Auk",
    tagTone: "dark",
    year: "2025–2026",
    live: true,
    cardDesc:
      "Auk sells a smart indoor garden — but had no app to control it. I designed the mobile UX, built the React Native app with Bluetooth pairing, and shipped it to iOS and Android.",
    imgLabel: "Auk",
    imgSrc: "/images/project-preview/Auk-Preview.png",
    intro:
      "Auk (auk.com) makes smart indoor gardens. Their newest device, the Auk Mini 2, launched without a companion app — customers couldn't control lighting or schedules from their phone. I took the app from zero to production: mobile UX in Figma, a React Native build with Bluetooth device pairing, and release on both app stores.",
    focus: "Mobile UX · IoT · React Native",
    area: "Consumer Hardware / IoT",
    role: "Product Designer & Developer",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        heading: "A physical product without its digital half",
        body: [
          "A smart device is only as good as the app that controls it — and this one didn't have one. Customers needed to pair the device, control its grow light, and set schedules, and all of it had to work over Bluetooth on a device you can't always see responding.",
          "The hard part wasn't screens — it was trust. Pairing had to succeed on the first try, and the interface had to reflect the device's real, live state rather than an optimistic guess.",
        ],
        image: "Auk Mini 2 — device & app",
      },
      {
        id: "solution",
        eyebrow: "The solution",
        heading: "One guided path from unboxing to a running schedule",
        body: [
          "I designed onboarding around a single question at a time: pair the device, confirm it's alive, set one schedule, done. Everything else became optional, progressive steps.",
          "The light schedule is a custom timeline view instead of a generic time picker — a full day reads at a glance. The dashboard is built from modular cards, each reflecting one piece of live device state, so late or missing sensor data degrades gracefully instead of breaking the screen.",
          "Because I built what I designed, every design decision was validated against real firmware behaviour — not mockup data.",
        ],
        bullets: [
          "Bluetooth pairing reduced to one guided screen",
          "Custom light-scheduling timeline",
          "Live dashboard that tolerates delayed sensor data",
          "Design and code kept in lockstep by one owner",
        ],
        image: "Light-scheduling timeline",
      },
      {
        id: "outcome",
        eyebrow: "The outcome",
        heading: "Live on iOS and Android — and iterating with real users",
        body: [
          "The app shipped to production on both platforms. After launch, real usage surfaced edge cases no mockup predicts — spotty connectivity, delayed sensor data, devices left mid-schedule — and we iterated until the flows felt dependable.",
          "Auk got its digital half from one person, without coordinating a designer, an agency, and a development team.",
        ],
        metrics: [
          { value: "iOS · Android", label: "Shipped platforms" },
          { value: "React Native", label: "Stack" },
          { value: "BLE pairing", label: "Core tech" },
          { value: "1 person", label: "Design + build" },
        ],
      },
    ],
  },
  {
    slug: "legal-sales-platform",
    title:
      "A client-intake and sales platform for a legal agency — built around how they actually sell",
    tag: "LegalTech",
    tagTone: "accent",
    year: "2025",
    live: true,
    cardDesc:
      "A legal agency was running its sales pipeline on spreadsheets and email. I designed and built a platform for client intake, proposals, and pipeline tracking — matched to their real workflow.",
    imgLabel: "Legal sales platform",
    intro:
      "A legal services agency was managing leads, proposals, and client intake across spreadsheets, email threads, and memory. Generic CRMs didn't match how legal work is actually sold — matters, conflicts checks, engagement letters. I ran discovery with the partners, then designed and built a platform shaped around their real sales process.",
    focus: "B2B UX · Web App · Process Design",
    area: "Legal Services",
    role: "Product Designer & Developer",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        heading: "A sales process that lived in spreadsheets and inboxes",
        body: [
          "Every incoming lead was a fresh email thread. Proposals were rebuilt by hand each time, pipeline status lived in a spreadsheet only one partner kept current, and nobody could answer 'what's stuck and why?' without a meeting.",
          "Off-the-shelf CRMs had been tried and abandoned — they forced a generic sales vocabulary onto a legal workflow that has its own stages and rules.",
        ],
        image: "Pipeline — before",
      },
      {
        id: "solution",
        eyebrow: "The solution",
        heading: "Discovery first, then a platform that speaks their language",
        body: [
          "I started with discovery sessions with the partners — mapping how a lead actually becomes a client, where deals stall, and which documents get recreated every time. Only then did I design screens.",
          "The result is an intake-to-engagement pipeline in the agency's own vocabulary: structured client intake instead of email threads, reusable proposal building blocks instead of copy-paste documents, and a pipeline board where every matter shows its real stage and owner.",
        ],
        bullets: [
          "Structured client-intake flow replacing email threads",
          "Reusable proposal templates and building blocks",
          "Pipeline board matched to the agency's real stages",
          "Role-based access for partners and staff",
        ],
        image: "Intake flow & pipeline board",
      },
      {
        id: "outcome",
        eyebrow: "The outcome",
        heading: "One shared view of the pipeline instead of tribal knowledge",
        body: [
          "The agency now runs intake and sales in one system: leads land in a structured queue, proposals assemble from approved blocks, and pipeline state is visible to everyone rather than kept in one partner's head.",
          "Because discovery, design, and development were one continuous effort, the platform matches how they sell — which is exactly why the previous off-the-shelf tools had failed.",
        ],
        metrics: [
          { value: "Intake → Engagement", label: "Full pipeline covered" },
          { value: "React · Node.js", label: "Stack" },
          { value: "Discovery-led", label: "Process" },
          { value: "1 person", label: "Design + build" },
        ],
      },
    ],
  },
  {
    slug: "saas-ops-dashboard",
    title:
      "A B2B ops dashboard and design system — from discovery call to shipped product",
    tag: "SaaS",
    tagTone: "neutral",
    year: "2025",
    live: true,
    cardDesc:
      "A SaaS team's customers were tracking operations in exported spreadsheets. I designed the information architecture, built a 40+ component library, and shipped the dashboard on React.",
    imgLabel: "SaaS Dashboard",
    imgSrc: "/images/project-preview/macbook-finora.png",
    intro:
      "A small SaaS platform's customers were managing operational data in exported spreadsheets because the product had no dashboard. The client had no design budget for an agency. I handled discovery, information architecture, the design system, and the full implementation — from first conversation to shipped product.",
    focus: "B2B UX · Data Visualization · Design Systems",
    area: "B2B SaaS",
    role: "Product Designer & Developer",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        heading: "The product had outgrown its own spreadsheet exports",
        body: [
          "Customers tracked operational data in exported spreadsheets because the product had no dashboard of its own. Every new metric request meant another export — there was no shared, structured view of what mattered.",
        ],
        image: "Spreadsheet workflow — before",
      },
      {
        id: "solution",
        eyebrow: "The solution",
        heading: "Not one dashboard — a system that makes the next ten cheap",
        body: [
          "Discovery came first: which numbers actually drive customer decisions, and which are noise. That shaped the information architecture before any UI existed.",
          "Then the key decision — build a component system, not a single screen. Cards, data tables, filters, and status indicators were designed once with their real React constraints in mind, then reused everywhere. What's in Figma is what's in code, because the same person made both.",
        ],
        bullets: [
          "40+ reusable React components with design tokens",
          "IA designed around user decisions, not raw metrics",
          "Full Figma ↔ code parity",
        ],
        image: "Design system components",
      },
      {
        id: "outcome",
        eyebrow: "The outcome",
        heading: "Shipped in six weeks — and every next screen is faster",
        body: [
          "The dashboard replaced the spreadsheet-export workflow within six weeks of the first call. Because the foundation is a reusable system, new screens are an assembly job — the client requests a feature and gets it in days, not weeks.",
        ],
        metrics: [
          { value: "6 weeks", label: "First call → shipped" },
          { value: "40+", label: "Reusable components" },
          { value: "React · Tailwind", label: "Stack" },
          { value: "Days, not weeks", label: "New screens now take" },
        ],
      },
    ],
  },
  {
    slug: "ecommerce-checkout",
    title:
      "Rebuilding a mobile checkout from six steps to three — design and code by one person",
    tag: "E-commerce",
    tagTone: "neutral",
    year: "2024",
    live: true,
    cardDesc:
      "Strong mobile traffic, weak conversion. I redesigned a dense 6-step checkout into 3 focused steps with guest checkout by default, and shipped it on Next.js + Stripe.",
    imgLabel: "Storefront",
    imgSrc: "/images/project-preview/macbook-pizza.jpg",
    intro:
      "A small online store had strong mobile traffic but weak conversion: checkout crammed account creation, shipping, and payment into one dense form. I redesigned the flow mobile-first — one decision per screen — and shipped the rebuild myself on Next.js and Stripe.",
    focus: "E-commerce UX · Mobile · Conversion",
    area: "Retail / E-commerce",
    role: "Product Designer & Developer",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        heading: "Checkout asked for too much, too soon",
        body: [
          "The original checkout demanded account creation, shipping, billing, and payment on one dense form. Mobile customers — the majority of traffic — were abandoning before completing a purchase.",
        ],
        image: "Checkout — before",
      },
      {
        id: "solution",
        eyebrow: "The solution",
        heading: "One decision per screen, guest checkout by default",
        body: [
          "Almost no fields were deleted — they were re-sequenced. Guest checkout became the default path with account creation offered after purchase. Shipping and payment each got their own focused screen, with the order summary persistently visible so nothing feels lost.",
          "I tested tap targets and copy in the Figma prototype before writing code, then built the flow exactly as designed — no 'looks right in Figma, feels clunky in production' gap.",
        ],
        bullets: [
          "Guest checkout by default; account optional post-purchase",
          "Shipping and payment as separate, focused steps",
          "Persistent order summary throughout",
          "Stripe integration for payments",
        ],
        image: "Checkout — after",
      },
      {
        id: "outcome",
        eyebrow: "The outcome",
        heading: "Three steps instead of six, live for all traffic",
        body: [
          "The rebuilt checkout is live for all customers. The flow went from six steps to three, and the store owner got the whole change — UX, design, implementation, deployment — from a single person on a fixed timeline.",
        ],
        metrics: [
          { value: "6 → 3", label: "Checkout steps" },
          { value: "Next.js · Stripe", label: "Stack" },
          { value: "Mobile-first", label: "Approach" },
          { value: "Fixed timeline", label: "Delivered on" },
        ],
      },
    ],
  },
  {
    slug: "legenda-real-estate",
    title: "A launch landing page for a residential real-estate development",
    tag: "Real Estate",
    tagTone: "dark",
    year: "2024",
    live: false,
    cardDesc:
      "Sales-opening landing page for the «Legenda» residential quarter — art direction, page design, and build. Full case study coming soon.",
    imgLabel: "ЖК Легенда",
    imgSrc: "/images/project-preview/cover-legenda.png",
    intro: "",
    focus: "",
    area: "",
    role: "",
    sections: [],
  },
];

export const findProject = (list: Project[], slug: string) =>
  list.find(p => p.slug === slug);
