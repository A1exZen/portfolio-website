# Design system (as implemented today)

This documents the current visual language so the redesign can consciously keep or replace each piece. There is no Figma file referenced in the repo.

## Tokens

Source of truth: `src/index.css` → `@theme`. `src/design-system/tokens.ts` mirrors them for JS use (inline styles / Motion), but **only `spring` is actually imported** (by `IconButton`); most components inline their own numbers.

### Colour

| Token (Tailwind) | Hex | Use |
|---|---|---|
| `ink` | `#111113` | Text, dark surfaces (page-transition panels, CTA card, inverted pricing card, dark badges) |
| `muted` | `#6b7280` | Defined, barely used |
| `accent-deep` | `#1660e8` | Large filled surfaces with white text: footer, the blue philosophy card (white on it ≈ 5.4:1; plain `accent` is only ≈ 3.8:1) |
| `cloud` | `#ececed` | Hero + alternate section backgrounds, card fills, `body` background |
| `paper` | `#f4f4f5` | Defined, barely used |
| `accent` | `#2b7fff` | Primary CTA, links, highlights, icons, timeline, focus rings (`accent/30–40`) |
| `accent-strong` | `#1a6dff` | Accent hover |
| white | `#fff` | Section backgrounds, cards, nav pill (`white/85`) |

Text opacity ladder on ink: `/75` strong body, `/70`, `/60` standard body, `/55`, `/45`, `/40` eyebrow/labels. Borders/rings: `ring-black/5`, `/8`, `/10`. Hard-coded hexes outside tokens: `ZigZag` `fill="#ffffff"`, wavy underline SVG `#111113`, `BottomFade` `rgba(236,237,237,…)` (= cloud), Tailwind `red-600` for form error, traffic-light dots.

**Single accent hue, neutral greyscale, no dark mode** (`color-scheme: light`).

### Typography

| Role | Font | Where |
|---|---|---|
| Body / headings default | **Inclusive Sans** (400–700, italic 400) | `font-sans` on body; headings use `font-black tracking-tight` (weight 900 is not loaded → renders as 700) |
| Display ("pixel") | **Space Grotesk** (400–700) via `.font-pixel` (`letter-spacing:-0.01em`) | Hero line 2, section headings (uppercase, `tracking-wide`), big numbers, step numbers, price. Despite the name it is **not** a pixel font |

Common scale (Tailwind): section heading `text-3xl sm:text-4xl`; card titles `text-xl sm:text-2xl font-black`; body `text-lg leading-relaxed text-ink/60`; eyebrow `text-sm font-bold uppercase tracking-[0.2em] text-ink/40`; hero fluid `clamp()` sizes (see components.md).

### Radius / shadow / spacing

- Radius: pills `rounded-full` (buttons, nav, badges, dots); cards `rounded-3xl` (24px) or `rounded-[1.75rem]`/`[2.5rem]` for big ones; inputs `rounded-2xl`; images `rounded-2xl/3xl`. (`tokens.ts` radius: 12/16/24/28/999.)
- Shadows: soft large drops, e.g. `0_8px_30px_rgba(0,0,0,.10)` (nav), `0_24px_60px_rgba(0,0,0,.10)` (card hover), `0_20px_50px_rgba(0,0,0,.18)` (hero cards), `0_40px_90px_rgba(0,0,0,.28)` (showcase focal).
- Section rhythm: `py-24 sm:py-28`; containers `max-w-2xl…6xl px-6`; headings → content gap `mt-10…16`; card grids `gap-5`; slider gap `gap-6`.

## Layout & responsive rules

- Mobile-first with Tailwind defaults: `sm 640`, `md 768`, `lg 1024`. No custom breakpoints. Almost all structural changes happen at `sm` and `md`.
- Hero: no cards any more; the thread ball scales with the viewport; hero and case-cover text is white on the dusk-navy sky.
- `WorkMarquee` cards are `clamp(17rem, 30vw, 27rem)` wide; Selected Work grid is 1 / 2 (`sm`) / 3 (`lg`) columns.
- Navbar link row appears at `md`; below that a hamburger panel.
- Page never scrolls horizontally: `body { overflow-x: hidden }`; wide things live in their own overflow containers (slider, marquees, gallery).
- Hero sizes are `min(vw, vh)` based so layout survives short/zoomed viewports.

