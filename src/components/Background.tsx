import { motion } from "motion/react";
import { Fragment } from "react";
import { useContent } from "../cms/ContentProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Background() {
	const { background } = useContent();

	return (
		<section id="background" className="bg-white py-24 sm:py-28">
			<div className="mx-auto max-w-5xl px-6">
				<SectionHeading>About Me</SectionHeading>

				<Reveal className="mx-auto mt-12 max-w-3xl text-center" direction="up">
					{background.intro.map((para, i) => (
						<p
							key={i}
							className={`text-lg leading-relaxed text-ink/60 sm:text-xl ${
								i > 0 ? "mt-6" : ""
							}`}
						>
							{para}
						</p>
					))}
				</Reveal>

				{background.stats.length > 0 && (
					<ExperienceStrip stats={background.stats} />
				)}
			</div>
		</section>
	);
}

/**
 * The experience block as a bold "journey" statement: oversized pixel figures
 * that rise into place, each underscored by an accent stroke that draws itself
 * in, split by a quiet divider.
 */
function ExperienceStrip({ stats }: { stats: { value: string; label: string }[] }) {
	return (
		<div className="mt-20 border-t border-black/5 pt-16 sm:mt-28">
			<motion.p
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: false, margin: "-60px" }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				className="mb-14 text-center text-sm font-bold uppercase tracking-[0.25em] text-ink/40"
			>
				The Journey So Far
			</motion.p>

			<div className="mx-auto flex max-w-4xl flex-col items-center gap-12 sm:flex-row sm:justify-center sm:gap-0">
				{stats.map((s, i) => (
					<Fragment key={s.label}>
						{i > 0 && (
							<span
								aria-hidden
								className="hidden h-24 w-px bg-black/10 sm:mx-14 sm:block"
							/>
						)}
						<motion.div
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: false, margin: "-60px" }}
							transition={{
								duration: 0.75,
								ease: [0.22, 1, 0.36, 1],
								delay: i * 0.12,
							}}
							className="flex flex-col items-center text-center"
						>
							<span className="font-pixel text-7xl font-bold leading-none tracking-tight text-ink sm:text-8xl">
								{s.value}
							</span>
							<motion.span
								aria-hidden
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: false, margin: "-60px" }}
								transition={{
									duration: 0.6,
									ease: [0.22, 1, 0.36, 1],
									delay: 0.2 + i * 0.12,
								}}
								className="mt-6 block h-1.5 w-14 rounded-full bg-accent"
							/>
							<span className="mt-5 text-base font-semibold uppercase tracking-[0.12em] text-ink/55">
								{s.label}
							</span>
						</motion.div>
					</Fragment>
				))}
			</div>
		</div>
	);
}
