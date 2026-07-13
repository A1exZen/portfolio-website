import { motion } from "motion/react";
import { useContent } from "../cms/ContentProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Client quotes — three cards with an oversized accent quote mark. Attribution
 * degrades gracefully while a name is pending approval (role + project only).
 */
export default function Testimonials() {
	const { testimonials } = useContent();
	if (testimonials.items.length === 0) return null;
	return (
		<section id="testimonials" className="bg-cloud py-24 sm:py-28">
			<div className="mx-auto max-w-6xl px-6">
				<SectionHeading>Client Words</SectionHeading>

				<Reveal className="mx-auto mt-10 max-w-xl text-center" direction="up">
					<p className="text-lg leading-relaxed text-ink/60">
						{testimonials.intro}
					</p>
				</Reveal>

				<div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
					{testimonials.items.map((t, i) => (
						<Reveal key={t.project} direction="up" delay={i * 0.08}>
							<motion.figure
								whileHover={{ y: -6 }}
								transition={{ type: "spring", stiffness: 300, damping: 24 }}
								className="flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)] sm:p-8"
							>
								<span
									aria-hidden
									className="font-pixel text-5xl font-bold leading-none text-accent"
								>
									&ldquo;
								</span>
								<blockquote className="mt-3 flex-1 leading-relaxed text-ink/75">
									{t.quote}
								</blockquote>
								<figcaption className="mt-6 border-t border-black/5 pt-5">
									{t.name && (
										<div className="font-bold text-ink">{t.name}</div>
									)}
									<div className="text-sm font-semibold text-ink/55">
										{t.role}
									</div>
									<div className="mt-0.5 text-sm text-ink/40">{t.project}</div>
								</figcaption>
							</motion.figure>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