## Motion language

Everything shares one easing: **`cubic-bezier(0.22, 1, 0.36, 1)`** (expo-out) — `ease.out` in tokens.

| Pattern | Spec |
|---|---|
| Reveal on scroll | `opacity 0→1`, `y 24→0`, 0.7s, viewport margin −80px, `once: false` (repeats) |
| Section heading | `y 22→0`, 0.6s, margin −60px |
| Hover lift on cards | `whileHover { y: -6…-8 }` spring `stiffness 300, damping 24` + shadow/ring swap to accent |
| Buttons | `whileHover scale 1.04`, `whileTap 0.96` |
| Snappy small controls | spring `400 / 15` (nav links, icon buttons) |
| Layout resize (nav pill) | spring `220 / 28` |
| Page transition | 5 panels, 0.62s, stagger 0.06, ease `[0.83,0,0.17,1]` |
| Scroll-linked | parallax y offsets, pinned sections, scaled focal card, drawn lines, horizontal gallery |
| Marquee | 26s linear loop, CSS keyframes |
| Placeholder sheen | 3.8s diagonal highlight loop |

`prefers-reduced-motion`: Lenis is not created; CSS animations/transitions clamp to 0.01ms; placeholder sheen hidden. Motion's scroll/reveal animations are **not** disabled (no `useReducedMotion` usage).

## Recurring UI patterns

- **Section header:** centered `SectionHeading` (uppercase Space Grotesk + hand-drawn wavy underline via `.wavy::after` SVG background) then a centered intro paragraph `max-w-xl/2xl text-lg text-ink/60`.
- **Card:** `rounded-3xl`, `bg-cloud` on white sections / `bg-white` on cloud sections, `ring-1 ring-black/5`, hover lift + `ring-accent/30`.
- **Pill CTA:** `rounded-full bg-accent px-7 py-3.5 font-bold text-white shadow-lg hover:bg-accent-strong`; secondary = white with `ring-black/10`; dark = `bg-ink`.
- **Checklist rows:** small accent ✓ SVG + `text-[15px] font-semibold text-ink/75`.
- **Badges/chips:** `bg-black/5 text-ink` rounded-full (`Badge`).
- **Jagged seams:** `ZigZag` sawtooth where the hero meets content and under case-study covers.
- **Hand-drawn accents:** wavy underlines (headings, nav link hover `decoration-wavy`, contact links).
- **Parentheses hover** on the nav CTA: `( Start a Project )`.
- **Pinned scroll scenes:** hero, case-study horizontal gallery, process-timeline step numbers.
- **Placeholder imagery:** every image slot degrades to a grey shimmering block, so layouts work with missing screenshots.

## Image handling

- All images are static files in `public/images/**`, referenced by absolute path (`/images/...`).
- No `srcset`, no `<picture>`, no WebP/AVIF; mostly large PNG screenshots (check file sizes before adding more).
- `Placeholder` sets `loading="lazy"` and `alt=""` (decorative) — meaningful alt text is missing everywhere.
- Use `position` (object-position) per slot for non-centred crops.

## Accessibility baseline (current)

Good: semantic `section/h1–h3/article/figure/blockquote/footer`, `aria-label`/`aria-expanded` on the menu and FAQ, `aria-hidden` on decoration, form labels wrap inputs, visible focus ring on form fields (`focus:ring-accent/40`).
Gaps: empty `alt` on content images, no skip link, link text colour contrast of `ink/40`–`/55` on white/cloud is low, no focus-visible styling on many buttons/links, Motion animations ignore reduced-motion, wavy-underline-only hover affordance, page transition intercepts all internal links (keyboard/middle-click are handled, but the curtain has `aria-hidden`).
