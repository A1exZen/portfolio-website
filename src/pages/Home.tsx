import Background from "../components/Background";
import CaseStudies from "../components/CaseStudies";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Journey from "../components/Journey";
import Packages from "../components/Packages";
import Services from "../components/Services";
import Showcase from "../components/Showcase";
import Skills from "../components/Skills";
import Testimonials from "../components/Testimonials";
import WorkWithMe from "../components/WorkWithMe";
import ZigZag from "../components/ui/ZigZag";

/**
 * The page is ordered as a sales funnel: hook (hero) → proof (showcase, work)
 * → offer (services, process, pricing) → trust (testimonials, about) →
 * objections (FAQ) → action (project form).
 */
export default function Home() {
	return (
		<>
			{/* Pinned hero: the track is taller than the hero, so the hero stays
			    fixed at the top for an extra stretch while the content below rides
			    up over it — full-bleed, no scaling, so the edges stay clean. */}
			<div className="relative h-[165vh]">
				<div className="sticky top-0 z-0 h-screen overflow-hidden">
					<Hero />
				</div>
			</div>

			{/* Everything after the hero rides up over it. The negative margin pulls
			    it into the hero's pinned zone; the zigzag is the overlapping seam. */}
			<div className="relative z-10 mt-[-65vh]">
				<div className="pointer-events-none relative z-10 -mb-px">
					<ZigZag direction="up" fill="#ffffff" />
				</div>
				<div className="bg-white">
					<Showcase />
					<Services />
					<CaseStudies />
					<Journey />
					<Packages />
					<Testimonials />
					<Background />
					<Skills />
					<Faq />
					<WorkWithMe />
					<Footer />
				</div>
			</div>
		</>
	);
}
