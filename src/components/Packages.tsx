import { motion } from "motion/react";
import { useContent } from "../cms/ContentProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Engagement options — three "starting at" packages. The highlighted tier is
 * rendered on an ink card so the pricing row has a clear focal point.
 */
export default function Packages() {
	const { packages } = useContent();
	return (
		<section id="pricing" className="bg-white py-24 sm:py-28">
			<div className="mx-auto max-w-6xl px-6">
				<SectionHeading>Pricing</SectionHeading>

				<Reveal className="mx-auto mt-10 max-w-2xl text-center" direction="up">
					<p className="text-lg leading-relaxed text-ink/60">{packages.intro}</p>
				</Reveal>

				<div className="mt-14 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
					{packages.items.map((p, i) => {
						const hl = !!p.highlighted;
						return (
							<Reveal key={p.name} direction="up" delay={i * 0.08}>
								<motion.div
									whileHover={{ y: -8 }}
									transition={{ type: "spring", stiffness: 300, damping: 24 }}
									className={`relative flex h-full flex-col rounded-3xl p-7 ring-1 transition-shadow duration-300 sm:p-8 ${
										hl
											? "bg-ink text-white ring-black/20 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
											: "bg-white text-ink ring-black/8 hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)]"
									}`}
								>
									{hl && (
										<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
											Most popular
										</span>
									)}

									<h3 className="text-lg font-black tracking-tight sm:text-xl">
										{p.name}
									</h3>
									<p className={`mt-2 text-[15px] leading-relaxed ${hl ? "text-white/60" : "text-ink/55"}`}>
										{p.blurb}
									</p>

									<div className="mt-6 flex items-baseline gap-3">
										<span className="font-pixel text-3xl font-bold tracking-tight text-accent sm:text-4xl">
											{p.price}
										</span>
										<span className={`text-sm font-semibold ${hl ? "text-white/50" : "text-ink/45"}`}>
											· {p.timeline}
										</span>
									</div>

									<ul
										className={`mt-6 flex-1 space-y-2.5 border-t pt-6 ${hl ? "border-white/10" : "border-black/5"}`}
									>
										{p.features.map(f => (
											<li
												key={f}
												className={`flex items-start gap-2.5 text-[15px] font-semibold ${hl ? "text-white/80" : "text-ink/75"}`}
											>
												<span className="mt-1 text-accent" aria-hidden>
													<CheckIcon />
												</span>
												{f}
											</li>
										))}
									</ul>

									<motion.a
										href="#start-project"
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										className={`mt-8 block rounded-full px-6 py-3.5 text-center font-bold transition-colors ${
											hl
												? "bg-accent text-white hover:bg-accent-strong"
												: "bg-ink text-white hover:bg-black"
										}`}
									>
										Start with this
									</motion.a>
								</motion.div>
							</Reveal>
						);
					})}
				</div>

				<Reveal className="mx-auto mt-10 max-w-xl text-center" direction="fade">
					<p className="text-[15px] leading-relaxed text-ink/50">
						{packages.note}
					</p>
				</Reveal>
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
