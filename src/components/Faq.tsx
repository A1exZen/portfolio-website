import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useContent } from "../cms/ContentProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Objection-handling FAQ — an accordion with smooth height animation. The
 * first question starts open so the section never reads as an empty list.
 */
export default function Faq() {
	const { faq } = useContent();
	const [open, setOpen] = useState<number | null>(0);
	if (faq.length === 0) return null;

	return (
		<section id="faq" className="bg-white py-24 sm:py-28">
			<div className="mx-auto max-w-3xl px-6">
				<SectionHeading>Questions</SectionHeading>

				<div className="mt-14 space-y-3">
					{faq.map((item, i) => {
						const isOpen = open === i;
						return (
							<Reveal key={item.q} direction="up" delay={Math.min(i * 0.04, 0.2)}>
								<div
									className={`overflow-hidden rounded-3xl ring-1 transition-colors duration-300 ${
										isOpen ? "bg-cloud ring-black/10" : "bg-white ring-black/8 hover:bg-cloud/60"
									}`}
								>
									<button
										type="button"
										onClick={() => setOpen(isOpen ? null : i)}
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
									>
										<span className="text-base font-black tracking-tight text-ink sm:text-lg">
											{item.q}
										</span>
										<motion.span
											animate={{ rotate: isOpen ? 45 : 0 }}
											transition={{ type: "spring", stiffness: 300, damping: 22 }}
											className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-ink shadow-sm ring-1 ring-black/5"
											aria-hidden
										>
											<PlusIcon />
										</motion.span>
									</button>

									<AnimatePresence initial={false}>
										{isOpen && (
											<motion.div
												key="answer"
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
											>
												<p className="px-6 pb-6 leading-relaxed text-ink/60 sm:px-7">
													{item.a}
												</p>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}

function PlusIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="M12 5v14M5 12h14"
				stroke="currentColor"
				strokeWidth="2.6"
				strokeLinecap="round"
			/>
		</svg>
	);
}
