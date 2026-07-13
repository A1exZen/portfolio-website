import { motion } from "motion/react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../cms/ContentProvider";

export default function Resume() {
	const { resume } = useContent();
	return (
		<section id="resume" className="bg-white py-24 sm:py-28">
			<div className="mx-auto max-w-3xl px-6 text-center">
				<SectionHeading>Resume</SectionHeading>

				<Reveal className="mt-12" direction="up">
					<p className="mx-auto max-w-md text-lg text-ink/55">
						{resume.description}
					</p>
				</Reveal>

				<Reveal className="mt-10" direction="scale" delay={0.1}>
					<motion.a
						href={resume.pdfUrl}
						download
						whileHover={{ scale: 1.04 }}
						whileTap={{ scale: 0.96 }}
						className="inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-black"
					>
						<DownloadIcon />
						Download Resume
					</motion.a>
				</Reveal>
			</div>
		</section>
	);
}

function DownloadIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
