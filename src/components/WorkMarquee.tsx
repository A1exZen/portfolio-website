import {
	motion,
	useAnimationFrame,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import { useEffect, useRef } from "react";
import { useContent } from "../cms/ContentProvider";
import type { ImageSlot } from "../cms/content";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

// Track speed in px/s. Hovering eases it down to a crawl instead of a hard
// stop, so the strip keeps feeling alive while you look at a card.
const SPEED = 48;
const HOVER_SPEED = 9;

/**
 * An endless strip of project screenshots drifting left to right. Each card
 * is a small browser window; hovering dims it and shows the project name,
 * plus a Visit button when the card has a live `href`.
 */
export default function WorkMarquee() {
	const { showcase } = useContent();
	const items = [showcase.focal, ...showcase.cards];
	const reduce = useReducedMotion();

	const trackRef = useRef<HTMLDivElement>(null);
	const half = useRef(0);
	const speed = useRef(SPEED);
	const target = useRef(SPEED);
	const x = useMotionValue(0);

	// The track renders the list twice; one copy's width is the loop length.
	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		const measure = () => {
			half.current = el.scrollWidth / 2;
			if (x.get() === 0) x.set(-half.current);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, [x]);

	useAnimationFrame((_, delta) => {
		if (reduce || !half.current) return;
		speed.current += (target.current - speed.current) * Math.min(1, delta / 300);
		let next = x.get() + (speed.current * delta) / 1000;
		if (next >= 0) next -= half.current;
		x.set(next);
	});

	return (
		<section id="builds" className="overflow-hidden bg-white pb-8 pt-24 sm:pb-10 sm:pt-28">
			<div className="mx-auto max-w-6xl px-6">
				<SectionHeading>Recent Builds</SectionHeading>
				<Reveal className="mx-auto mt-10 max-w-xl text-center" direction="up">
					<p className="text-lg leading-relaxed text-ink/60">{showcase.intro}</p>
				</Reveal>
			</div>

			<Reveal className="mt-14" direction="fade">
				<div
					onMouseEnter={() => (target.current = HOVER_SPEED)}
					onMouseLeave={() => (target.current = SPEED)}
					// Under reduced motion the strip stops, so let people scroll it.
					className={reduce ? "overflow-x-auto" : ""}
				>
					<motion.div
						ref={trackRef}
						style={{ x: reduce ? 0 : x }}
						className="flex w-max gap-6 px-3 py-6"
					>
						{[...items, ...items].map((card, i) => (
							<BrowserCard
								key={`${card.label}-${i}`}
								card={card}
								hidden={i >= items.length}
							/>
						))}
					</motion.div>
				</div>
			</Reveal>
		</section>
	);
}

function BrowserCard({ card, hidden }: { card: ImageSlot; hidden: boolean }) {
	const body = (
		<>
			<div className="flex items-center gap-1.5 border-b border-black/5 bg-white px-3 py-2">
				<span className="h-2.5 w-2.5 rounded-full bg-red-400" />
				<span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
				<span className="h-2.5 w-2.5 rounded-full bg-green-400" />
				<span className="ml-3 h-3 flex-1 rounded-full bg-black/5" />
			</div>
			<div className="relative flex-1 overflow-hidden">
				<div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
					<Placeholder
						label={card.label}
						src={card.src}
						position={card.position}
						rounded="rounded-none"
					/>
				</div>
				{/* Hover: dim the shot, name the project, offer a visit */}
				<div className="absolute inset-0 flex items-end justify-between gap-4 bg-linear-to-t from-ink/80 via-ink/30 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<span className="translate-y-2 text-base font-bold leading-snug text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-lg">
						{card.label}
					</span>
					{card.href && (
						<span className="shrink-0 translate-y-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-accent shadow-md transition-transform duration-300 group-hover:translate-y-0">
							Visit
						</span>
					)}
				</div>
			</div>
		</>
	);

	const cls =
		"group flex aspect-16/10 w-[clamp(17rem,30vw,27rem)] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_rgba(17,17,19,0.10)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(17,17,19,0.18)]";

	// The duplicate copy only exists for the seamless loop: hide it from
	// assistive tech and the tab order.
	const a11y = hidden ? { "aria-hidden": true, tabIndex: -1 } : {};

	return card.href ? (
		<a
			href={card.href}
			target="_blank"
			rel="noreferrer"
			className={`${cls} cursor-pointer`}
			{...a11y}
		>
			{body}
		</a>
	) : (
		<div className={cls} aria-hidden={hidden || undefined}>
			{body}
		</div>
	);
}
