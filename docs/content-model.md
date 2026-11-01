# Content model

All site copy, links and image references live in TypeScript:

- `src/cms/content.ts` — `SiteContent` type + `defaultContent`
- `src/data/projects.ts` — `Project` / `CaseSection` types + `defaultProjects`
- `src/data/process.ts` — `designProcess` (the 5 design-process steps)

`ContentProvider` serves `defaultContent` as-is; components read it via `useContent()`. To change the site, edit these files and rebuild. (`content-new.json` in the repo root is an obsolete draft — ignore it.)

## `SiteContent` schema (src/cms/content.ts)

```ts
type ImageSlot = { label: string; src?: string; position?: string; href?: string };
//  label    → placeholder caption + (hover name in Showcase). Not used as <img alt> (alt is "").
//  src      → image URL (public/ path like "/images/…"). Omitted ⇒ grey shimmering placeholder.
//  position → CSS object-position for off-centre crops ("left center", "20% center")
//  href     → makes the Showcase tile an external link (new tab)

type SiteContent = {
  meta:   { name; title };                       // → document.title "name — title"
  hero:   { line1; line2; subtitle; cards: ImageSlot[] };   // 7 cards in the fan
  showcase: { intro: string; focal: ImageSlot; cards: ImageSlot[] }; // WorkMarquee: intro + focal and cards in one strip
  philosophy: { statement: string; cards: { title: string; body: string }[] };
  services: { intro; items: { icon: "figma"|"react"|"notion"; title; body; deliverables: string[] }[] };
  journey:  { intro; steps: { title; body }[] };            // client-facing engagement process
  packages: { intro; items: { name; price; timeline; blurb; features[]; highlighted? }[]; note };  // section disabled
  testimonials: { intro; items: { quote; name; role; project }[] };   // name may be "" (pending approval)
  faq: { q; a }[];
  background: { intro: string[]; stats: { value; label }[] };         // "About Me"
  skills: { process: ProcessStep[]; groups: { index; label; tags[] }[] };  // only `groups` is rendered
  resume: { description; pdfUrl };                // Resume component is not mounted
  projects: Project[];
  contact: { intro; socials: {label;href}[]; email };
  footer:  { name; socials: {label;href}[] };
};
```

### Where each field is rendered

| Field | Component | Notes |
|---|---|---|
| `meta` | `App.useDocTitle` | `index.html` has its own static `<title>` + description (different wording) |
| `hero.*` | `Hero` | `line1` small tracking-wide line, `line2` big `font-pixel` line. `hero.cards` is **no longer rendered** (the card fan was removed in the redesign); kept in data in case it comes back |
| `showcase.*` | `WorkMarquee` | `intro` under the heading; `focal` + `cards` become one strip. A card with `href` gets a **Visit** button on hover and opens in a new tab; without it the card is not clickable. (Disabled `Showcase` used `focal` as the centre of a 3×3 grid.) |
| `philosophy` | `Philosophy` | `statement` lights up word by word on scroll; `cards[1]` (odd index) renders as the filled blue card |
| `services` | `Services` | `icon` picks a brand SVG from `BrandIcons.tsx` (the keys are arbitrary: figma / react / notion) |
| `journey` | `Journey` | numbered 01…NN timeline |
| `packages` | `Packages` (disabled) | |
| `testimonials` | `Testimonials` | Section hidden if `items` is empty. Texts are **drafts** — see the NOTE in `content.ts`; names are empty until clients approve |
| `faq` | `Faq` | First item opens by default |
| `background` | `Background` | `intro` = paragraphs, `stats` = big numbers strip |
| `skills.groups` | `Skills` | Each group → a marquee of `Badge` chips; `index` shown as "01/02/03" |
| `skills.process` | — | Not rendered anywhere currently (kept so the process can be reused) |
| `resume` | `Resume` (not mounted) | `pdfUrl` points to `/resume.pdf` which **does not exist** in `public/` |
| `projects` | `CaseStudies` (cards) + `CaseStudy` (pages) | See below |
| `contact.intro/socials` | `WorkWithMe` | `contact.email` used for the `mailto:` fallback |
| `footer` | `Footer` | |

## Projects & case studies (src/data/projects.ts)

```ts
type Project = {
  slug: string;            // URL: /case-studies/:slug
  title: string;           // long, sentence-style headline (also the card title)
  tag: string;             // short badge: "Auk", "LegalTech", "SaaS"…
  tagTone: "neutral" | "dark" | "accent";
  year: string;
  live: boolean;           // true ⇒ has a detail page. false ⇒ "Coming soon" card, route redirects to "/"
  cardDesc: string;        // shown in the slider card
  imgLabel: string; imgSrc?: string;   // slider card image
  intro: string; focus: string; area: string; role: string;   // case-study cover (empty for non-live)
  sections: CaseSection[]; // body of the case study
  gallery?: { label; src?; position? }[];  // "A closer look" horizontal gallery; falls back to section images
};

type CaseSection = {
  id: "problem" | "solution" | "outcome";   // MUST be these three: navbar anchors #problem/#solution/#outcome
  eyebrow: string; heading: string; body: string[]; bullets?: string[];
  image?: string; imageSrc?: string;        // image label + src after the section (ParallaxImage)
  process?: { step; detail? }[];            // → ProcessTimeline
  metrics?: { value; label }[];             // → MetricGrid (1–4 columns)
};
```

Current projects:

| slug | tag | year | live | card image |
|---|---|---|---|---|
| `auk-iot-plant-app` | Auk (dark) | 2025–2026 | ✅ | `Auk-Preview.png` |
| `legal-sales-platform` | LegalTech (accent) | 2025 | ✅ | `limon.png` |
| `saas-ops-dashboard` | SaaS | 2025 | ❌ | `macbook-finora.png` |
| `ecommerce-checkout` | E-commerce | 2024 | ❌ | `macbook-pizza.jpg` |
| `legenda-real-estate` | Real Estate (dark) | 2024 | ❌ | `cover-legenda.png` |

Non-live projects have `intro/focus/area/role = ""` and `sections: []`.

### Recipes

- **Add a live case study:** append a `Project` with `live: true`, a unique `slug`, and `sections` containing the three ids `problem`, `solution`, `outcome`. Add images to `public/images/…` and reference as `/images/…`. It appears automatically in the slider and in the "Next case study" rotation.
- **Publish a "coming soon" project:** fill in `intro/focus/area/role/sections`, set `live: true`.
- **Replace a placeholder with a real image:** add `src` to the `ImageSlot`. No layout change needed.
- **Make a marquee card clickable:** add `href` to that card in `showcase` (only the Auk website has one now).
- **Change the section order or remove a section:** edit `src/pages/Home.tsx` (and the Navbar `homeLinks` if it has a nav entry).
- **Re-enable Pricing:** uncomment `import Packages` + `<Packages />` in `Home.tsx` and the `Pricing` entry in `Navbar.tsx` `homeLinks`. Data is already in `content.packages`. Note `FAQ` copy mentions the price ranges.

### Content facts worth knowing

- Stats claim "3+ yrs Engineering", "10+ Shipped projects", "2 Apps in app stores".
- Prices quoted in FAQ and Packages must stay consistent: Landing from $500 (1–2 wk), Website/store from $1,500 (3–5 wk), App MVP from $3,000 (6–10 wk).
- Contact channels: Fiverr, Telegram, LinkedIn, email (+ GitHub in the footer only). Contact data is duplicated between `contact.socials` and `footer.socials`.
- Testimonial quotes are marked as drafts needing client approval.
