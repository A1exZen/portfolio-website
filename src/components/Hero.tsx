import type { MotionValue } from "motion/react";
import {
	motion,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";
import { useRef } from "react";
import { useContent } from "../cms/ContentProvider";
import type { ImageSlot } from "../cms/content";
import Placeholder from "./Placeholder";

export default function Hero() {
	const { hero } = useContent();
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	// parallax: text drifts up faster than the cards
	const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);
	const cardsY = useTransform(scrollYProgress, [0, 1], [0, 80]);
	const cardsScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

	// pointer parallax
	const px = useMotionValue(0);
	const py = useMotionValue(0);
	const sx = useSpring(px, { stiffness: 45, damping: 22 });
	const sy = useSpring(py, { stiffness: 45, damping: 22 });

	function onMove(e: React.MouseEvent) {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
		py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
	}

	const fan = hero.cards;

	return (
		<section
			ref={ref}
			onMouseMove={onMove}
			className="relative h-screen min-h-150 overflow-hidden"
			style={{ background: "var(--color-cloud)" }}
		>
			{/* Headline */}
			<motion.div
				style={{ y: textY }}
				className="relative z-20 mx-auto max-w-5xl px-6 pt-40 text-center sm:pt-40"
			>
				<h1 className="font-black leading-[0.9] tracking-tight text-ink">
					<motion.span
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						className="block text-[7vw] sm:text-[5vw] md:text-[3.5rem] md:tracking-widest"
					>
						{hero.line1}
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.12,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="mt-1 block font-pixel text-[12vw] font-medium leading-[0.8] sm:text-[6vw] md:text-[7rem]"
					>
						{hero.line2}
					</motion.span>
				</h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.35 }}
					className="mx-auto mt-5 max-w-2xl text-base font-semibold text-ink/60 sm:text-xl"
				>
					{hero.subtitle}
				</motion.p>

				{/* Primary funnel CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mt-8 flex flex-wrap items-center justify-center gap-3"
				>
					<motion.a
						href="#start-project"
						whileHover={{ scale: 1.04 }}
						whileTap={{ scale: 0.96 }}
						className="rounded-full bg-accent px-7 py-3.5 font-bold text-white shadow-lg transition-colors hover:bg-accent-strong"
					>
						Start your project
					</motion.a>
					<motion.a
						href="#work"
						whileHover={{ scale: 1.04 }}
						whileTap={{ scale: 0.96 }}
						className="rounded-full bg-white px-7 py-3.5 font-bold text-ink shadow-sm ring-1 ring-black/10 transition-colors hover:bg-cloud"
					>
						See my work
					</motion.a>
				</motion.div>
			</motion.div>

			{/* Fanned project cards — a wide, shallow arc anchored to the bottom.
			    The fan needs real horizontal room to read; on phones it just
			    crowds and clips, so it's hidden below the sm breakpoint. */}
			<motion.div
				style={{ y: cardsY, scale: cardsScale }}
				className="absolute inset-x-0 bottom-15 z-10 hidden h-[44vh] max-h-100 min-h-62.5 sm:block"
			>
				<div className="absolute inset-x-0 bottom-[8%] top-0">
					{fan.map((card, i) => (
						<div
							key={`${card.label}-${i}`}
							className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
						>
							<FanCard card={card} index={i} count={fan.length} sx={sx} sy={sy} />
						</div>
					))}
				</div>
			</motion.div>

		</section>
	);
}

function FanCard({
	card,
	index,
	count,
	sx,
	sy,
}: {
	card: ImageSlot;
	index: number;
	count: number;
	sx: MotionValue<number>;
	sy: MotionValue<number>;
}) {
	const mid = (count - 1) / 2;
	const offsetIdx = index - mid;

	// Arc seat: horizontal spread (as a % of the card's own width, so it stays
	// responsive), a parabolic lift that raises the centre cards, and a tilt
	// along the arc. Cards stack left-to-right so the rightmost sits on top.
	const spreadX = offsetIdx * 64; // % of card width
	const arcY = -(mid * mid - offsetIdx * offsetIdx) * 7; // px — centre lifts up
	const rotate = offsetIdx * 5;

	// Subtle pointer parallax on an inner wrapper so it never fights the
	// entrance animation on the outer card.
	const px = useTransform(sx, v => v * (offsetIdx * 6 + 10));
	const py = useTransform(sy, v => v * 8);

	return (
		<motion.div
			// Cards fade + rise into their arc seat, staggered from the centre out.
			initial={{
				opacity: 0,
				x: `${spreadX}%`,
				y: arcY + 90,
				rotate,
				scale: 0.9,
			}}
			animate={{ opacity: 1, x: `${spreadX}%`, y: arcY, rotate, scale: 1 }}
			transition={{
				duration: 1,
				delay: 0.25 + Math.abs(offsetIdx) * 0.09,
				ease: [0.16, 1, 0.3, 1],
			}}
			whileHover={{
				y: arcY - 36,
				rotate: 0,
				scale: 1.1,
				transition: { type: "spring", stiffness: 300, damping: 22, mass: 0.6 },
			}}
			style={{ transformOrigin: "bottom center", zIndex: index }}
			className="group pointer-events-auto relative aspect-square w-[20vw] min-w-26 max-w-42 rounded-3xl bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-shadow duration-500 ease-out hover:shadow-[0_36px_80px_rgba(0,0,0,0.3)]"
		>
			<motion.div
				style={{ x: px, y: py }}
				className="h-full w-full overflow-hidden rounded-[1.3rem]"
			>
				<Placeholder
					label={card.label}
					src={card.src}
					position={card.position}
					rounded="rounded-[1.3rem]"
					className="transition-transform duration-500 ease-out group-hover:scale-110"
				/>
			</motion.div>
		</motion.div>
	);
}

