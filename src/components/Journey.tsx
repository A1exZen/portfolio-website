import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { useContent } from "../cms/ContentProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * The client journey — a vertical timeline whose accent line draws itself in
 * as you scroll, with numbered milestones settling in one by one.
 */
export default function Journey() {
	const { journey } = useContent();
	const listRef = useRef<HTMLOListElement>(null);
	const { scrollYProgress } = useScroll({
		target: listRef,
		offset: ["start 0.75", "end 0.55"],
	});
	const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

	return (
		<section id="process" className="bg-cloud py-24 sm:py-28">
			<div className="mx-auto max-w-3xl px-6">
				<SectionHeading>How We'll Work</SectionHeading>

				<Reveal className="mx-auto mt-10 max-w-xl text-center" direction="up">
					<p className="text-lg leading-relaxed text-ink/60">{journey.intro}</p>
				</Reveal>

				<ol ref={listRef} className="relative mt-16 space-y-12 sm:space-y-14">
					{/* Track + scroll-drawn accent line */}
					<span
						aria-hidden
						className="absolute bottom-6 left-6 top-6 w-px bg-black/10"
					/>
					<motion.span
						aria-hidden
						style={{ scaleY: drawn }}
						className="absolute bottom-6 left-6 top-6 w-px origin-top bg-accent"
					/>

					{journey.steps.map((step, i) => (
						<li key={step.title} className="relative pl-20">
							{/* Milestone number — springs onto the line */}
							<motion.span
								initial={{ scale: 0.4, opacity: 0 }}
								whileInView={{ scale: 1, opacity: 1 }}
								viewport={{ once: false, margin: "-80px" }}
								transition={{
									type: "spring",
									stiffness: 260,
									damping: 18,
									delay: i * 0.1,
								}}
								className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-white font-pixel text-lg font-bold text-accent shadow-sm ring-1 ring-black/5"
							>
								{String(i + 1).padStart(2, "0")}
							</motion.span>
							{/* Content slides in from the line */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: false, margin: "-80px" }}
								transition={{
									duration: 0.6,
									ease: [0.22, 1, 0.36, 1],
									delay: i * 0.1 + 0.08,
								}}
							>
								<h3 className="pt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">
									{step.title}
								</h3>
								<p className="mt-2.5 leading-relaxed text-ink/60">{step.body}</p>
							</motion.div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
