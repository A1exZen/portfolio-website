# Overview

## What this is

A personal portfolio / lead-generation site for **Alex Zenchik**, a freelance product designer + developer ("I design & build websites & apps — from idea to launch"). Goal of the site: convert visitors into project enquiries via the "Start Your Project" form at the bottom of the home page.

- Language of the UI/copy: **English** (one project name is Russian: «Легенда»).
- Pages: `/` (home) and `/case-studies/:slug` (case study detail). Nothing else.
- Deployed on **Vercel** (project is linked: `.vercel/` exists locally, git-ignored).

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 18.3 + TypeScript 5.7 (strict) | `noUnusedLocals`, `noUnusedParameters` on |
| Bundler | Vite 6 + `@vitejs/plugin-react` | `server.fs.strict = false` (project path contains `:`) |
| Styling | Tailwind CSS **v4** via `@tailwindcss/vite` | No config file; `@theme` block in `src/index.css`. v4 class syntax is used (`w-(--card)`, `max-w-88`, `aspect-16/10`, `z-999`, `min-h-150`) |
| Animation | `motion` 11 (`motion/react`, the Framer Motion successor) | Scroll-linked values, springs, `whileInView` |
| Smooth scroll | `lenis` 1.3 | Singleton in `src/lib/lenis.ts`, started in `useSmoothScroll` |
| Routing | `react-router-dom` 6 (`BrowserRouter`) | Two routes |
| Backend | One Vercel **Edge Function** `api/contact.ts` | Forwards form to Telegram Bot API |
| Fonts | Google Fonts: **Inclusive Sans** (body), **Space Grotesk** (`font-pixel`) | Loaded from `index.html` |
| Tooling | `vercel` CLI as devDependency | for `vercel dev` (needed to test `/api/contact` locally) |

Not present: tests, ESLint/Prettier config, CI, i18n, analytics, SEO tags beyond `index.html` title/description, `vercel.json`, router-level code splitting.

## Commands

```bash
npm run dev        # vite dev server (plain Vite: /api/contact will NOT work)
npm run build      # tsc && vite build  → dist/
npm run preview    # serve dist/
npx vercel dev     # dev server + the edge function (needs .env.local with Telegram vars)
```

`.claude/launch.json` defines a `dev` configuration: `./node_modules/.bin/vite --port 5188`.

## Folder map

```
api/
  contact.ts              Vercel Edge Function — form → Telegram
docs/                     ← this documentation
public/
  logo.png                favicon + navbar avatar
  vite.svg                unused leftover
  images/
    auk-shots/            Auk app screenshots (01-pair, 02-schedule, 03-settings, 04-garden, website)
    project-preview/      cards/covers: Auk-Preview, AukWebsite, PeakLog, cover-legenda, landing-build,
                          landing-hanzo, landing-landio, limon, macbook-finora, macbook-pizza.jpg
    notion.png            Notion icon used by BrandIcons (services card)
src/
  main.tsx                React root: StrictMode → BrowserRouter → ContentProvider → App
  App.tsx                 App shell: ScrollToTop, PageTransition, Navbar, BottomFade, <Routes>
  index.css               Tailwind import, @theme tokens, global CSS (Lenis, wavy underline, placeholder, marquee)
  cms/
    content.ts            SiteContent type + defaultContent (ALL copy/links/images)
    ContentProvider.tsx   React context that serves defaultContent (no persistence)
  data/
    projects.ts           Project / CaseSection types + the 5 projects (2 live case studies)
    process.ts            designProcess steps (shared)
  pages/
    Home.tsx              Section composition (+ pinned hero wrapper)
    CaseStudy.tsx         Case study detail template
  components/             Sections + shared pieces (see components.md)
    ui/                   Small primitives: Badge, Dots*, IconButton*, Marquee, MetricGrid, ProcessTimeline, ZigZag (*currently unused since the work slider became a grid)
  design-system/
    tokens.ts             JS mirror of tokens (colors, radius, shadow, ease, spring, duration)
  hooks/
    useSmoothScroll.ts    Starts Lenis + anchor-link easing
    useIsNarrow.ts        max-width media query hook (default 640)
  lib/
    lenis.ts              Module-level Lenis singleton (get/set)
content-new.json          STALE: an old content draft (different hero copy). Not imported anywhere.
.env.example              TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
```

## Page anatomy (home)

Order in `src/pages/Home.tsx`:

1. **Hero** — pinned (sticky) for extra scroll length; content below slides over it
2. **WorkMarquee** `#builds` — endless left→right strip of project screenshots, slows on hover (replaces the pinned 3×3 **Showcase**, which is commented out)
3. **Services** `#services`
3b. **Philosophy** `#philosophy` — scroll-lit statement + two cards
4. **CaseStudies** `#work` — 3-column card grid
5. **Journey** `#process` — scroll-drawn timeline
6. ~~Packages `#pricing`~~ — disabled (commented out in Home and Navbar)
7. **Testimonials** `#testimonials`
8. **Background** `#background` (nav label "About")
9. **Skills** `#skills` — marquees
10. **Faq** `#faq`
11. **WorkWithMe** `#start-project` — the form
12. **Footer**

Global overlays: fixed **Navbar** (pill), **BottomFade** (blur strip), **PageTransition** (soft fade veil on route change).

Details per piece: [components.md](components.md).
