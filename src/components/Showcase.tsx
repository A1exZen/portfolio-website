import { useRef } from "react";
import type { MotionValue } from "motion/react";
import { motion, useScroll, useTransform } from "motion/react";
import Placeholder from "./Placeholder";
import { useContent } from "../cms/ContentProvider";
import type { ImageSlot } from "../cms/content";
import useIsNarrow from "../hooks/useIsNarrow";

/**
 * Sticky scroll showcase.
 *
 * As the section is pinned, a single focal "browser" card grows into view
 * (step-by-step zoom), then shrinks and docks into the centre of a 3x3 grid
 * while the surrounding thumbnails reveal around it — after which the whole
 * grid drifts up and the section releases.
 */

export default function Showcase() {
  const { showcase } = useContent();
  const around = showcase.cards;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const narrow = useIsNarrow();

  // Focal card starts large and only ever zooms OUT, docking to cell size.
  const focalScale = useTransform(scrollYProgress, [0, 0.6], [2.15, 1]);
  const focalRadius = useTransform(scrollYProgress, [0, 0.6], [28, 16]);
  const focalShadow = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["0 40px 90px rgba(0,0,0,0.28)", "0 10px 30px rgba(0,0,0,0.10)"]
  );

  // Whole grid drifts up at the end (grid "scroll")
  const stageY = useTransform(scrollYProgress, [0.72, 1], [0, -120]);

  // The pinned zoom/dock choreography needs real horizontal room to read —
  // on phones it just crowds and clips. Skip the section there entirely.
  if (narrow) return null;

  return (
    <section ref={ref} className="relative bg-white" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <motion.div
          style={{ y: stageY }}
          className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-4 sm:gap-5"
        >
          {Array.from({ length: 9 }).map((_, i) => {
            const isCenter = i === 4;

            if (isCenter) {
              return (
                <motion.div
                  key="focal"
                  style={{
                    scale: focalScale,
                    borderRadius: focalRadius,
                    boxShadow: focalShadow,
                    transformOrigin: "center",
                    zIndex: 30,
                  }}
                  className="relative aspect-16/10 overflow-hidden"
                >
                  <BrowserFrame focal={showcase.focal} />
                </motion.div>
              );
            }

            const card = around[i < 4 ? i : i - 1] ?? { label: "" };
            return (
              <GridCell
                key={i}
                row={Math.floor(i / 3)}
                card={card}
                progress={scrollYProgress}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function GridCell({
  row,
  card,
  progress,
}: {
  row: number;
  card: ImageSlot;
  progress: MotionValue<number>;
}) {
  // The whole grid rises up from below as one sheet: every cell travels
  // upward into place (never down), with the bottom row settling first and
  // the top row following a beat later — like the grid itself is scrolling
  // up into view from beneath the focal card.
  const riseOrder = 2 - row; // bottom row (row 2) goes first
  const start = 0.42 + riseOrder * 0.045;
  const end = start + 0.2;
  const y = useTransform(progress, [start, end], [64, 0]);
  const cellOpacity = useTransform(progress, [start, end], [0, 1]);
  return (
    <motion.div style={{ opacity: cellOpacity, y }} className="aspect-16/10">
      <CardTile card={card} rounded="rounded-2xl" />
    </motion.div>
  );
}

/**
 * A single showcase tile: the screenshot, plus a hover overlay that dims the
 * image and reveals the project name. When the card has an `href` it becomes a
 * link (new tab) with a subtle lift; otherwise it's a static labelled tile.
 */
function CardTile({ card, rounded }: { card: ImageSlot; rounded: string }) {
  const inner = (
    <>
      <Placeholder
        label={card.label}
        src={card.src}
        position={card.position}
        rounded={rounded}
      />
      {/* Dim + name on hover */}
      <div
        className={`pointer-events-none absolute inset-0 flex items-end bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/65 group-hover:opacity-100 ${rounded}`}
      >
        <div className="translate-y-2 p-4 transition-transform duration-300 group-hover:translate-y-0 sm:p-5">
          <span className="block text-sm font-bold text-white sm:text-base">
            {card.label}
          </span>
          {card.href && (
            <span className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/70">
              Visit project
              <ArrowUpRight />
            </span>
          )}
        </div>
      </div>
    </>
  );

  const shared = `group relative block h-full w-full overflow-hidden ${rounded}`;

  if (card.href) {
    return (
      <motion.a
        href={card.href}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`${shared} cursor-pointer ring-1 ring-transparent hover:ring-accent/40`}
      >
        {inner}
      </motion.a>
    );
  }

  return <div className={shared}>{inner}</div>;
}

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A lightweight browser-window placeholder used as the focal image. */
function BrowserFrame({ focal }: { focal: ImageSlot }) {
  return (
    <div className="flex h-full w-full flex-col rounded-[inherit] bg-white ring-1 ring-black/10">
      <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 h-3 flex-1 rounded-full bg-black/5" />
      </div>
      <div className="flex-1">
        <Placeholder label={focal.label} src={focal.src} rounded="rounded-none" />
      </div>
    </div>
  );
}
