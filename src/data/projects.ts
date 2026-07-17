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
  /** Extra screens for the case study's "closer look" horizontal gallery —
   * independent of each section's single hero image, so a project with a lot
   * of supporting material isn't limited to just its three hero shots. Falls
   * back to the section images when omitted. */
  gallery?: { label: string; src?: string; position?: string }[];
};

export const defaultProjects: Project[] = [
  {
    slug: "auk-iot-plant-app",
    title:
      "Giving a smart garden device its entire software experience — from first pairing to a daily habit",
    tag: "Auk",
    tagTone: "dark",
    year: "2025–2026",
    live: true,
    cardDesc:
      "Auk sells a smart indoor garden — but had no app to control it. I designed the mobile UX and built the React Native app end to end, from Bluetooth pairing to multi-device management.",
    imgLabel: "Auk",
    imgSrc: "/images/project-preview/Auk-Preview.png",
    intro:
      "Auk (auk.com) sells the Auk Mini 2, a smart indoor garden — but the device had no software experience at all before this project. Working with Auk's product lead over about three months, I designed and built the entire companion app from scratch: onboarding, Bluetooth pairing, light scheduling, and multi-device management. The device's own firmware was engineered by Auk's hardware team; my scope was everything a customer actually touches, from the first pairing screen to the daily habit of checking on their plants.",
    focus: "Mobile UX · React Native · BLE Integration",
    area: "Consumer Hardware / IoT",
    role: "Product Designer & Developer",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        heading: "A beautiful device with nothing to talk to it",
        body: [
          "The Auk Mini 2 was a finished physical product with zero software behind it — no way to pair, no way to see the light schedule, no way to know if a device left unattended for a week was actually still running. Households with more than one Auk had no shared way to manage them either.",
          "The real difficulty wasn't drawing screens — it was trust. Bluetooth pairing had to succeed on the first try with no support call as a fallback, and every screen had to reflect the device's true live state rather than an optimistic guess, because a plant that goes unwatered for a week doesn't forgive a UI bug.",
        ],
        image: "07 — Not Available (connection error)",
        imageSrc: "/images/auk-shots/01-pair.png",
      },
      {
        id: "solution",
        eyebrow: "The solution",
        heading: "A guided path from first pairing to a habit that runs itself",
        body: [
          "I owned the entire software experience — onboarding, Bluetooth pairing, the light-scheduling interface, multi-device management, and the React Native app itself — while Auk's own hardware engineer handled the firmware I connected to over BLE. That split let me focus entirely on how the product feels to actually use.",
          "Pairing is a single guided flow: discover the device, confirm the connection, done — no manual setup and no settings menu required before the first light ever turns on. The light schedule is a custom timeline rather than a generic time picker, so a full day of care reads at a glance.",
          "I designed the Growth Mode system — three presets (Herbs & Salads, Fruits & Veggies, Slow) that translate day-to-day plant care into a single tap, with the reasoning always visible if someone wants to understand what changed. For households running more than one Auk, I built a 'Your gardens' view so every device is a named, individually manageable card instead of a single hard-coded connection.",
        ],
        bullets: [
          "Bluetooth pairing reduced to one guided flow",
          "Custom light-scheduling timeline",
          "Growth Mode: three presets that translate plant care into one tap",
          "Multi-device 'Your gardens' dashboard for households with more than one Auk",
          "Live state cards that degrade gracefully on delayed sensor data",
        ],
        image: "06 — Dashboard, light on",
        imageSrc: "/images/auk-shots/02-schedule.png",
      },
      {
        id: "outcome",
        eyebrow: "The outcome",
        heading: "A daily habit, not a pairing demo",
        body: [
          "The app is in daily use by Auk customers, live on iOS and Android. Real households surfaced edge cases no design review could — spotty apartment Wi-Fi, a device left mid-schedule, someone renaming their garden mid-onboarding — and working directly with Auk's product lead, I iterated until pairing and scheduling felt dependable rather than flaky.",
          "Because one person owned every screen end to end, there was no handoff between what was designed and what shipped on the software side — the app a customer opens today is the one I both designed and built.",
        ],
        metrics: [
          { value: "~3 months", label: "First call → shipped" },
          { value: "React Native", label: "Stack" },
          { value: "BLE pairing", label: "Core integration" },
          { value: "Software: 1 person", label: "Hardware: Auk's own team" },
        ],
      },
    ],
    gallery: [
      { label: "21 — website", src: "/images/auk-shots/website.png" },
      { label: "22 — Scanning for device", src: "/images/auk-shots/04-garden.png" },
      { label: "20 — Discover nearby devices", src: "/images/auk-shots/03-settings.png" },
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
    imgSrc: "/images/project-preview/limon.png",
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
    live: false,
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
      "Rebuilding a mobile checkout from six steps to three — designed and built solo",
    tag: "E-commerce",
    tagTone: "neutral",
    year: "2024",
    live: false,
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
