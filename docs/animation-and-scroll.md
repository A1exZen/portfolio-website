# Animation & scroll reference

The riskiest part of any redesign: several sections are **pinned** with sticky wrappers whose heights are tied to hard-coded viewport multiples. Change one number and neighbours shift.

## Scroll stack

```
Lenis (rAF loop, lerp 0.085, syncTouch)  →  native scroll events  →  Motion useScroll / useTransform
```

- Instance: `lib/lenis.ts` (`getLenis()` may be `null` under reduced motion → always null-check, fall back to `window.scrollTo`).
- Anchor offset convention: `-96` px (below the floating nav); case-study sections use `scroll-mt-28`.
- `ScrollToTop` forces scroll 0 on first load and on route change; browser scroll restoration is disabled.

## Pinned / scroll-driven scenes

### 1. Home hero pin (`pages/Home.tsx` + `components/Hero.tsx`)
- Track `h-[165vh]`; inner `sticky top-0 h-screen overflow-hidden` holds `<Hero/>`.
- Content after the hero uses `relative z-10 mt-[calc(-65vh-7rem)]`. The 65vh is the pinned stretch; the extra `7rem` (`HERO_SEAM` in `Hero.tsx`) starts the content above the fold so the zigzag seam is visible on first paint, like the reference site. Hero keeps `padding-bottom: HERO_SEAM` so its text never sits under the seam.
- Because the hero is sticky, its own box doesn't move during the pin. The exit is driven by **page** scroll: `progress = min(1, scrollY / (0.65 * innerHeight))` → headline `y 0→−90px`, `scale 1→0.92`, `opacity 1→0` (over 0–0.8), backdrop `scale 1→1.12`.
- Backdrop: `HeroBackdrop.tsx` is a dusk-navy radial gradient (`#34457f` glow at the bottom → `#151c3d` at the top; dark but not black) with `HeroSky.tsx` on top, lazy-loaded (three.js, ~115 KB gzip, separate chunk). A transparent WebGL canvas draws, all at real depths:
  - 2300 stars of widely varied size (`0.6 + rand³·6.5`, point size capped at 12px) in 5 colours between 8 and 272 units away, spread evenly in log-distance (many near, far ones thin into dust). They drift toward the camera in log-distance (`DRIFT = 0.02`/s) and wrap at the far end where they fade in, so the sky zooms forever without a seam. Each star keeps a fixed screen direction (position attribute = direction x, y + depth phase; world position is built in the vertex shader). Depth cues: far stars hold a ~2px floor and fade instead of shimmering, dim with haze and shift blue; near ones are softer (bokeh) and fade right at the lens. ~32% of stars form a faint diagonal band of tiny bluish stars (a distant galaxy).
  - Rocket (`buildRocket.ts`, procedural toy model: white lathe body, red nose, 3 fat red fins, blue collar, blue porthole with a glass dome, additive orange flame; it sways ±0.5 rad so the porthole mostly faces the viewer) on a plane glued to the camera, so it ignores scroll parallax. Modes: *cruise* (steers along a Lissajous loop), *drag* (grab it with the mouse: spring-follow, `pointer-events` on the canvas toggle on only while the cursor is over it), *coast* (release = throw: velocity kept, friction 0.985/frame, soft bounce off the edges, back to cruise below 0.045). A tap without moving = boost. Flame length follows speed; sparks pool (170 points) trails behind; stars in a 0.4-NDC radius are pushed aside and brighten (`uRocket`, `uPush` in the star shader). Mouse/pen only: touch just watches it fly. Reduced motion: static rocket.
  - Colour clouds are two CSS radial gradients in `HeroBackdrop` (WebGL nebula quads showed hard disc edges and were dropped).
  - one comet / shooting star every 5-12s (thin streak with a bright head, 1.5s, spawned near the camera).
  - Stars are spread over the camera's visible area at their depth (frustum-fitted), so none are wasted off screen. Each has its own twinkle pace (most slow, a few fast), and the whole field sways slowly (`rotation.z = sin(t·0.04)·0.03`).
  - Calm zone: in the fragment shader, star alpha is multiplied by `mix(0.22, 1, smoothstep(0.12, 0.55, distance from the headline area))`, so the sky stays quiet behind the text and is brightest at the edges (`uRes` uniform = drawing-buffer size).
  - Parallax is real: the camera follows the pointer (`±1.1 / ±0.7`) and lifts with scroll (`scrollY × 0.0065`), eased at 0.04/frame, so near things move more than far ones.
  - Pointer is read on `window` (passive); the canvas is `pointer-events-none`, so hero text and buttons are normal.
  - The loop pauses when the tab is hidden or `scrollY > 1.3 × innerHeight`. Reduced motion: one static frame, no listeners.
  - The earlier thread-ball version (spring physics, click shockwave, drag spin) was removed; see git history if it comes back.
- Constraint: the Hero must fit in `100vh − 7rem` (it is `h-full`, content centred).

