import { motion } from "motion/react";
import type { Variants } from "motion/react";

export type Metric = { value: string; label: string };

const colsByCount: Record<number, string> = {
	1: "sm:grid-cols-1",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-4",
};

const container: Variants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.09, delayChildren: 0.05 },
	},
};

const card: Variants = {
	hidden: { opacity: 0, y: 28 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
	},
};

const value: Variants = {
	hidden: { y: "110%" },
	show: {
		y: "0%",
		transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
	},
};

const bar: Variants = {
	hidden: { scaleX: 0 },
	show: {
		scaleX: 1,
		transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
	},
};

/**
 * Result stats — light editorial cards. Each value clip-reveals up from behind
 * its own baseline as the row staggers into view; an accent rule draws in
 * underneath, and the whole card lifts toward an accent ring on hover.
 */
export default function MetricGrid({ items }: { items: Metric[] }) {
	const cols = colsByCount[Math.min(items.length, 4)] ?? "sm:grid-cols-4";
	return (
		<motion.div
			variants={container}
			initial="hidden"
			whileInView="show"
			viewport={{ once: false, margin: "-60px" }}
			className={`grid grid-cols-2 gap-3 sm:gap-4 ${cols}`}
		>
			{items.map((m, i) => (
				<motion.div
					key={m.label}
					variants={card}
					whileHover={{ y: -6 }}
					transition={{ type: "spring", stiffness: 300, damping: 24 }}
					className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/8 transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.10)] hover:ring-accent/40 sm:p-6"
				>
					{/* Index tick */}
					<span className="font-pixel text-sm font-bold text-accent">
						{String(i + 1).padStart(2, "0")}
					</span>

					{/* Value — clip-revealed */}
					<div className="mt-3 overflow-hidden">
						<motion.div
							variants={value}
							className="text-xl font-black leading-tight tracking-tight text-ink sm:text-2xl"
						>
							{m.value}
						</motion.div>
					</div>

					{/* Accent rule that draws in under the value */}
					<motion.span
						variants={bar}
						className="mt-3 block h-px w-8 origin-left bg-accent"
					/>

					<div className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
						{m.label}
					</div>

					{/* Soft accent glow that blooms on hover */}
					<span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover:bg-accent/15" />
				</motion.div>
			))}
		</motion.div>
	);
}
