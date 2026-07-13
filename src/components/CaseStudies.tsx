import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import CaseStudyCard, { type CaseStudyCardData } from "./CaseStudyCard";
import IconButton from "./ui/IconButton";
import Dots from "./ui/Dots";
import { useContent } from "../cms/ContentProvider";

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
      const clamped = Math.max(0, Math.min(cards.length - 1, i));
      trackRef.current?.scrollTo({ left: step() * clamped, behavior: "smooth" });
    },
    [step]
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

  return (
    <section id="work" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading>Selected Work</SectionHeading>

        <div className="relative mt-14">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c, i) => (
              <CaseStudyCard key={c.title} data={c} featured={i === 0} />
            ))}
          </div>

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

        <div className="mt-6 flex justify-center">
          <Dots count={cards.length} active={active} onSelect={scrollToIndex} />
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