### 2. Showcase (`components/Showcase.tsx`) ⏸ disabled
- Commented out in `Home` and replaced by `WorkMarquee` (see below). Kept for a possible return.
- Section `height: 320vh`, inner `sticky top-0 h-screen`. Progress 0–1: focal scale/radius/shadow over 0–0.6; cells rise during 0.42–0.80; grid drifts up −120px over 0.72–1. Skipped `< 640px`.

### 2b. Work marquee (`components/WorkMarquee.tsx`)
- Not scroll-linked: `useAnimationFrame` moves a motion value `x` left→right at 48 px/s; hovering eases the speed toward 9 px/s (lerp over ~300ms), leaving restores it.
- The list renders twice; loop length = `scrollWidth / 2` (re-measured with `ResizeObserver`); `x` starts at `−half` and wraps by `−half` when it reaches 0.
- Reduced motion: the strip stops and the wrapper becomes `overflow-x-auto`.

### 2c. Philosophy statement (`components/Philosophy.tsx`)
- `ScrollLitText`: `useScroll({ target: p, offset: ["start 0.85","end 0.45"] })`; each word's opacity goes `0.14 → 1` over its slice `[i/n, (i+1)/n]` of the progress (Apple-style read-along).

### 3. Journey timeline (`components/Journey.tsx`)
- `useScroll({ target: ol, offset: ["start 0.75","end 0.55"] })` → `useSpring(…, 90/26)` → `scaleY` of the accent line (origin top). Milestone number and text reveal via `whileInView` with `i*0.1` stagger.

### 4. Case-study cover parallax (`pages/CaseStudy.tsx`)
- Target = cover div; offsets `start start → end start`. Title −90, intro −55, meta −24 px; whole cover content opacity 1→0 over 0–0.85. The cover reuses `HeroBackdrop`  and is `min-h-[calc(100vh-7rem+42px)]` (`+60px` from `sm`) so its zigzag lands at the same height as the home seam.

### 5. Case-study images (`ParallaxImage`)
- `offset: ["start end","end start"]`, inner image `y: −9% → 9%`, height 118% so edges never show.

### 6. Case-study horizontal gallery (`HorizontalGallery`)
- Section height `calc(100vh + distance*1.5px)` (1.5× slows the sideways travel); sticky 100vh stage; track `x: 0 → −distance`, `distance = scrollWidth − innerWidth + 48` re-measured on resize and `images.length` change (not on image load — if lazy images change the width, re-measure).

### 7. Process timeline (`ui/ProcessTimeline`)
- Each row: `offset ["start 0.85","start 0.35"]` → opacity 0.25→1, y 24→0, number scale 0.85→1. Numbers are `sticky top-24/28`.

## Non-scroll animations

| What | Where | Notes |
|---|---|---|
| Hero text entrance | `Hero` | line1 0.8s, line2 +0.12, subtitle fade +0.35, CTAs +0.5 |
| Hero sky | `HeroSky` | see section 1 |
| Case card hover | `CaseStudyCard` | spring lift −10px, rotate ±1.6° (alternates by index), scale 1.015 |
| Philosophy cards | `Philosophy` | hover lift −8px, rotate ±1° |
| Footer wordmark | `Footer` | giant name rises 45%→18% once in view |
| Navbar intro + expand | `Navbar` | intro once per session; links expand after 40px scroll using `layout` |
| Page veil | `PageTransition` | cloud-coloured fade, see [architecture.md](architecture.md) |
| FAQ expand | `Faq` | `height: auto` AnimatePresence, 0.35s |
| Marquees | `ui/Marquee` + keyframes in `index.css` | pure CSS |
| Metric cards | `ui/MetricGrid` | variants with stagger 0.09 |
| Placeholder shimmer | `.placeholder-fill::after` | 3.8s loop |
| Form sent state | `WorkWithMe` | `AnimatePresence mode="wait"` swaps form ↔ confirmation |

## Gotchas

- `Reveal`/`SectionHeading`/`Journey`/`MetricGrid` use `once: false` → they **replay on every re-entry**. Intentional "alive" feel, but costs repaint and can feel busy; change to `once` in one place (`Reveal` default) for a calmer page.
- `App` wraps everything in `<MotionConfig reducedMotion="user">`, so Motion skips transform animations (floats, tilts, entrances) for reduced-motion users. Scroll-linked `style` transforms still apply.
- Many elements animate while another sticky parent transforms them; `will-change` is only set on the gallery track. If you add blur/backdrop to pinned scenes check performance.
- `BottomFade` and the Navbar use `backdrop-filter` over scrolling content — expensive on low-end devices.
- `Showcase` and `HorizontalGallery` assume mouse/trackpad-like continuous scrolling; with Lenis disabled (reduced motion) they still work but without easing.
- Browser zoom changes viewport CSS pixels; anything sized in `vh` + fixed px (the old Hero) breaks first. Prefer `min(vw, vh)` clamps or container-relative sizing.
- Lenis + `position: sticky`: works because Lenis scrolls the real document. Don't switch to a transform-based scroll wrapper (it would break `sticky` and `useScroll`).
- Anchor links inside the page are intercepted by two listeners (`PageTransition` ignores same-path links; `useSmoothScroll` handles them). Adding another document-level click handler needs care about ordering.
