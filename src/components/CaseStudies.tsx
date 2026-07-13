import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import CaseStudyCard, { type CaseStudyCardData } from "./CaseStudyCard";
import IconButton from "./ui/IconButton";
import Dots from "./ui/Dots";
import { useContent } from "../cms/ContentProvider";

// Tracks the in-flight animation per element, so a second click while one is
// still running cancels it instead of fighting it for control of scrollLeft
// (two competing rAF loops writing scrollLeft each frame is a classic source
// of visible jitter).
const activeAnimations = new WeakMap<HTMLElement, number>();

/** Eases an element's scrollLeft to a target. A custom ease-in-out cubic reads
 * far smoother than the native `behavior: "smooth"` (which starts abruptly and
 * varies across browsers) — it accelerates and decelerates gently at both ends. */
function smoothScrollTo(el: HTMLElement, targetLeft: number, duration = 620) {
  const prevFrame = activeAnimations.get(el);
  if (prevFrame !== undefined) cancelAnimationFrame(prevFrame);

  const startLeft = el.scrollLeft;
  const change = targetLeft - startLeft;
  if (Math.abs(change) < 1) return;

  // CSS scroll-snap tries to re-align to the nearest snap point on every
  // scroll event, including ones caused by our own writes to scrollLeft —
  // that tug-of-war is the other half of the jitter. Suspend it for the
  // duration of the animation and restore it once we land exactly on target.
  const prevSnap = el.style.scrollSnapType;
  el.style.scrollSnapType = "none";

  const startTime = performance.now();
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function frame(now: number) {
    const t = Math.min(1, (now - startTime) / duration);
    el.scrollLeft = startLeft + change * ease(t);
    if (t < 1) {
      activeAnimations.set(el, requestAnimationFrame(frame));
    } else {
      el.style.scrollSnapType = prevSnap;
      activeAnimations.delete(el);
    }
  }
  activeAnimations.set(el, requestAnimationFrame(frame));
}

export default function CaseStudies() {
  const { projects } = useContent();
  const cards: CaseStudyCardData[] = projects.map(p => ({
    tag: p.tag,
    tagTone: p.tagTone,
    title: p.title,
    desc: p.cardDesc,
    slug: p.live ? p.slug : undefined,
    imgLabel: p.imgLabel,
    imgSrc: p.imgSrc,
  }));

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = useCallback(() => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-slider-card]");
    return card ? card.offsetWidth + 24 : (el?.clientWidth ?? 0) * 0.8;
  }, []);

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(cards.length - 1, i));
      smoothScrollTo(el, step() * clamped);
    },
    [step, cards.length]
  );

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const s = step();
    setActive(Math.round(el.scrollLeft / s));
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 8);
  }, [step]);

  useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  }, [onScroll]);

  // A soft gradient mask fades whichever edge still has more cards behind it,
  // hinting the track scrolls without a hard clip. An edge with nothing beyond
  // it (start/end) isn't faded, so the first/last card stays fully solid.
  const maskImage = useMemo(() => {
    const left = atStart ? "0%" : "6%";
    const right = atEnd ? "100%" : "94%";
    return `linear-gradient(to right, transparent 0%, #000 ${left}, #000 ${right}, transparent 100%)`;
  }, [atStart, atEnd]);

  return (
    <section id="work" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading>Selected Work</SectionHeading>

        <div className="relative mt-6">
          <div
            ref={trackRef}
            onScroll={onScroll}
            style={{ maskImage, WebkitMaskImage: maskImage }}
            // Generous vertical padding: an overflow-x scroller also clips the
            // vertical axis, so without room the cards' drop shadows get sliced
            // off in a hard grey band. This padding lets them breathe.
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 py-12 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c, i) => (
              <CaseStudyCard key={c.title} data={c} featured={i === 0} />
            ))}
          </div>

          {/* Desktop: chevrons float over the sides of the track */}
          <IconButton
            ariaLabel="Previous case study"
            disabled={atStart}
            onClick={() => scrollToIndex(active - 1)}
            className="absolute left-1 top-1/2 z-20 hidden -translate-y-1/2 sm:grid"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            ariaLabel="Next case study"
            disabled={atEnd}
            onClick={() => scrollToIndex(active + 1)}
            className="absolute right-1 top-1/2 z-20 hidden -translate-y-1/2 sm:grid"
          >
            <ChevronRight />
          </IconButton>
        </div>

        {/* Mobile: chevrons flank the dots below the cards instead of
            floating over them, where they'd cover the touch-scroll area.
            Desktop keeps just the dots, since the chevrons above already
            cover next/previous. */}
        <div className="mt-4 flex items-center justify-center gap-5">
          <IconButton
            ariaLabel="Previous case study"
            disabled={atStart}
            onClick={() => scrollToIndex(active - 1)}
            className="grid sm:hidden"
          >
            <ChevronLeft />
          </IconButton>
          <Dots count={cards.length} active={active} onSelect={scrollToIndex} />
          <IconButton
            ariaLabel="Next case study"
            disabled={atEnd}
            onClick={() => scrollToIndex(active + 1)}
            className="grid sm:hidden"
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m15 6-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
