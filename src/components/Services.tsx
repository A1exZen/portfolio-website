import { motion } from "motion/react";
import { useContent } from "../cms/ContentProvider";
import type { DisciplineIcon } from "../cms/content";
import { FigmaIcon, NotionIcon, ReactIcon } from "./BrandIcons";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const icons: Record<DisciplineIcon, React.ReactNode> = {
	figma: <FigmaIcon />,
	react: <ReactIcon />,
	notion: <NotionIcon />,
};

/**
 * What I sell — three service cards, each with a deliverables list. The cards
 * stagger up into view and lift toward an accent ring on hover.
 */
export default function Services() {
	const { services } = useContent();
	return (
		<section id="services" className="bg-white py-24 sm:py-28">
			<div className="mx-auto max-w-6xl px-6">
				<SectionHeading>What I Do</SectionHeading>

				<Reveal className="mx-auto mt-10 max-w-2xl text-center" direction="up">
					<p className="text-lg leading-relaxed text-ink/60">{services.intro}</p>
				</Reveal>

				<div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
					{services.items.map((s, i) => (
						<Reveal key={s.title} direction="up" delay={i * 0.08}>
							<motion.div
								whileHover={{ y: -8 }}
								transition={{ type: "spring", stiffness: 300, damping: 24 }}
								className="group flex h-full flex-col rounded-3xl bg-cloud p-7 ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)] hover:ring-accent/30 sm:p-8"
							>
								<div>{icons[s.icon]}</div>

								<h3 className="mt-6 text-xl font-black leading-snug tracking-tight text-ink sm:text-2xl">
									{s.title}
								</h3>
								<p className="mt-3 leading-relaxed text-ink/60">{s.body}</p>

								<ul className="mt-6 space-y-2.5 border-t border-black/5 pt-6">
									{s.deliverables.map(d => (
										<li
											key={d}
											className="flex items-start gap-2.5 text-[15px] font-semibold text-ink/75"
										>
											<span className="mt-1 text-accent" aria-hidden>
												<CheckIcon />
											</span>
											{d}
										</li>
									))}
								</ul>
							</motion.div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

function CheckIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="m5 13 4 4L19 7"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
