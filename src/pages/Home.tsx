import Background from "../components/Background";
import CaseStudies from "../components/CaseStudies";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Journey from "../components/Journey";
import Philosophy from "../components/Philosophy";
// Pricing temporarily disabled — see the commented-out <Packages /> below.
// import Packages from "../components/Packages";
import Services from "../components/Services";
// Pinned 3x3 showcase temporarily replaced by the WorkMarquee strip.
// import Showcase from "../components/Showcase";
import Skills from "../components/Skills";
import Testimonials from "../components/Testimonials";
import WorkMarquee from "../components/WorkMarquee";
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
			    up over it. */}
			<div className="relative h-[165vh]">
				<div className="sticky top-0 z-0 h-screen overflow-hidden">
					<Hero />
				</div>
			</div>

			{/* Everything after the hero rides up over it. The negative margin pulls
			    it into the hero's pinned zone, plus HERO_SEAM (7rem) more so the
			    zigzag seam already peeks above the fold on first paint. */}
			<div className="relative z-10 mt-[calc(-65vh-7rem)]">
				<div className="pointer-events-none relative z-10 -mb-px">
					<ZigZag direction="up" fill="#ffffff" />
				</div>
				<div className="bg-white">
					{/* <Showcase /> */}
					<WorkMarquee />
					<Services />
					<Philosophy />
					<CaseStudies />
					<Journey />
					{/* Pricing temporarily disabled — re-enable by uncommenting. */}
					{/* <Packages /> */}
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
