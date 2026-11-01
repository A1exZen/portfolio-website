# Architecture

## Boot sequence

```
index.html  →  /src/main.tsx
  React.StrictMode
    BrowserRouter
      ContentProvider            (src/cms/ContentProvider.tsx)
        App                      (src/App.tsx)
```

`App` renders, in order:

```tsx
<ScrollToTop />        // scroll reset / hash chasing on navigation (renders null)
<PageTransition />     // fixed full-screen fade veil, z-999
<Navbar />             // fixed pill nav, z-50
<BottomFade />         // fixed blur strip, z-40
<main>
  <Routes>
    "/"                     → <Home />
    "/case-studies/:slug"   → <CaseStudy />
  </Routes>
</main>
```

Also in `App`: `useSmoothScroll()` (start Lenis) and `useDocTitle()` (sets `document.title` to `"{meta.name} — {meta.title}"`).

There is no 404 route. `CaseStudy` redirects unknown or non-`live` slugs to `/` with `<Navigate replace />`.

## Data flow

All content flows through one React context:

```
src/cms/content.ts  defaultContent  ──►  ContentProvider (value)  ──►  useContent() in components
src/data/projects.ts defaultProjects ─┘   (embedded as content.projects)
src/data/process.ts  designProcess   ─┘   (embedded as content.skills.process)
```

- `useContent()` returns the whole `SiteContent`. Components pick the slice they need (`const { hero } = useContent()`).
- The provider is intentionally static: no localStorage, no fetch, no editing UI. "Editing the site" = editing `content.ts`. See [content-model.md](content-model.md).
- Components that are NOT content-driven (copy hard-coded in the component) are listed in [redesign-notes.md](redesign-notes.md#hard-coded-copy-outside-the-content-model).

## Routing & navigation behaviour

Three cooperating pieces handle navigation. They interact, so change them together:

1. **`PageTransition`** (`components/PageTransition.tsx`)
   - A document-level click listener intercepts clicks on same-origin `<a>` elements (left click, no modifier keys, not `target=_blank`, not `download`).
   - If the link's `pathname` differs from the current one, it `preventDefault()`s, stores the target href, and runs a phase machine: `idle → covering → revealing → idle`.
   - `covering`: a full-screen `bg-cloud` veil fades in (320ms, ease `[0.22,1,0.36,1]`). Then it calls `navigate(href)`, scrolls to 0 immediately via Lenis, waits `HOLD_MS` (60ms), and `revealing` fades the veil out (480ms) while `<main>` gets a WAAPI nudge from `translateY(18px)`/opacity 0.6 to rest (skipped under reduced motion). The old 5-panel ink curtain with the "AZ" monogram was removed in the redesign.
   - Same-pathname links (hash links on the same page) are ignored here and handled by Lenis.
2. **`useSmoothScroll`** (`hooks/useSmoothScroll.ts`)
   - Creates the Lenis instance (`lerp 0.085`, `smoothWheel`, `syncTouch`) and stores it in `lib/lenis.ts`. Disabled when `prefers-reduced-motion: reduce` (then `getLenis()` is `null` and callers fall back to native scrolling).
   - Click listener upgrades same-path `a[href*="#"]` links to eased `lenis.scrollTo(target, { offset: -96 })` + `history.pushState`.
3. **`ScrollToTop`** (`App.tsx`)
   - Sets `history.scrollRestoration = "manual"`.
   - On every `pathname`/`hash` change: if there is a hash **and** it is not the first render, wait 350ms (the veil hides the jump) then `lenis.scrollTo(el, { offset: -96, immediate: true })`. Otherwise scroll to top immediately.
   - First render always lands at top, because the sticky hero and its entrance animation assume scroll 0. So a pasted `/#faq` URL does **not** jump to the FAQ.

Cross-route anchors (e.g. case study CTA `Link to="/#start-project"`, navbar `href="/#work"` from a case study) pass through `PageTransition` (pathname differs) → navigate with hash → `ScrollToTop` chases the hash.

Navbar link sets switch by route: home → `#services, #work, #background, #faq` (as `/#…`), case study → `#problem, #solution, #outcome`.

## Scroll engine

- **Lenis** drives window scroll (rAF loop). It sets `html.lenis` classes styled in `index.css`.
- **Motion** `useScroll` reads native window/element scroll progress, which Lenis feeds via real scroll events — so all `useScroll`/`useTransform` effects work unchanged.
- `html { scroll-behavior: smooth }` is set in CSS but overridden to `auto !important` when `.lenis-smooth` is active.

See [animation-and-scroll.md](animation-and-scroll.md) for every pinned/parallax section.

## Rendering conventions

- Every section is a top-level `<section id="…" className="bg-white|bg-cloud py-24 sm:py-28">` containing a centered container `mx-auto max-w-{2xl|3xl|5xl|6xl} px-6`, starting with `<SectionHeading>`.
- Sections alternate `bg-white` and `bg-cloud` backgrounds; `ZigZag` SVG edges knit the hero into the first white section and the case-study cover into the body.
- Reveal-on-scroll is done per element with `<Reveal>` (`whileInView`, **`once: false` by default → animations replay each time an element re-enters the viewport**).
- Hover/tap micro-interactions use Motion `whileHover`/`whileTap` with springs.
- Images go through `Placeholder` (renders `<img>` when `src` is set, otherwise a shimmering grey placeholder).

## Error handling & edge cases

- Contact form: failures show an inline error with a `mailto:` fallback prefilled from the form.
- `Testimonials` and `Faq` return `null` when their arrays are empty.
- `Showcase` (currently disabled) returns `null` below 640px (see `useIsNarrow`).
- Case study gallery requires ≥ 2 images, else it's omitted.
