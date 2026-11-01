import { motion, useScroll, useTransform } from "motion/react";
import { useContent } from "../cms/ContentProvider";
import HeroBackdrop from "./HeroBackdrop";

/**
 * Bottom strip of the viewport the hero leaves free: Home starts the next
 * section this far above the fold, so its zigzag edge peeks in on first paint.
 * Keep in sync with the overlap in pages/Home.tsx and the case-study cover.
 */
export const HERO_SEAM = "7rem";

export default function Hero() {
	const { hero } = useContent();

	// The hero is pinned (sticky) inside Home, so its own box never scrolls.
	// Drive the exit off page scroll instead: 0 at the top, 1 once the next
	// section has slid most of the way over it.
	const { scrollY } = useScroll();
	const progress = useTransform(scrollY, v =>
		Math.min(1, v / (window.innerHeight * 0.65)),
	);
	const textY = useTransform(progress, [0, 1], [0, -90]);
	const textScale = useTransform(progress, [0, 1], [1, 0.92]);
	const textOpacity = useTransform(progress, [0, 0.8], [1, 0]);

	return (
		<section
			className="relative flex h-full flex-col items-center justify-center overflow-hidden"
			style={{ paddingBottom: HERO_SEAM }}
		>
			<HeroBackdrop />

			{/* Headline: sizes follow min(vw, vh) so it fits short windows and
			    browser zoom without spilling into the seam. */}
			<motion.div
				style={{ y: textY, scale: textScale, opacity: textOpacity }}
				className="pointer-events-none relative z-10 mx-auto w-full max-w-5xl px-6 pt-20 text-center"
			>
				<h1 className="font-black leading-[0.9] tracking-tight text-white">
					<motion.span
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						className="block text-[clamp(1.25rem,min(7vw,6vh),5rem)] md:tracking-widest"
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
						className="mt-1 block font-pixel text-[clamp(2.5rem,min(12vw,13vh),9rem)] font-medium leading-[0.8]"
					>
						{hero.line2}
					</motion.span>
				</h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.35 }}
					className="mx-auto mt-5 max-w-2xl text-base font-semibold text-white/75 sm:text-xl"
				>
					{hero.subtitle}
				</motion.p>

				{/* Primary funnel CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3"
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
						className="rounded-full bg-white/10 px-7 py-3.5 font-bold text-white shadow-sm ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20"
					>
						See my work
					</motion.a>
				</motion.div>
			</motion.div>
		</section>
	);
}
