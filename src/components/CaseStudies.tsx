import { useContent } from "../cms/ContentProvider";
import CaseStudyCard from "./CaseStudyCard";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Selected work as a three-up grid. Live projects link to their case study;
 * the rest show as "coming soon". Neighbouring cards tip in opposite
 * directions on hover.
 */
export default function CaseStudies() {
	const { projects } = useContent();
	return (
		<section id="work" className="bg-cloud py-24 sm:py-28">
			<div className="mx-auto max-w-6xl px-6">
				<SectionHeading>Selected Work</SectionHeading>

				<div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((p, i) => (
						<Reveal key={p.slug} direction="up" delay={(i % 3) * 0.08} className="h-full">
							<CaseStudyCard
								tilt={i % 2 === 0 ? -1 : 1}
								data={{
									tag: p.tag,
									tagTone: p.tagTone,
									title: p.title,
									year: p.year,
									slug: p.live ? p.slug : undefined,
									imgLabel: p.imgLabel,
									imgSrc: p.imgSrc,
								}}
							/>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
