import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useContent } from "../cms/ContentProvider";
import Footer from "../components/Footer";
import Placeholder from "../components/Placeholder";
import Reveal from "../components/Reveal";
import MetricGrid from "../components/ui/MetricGrid";
import ProcessTimeline from "../components/ui/ProcessTimeline";
import ZigZag from "../components/ui/ZigZag";
import type { ImageSlot } from "../cms/content";
import { findProject } from "../data/projects";

export default function CaseStudy() {
	const { slug } = useParams();
	const { projects } = useContent();
	const project = slug ? findProject(projects, slug) : undefined;
	const coverRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: coverRef,
		offset: ["start start", "end start"],
	});
	// Layered parallax on the cover — each element drifts at its own rate so the
	// title, intro and meta separate in depth as you scroll away.
	const titleY = useTransform(scrollYProgress, [0, 1], [0, -90]);
	const introY = useTransform(scrollYProgress, [0, 1], [0, -55]);
	const metaY = useTransform(scrollYProgress, [0, 1], [0, -24]);
	const coverOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
	const wordY = useTransform(scrollYProgress, [0, 1], [0, -160]);

	// Only live projects have detail pages.
	if (!project || !project.live) return <Navigate to="/" replace />;

	const liveProjects = projects.filter(p => p.live);
	const idx = liveProjects.findIndex(p => p.slug === project.slug);
	const next = liveProjects[(idx + 1) % liveProjects.length];

	// A dedicated gallery, when the project defines one, so a case with a lot
	// of supporting material isn't limited to just its three hero images.
	// Otherwise fall back to gathering each section's own image.
	const gallery: ImageSlot[] =
		project.gallery ??
		project.sections
			.filter(s => s.image || s.imageSrc)
			.map(s => ({ label: s.image ?? "", src: s.imageSrc }));

	return (
		<article className="bg-white">
			{/* Cover — light panel that dissolves into white via a zigzag */}
			<div
				ref={coverRef}
				className="relative overflow-hidden bg-cloud pb-16 pt-36 sm:pt-44"
			>
				{/* Oversized ghost word drifting behind the title */}
				<motion.span
					aria-hidden
					style={{ y: wordY, opacity: coverOpacity }}
					className="pointer-events-none absolute -right-6 top-20 select-none font-pixel text-[26vw] font-bold leading-none text-black/[0.035] sm:text-[20vw]"
				>
					{project.tag}
				</motion.span>

				<motion.div
					style={{ opacity: coverOpacity }}
					className="relative mx-auto max-w-4xl px-6"
				>
					<motion.div style={{ y: titleY }}>
						<Reveal direction="up">
							<span className="inline-block rounded-full bg-black/5 px-3 py-1 text-sm font-bold text-ink">
								{project.tag}
							</span>
						</Reveal>
						<Reveal direction="up" delay={0.05}>
							<h1 className="mt-5 max-w-3xl text-2xl font-black leading-[1.05] tracking-tight text-ink sm:text-4xl">
								{project.title}
							</h1>
						</Reveal>
					</motion.div>

					<motion.div style={{ y: introY }}>
						<Reveal direction="up" delay={0.1}>
							<p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/70 sm:text-xl">
								{project.intro}
							</p>
						</Reveal>
					</motion.div>

					<motion.div style={{ y: metaY }}>
						<Reveal direction="up" delay={0.15}>
							<dl className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
								<MetaItem label="Focus" value={project.focus} />
								<MetaItem label="Area of Work" value={project.area} />
								<MetaItem label="Role" value={project.role} />
							</dl>
						</Reveal>

						<a
							href="#problem"
							className="mt-12 inline-flex items-center gap-2 text-lg font-bold text-ink/70 transition-colors hover:text-ink"
						>
							Read more
							<motion.span
								animate={{ y: [0, 6, 0] }}
								transition={{
									duration: 1.4,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								↓
							</motion.span>
						</a>
					</motion.div>
				</motion.div>

				<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
					<ZigZag direction="up" fill="#ffffff" />
				</div>
			</div>

			{/* Body sections */}
			<div className="mx-auto max-w-3xl space-y-24 px-6 py-20 sm:py-28">
				{project.sections.map(s => (
					<section key={s.id} id={s.id} className="scroll-mt-28">
						<Reveal direction="up">
							<p className="text-sm font-bold uppercase tracking-[0.2em] text-ink/40">
								{s.eyebrow}
							</p>
							<h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
								{s.heading}
							</h2>
						</Reveal>

						{s.body.map((para, j) => (
							<Reveal key={j} direction="up" delay={0.05}>
								<p className="mt-5 text-lg leading-relaxed text-ink/70">
									{para}
								</p>
							</Reveal>
						))}

						{s.bullets && s.bullets.length > 0 && (
							<Reveal direction="up" delay={0.05}>
								<ul className="mt-6 space-y-3">
									{s.bullets.map((b, k) => (
										<li
											key={k}
											className="flex items-start gap-3 text-lg text-ink/75"
										>
											<span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
											{b}
										</li>
									))}
								</ul>
							</Reveal>
						)}

						{s.process && s.process.length > 0 && (
							<div className="mt-8">
								<ProcessTimeline steps={s.process} />
							</div>
						)}

						{s.metrics && s.metrics.length > 0 && (
							<div className="mt-8">
								<MetricGrid items={s.metrics} />
							</div>
						)}

						{(s.image || s.imageSrc) && (
							<ParallaxImage label={s.image ?? ""} src={s.imageSrc} />
						)}
					</section>
				))}
			</div>

			{/* Pinned horizontal gallery of the case's screens */}
			{gallery.length >= 2 && <HorizontalGallery images={gallery} />}

			{/* Funnel CTA — every case study ends with a way to start a project */}
			<div className="bg-white">
				<div className="mx-auto max-w-4xl px-6 pb-24 pt-8 text-center sm:pb-28">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: false, margin: "-80px" }}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
						className="rounded-[2.5rem] bg-ink px-8 py-14 text-white sm:px-14"
					>
						<h2 className="mx-auto max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
							Need something like this?
						</h2>
						<p className="mx-auto mt-4 max-w-md text-white/60">
							Tell me about your project — I'll reply within 24 hours with an
							honest recommendation and a rough estimate.
						</p>
						<motion.div
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.96 }}
							className="mt-8 inline-block"
						>
							<Link
								to="/#start-project"
								className="inline-block rounded-full bg-accent px-8 py-4 font-bold text-white shadow-lg transition-colors hover:bg-accent-strong"
							>
								Start your project
							</Link>
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* Next project */}
			<div className="border-t border-black/5 bg-cloud">
				<div className="mx-auto max-w-4xl px-6 py-16">
					<p className="text-sm font-bold uppercase tracking-[0.2em] text-ink/40">
						Next case study
					</p>
					<Link
						to={`/case-studies/${next.slug}`}
						className="group mt-4 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
					>
						<h3 className="max-w-2xl text-3xl font-black tracking-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
							{next.title}
						</h3>
						<motion.div
							whileHover={{ x: 8 }}
							className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-white"
						>
							<span className="text-2xl">→</span>
						</motion.div>
					</Link>
				</div>
			</div>

			<Footer />
		</article>
	);
}

/**
 * An image that drifts vertically against the scroll inside a fixed frame — the
 * image is over-scaled so the parallax travel never exposes an edge.
 */
function ParallaxImage({ label, src }: { label: string; src?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

	return (
		<Reveal direction="scale" delay={0.05}>
			<div
				ref={ref}
				className="mt-8 aspect-16/10 w-full overflow-hidden rounded-3xl"
			>
				<motion.div style={{ y }} className="h-[118%] w-full">
					<Placeholder label={label} src={src} rounded="rounded-3xl" />
				</motion.div>
			</div>
		</Reveal>
	);
}

/**
 * A row of screens that scrolls sideways while the section is pinned — vertical
 * scroll is translated into horizontal travel. Distance is measured from the
 * real track width so it always ends flush regardless of image count.
 */
function HorizontalGallery({ images }: { images: ImageSlot[] }) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [distance, setDistance] = useState(0);

	useEffect(() => {
		const measure = () => {
			const el = trackRef.current;
			if (!el) return;
			// How far the track overflows the viewport, plus the trailing gutter.
			setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 48));
		};
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, [images.length]);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});
	const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

	return (
		<section
			ref={sectionRef}
			className="relative bg-white"
			// Extra height (beyond the distance to travel) slows the horizontal
			// pace so the sideways scroll reads as smooth rather than abrupt.
			style={{ height: `calc(100vh + ${distance * 1.5}px)` }}
		>
			<div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
				<div className="mx-auto mb-8 w-full max-w-6xl px-6">
					<Reveal direction="up">
						<p className="text-sm font-bold uppercase tracking-[0.2em] text-ink/40">
							Selected screens
						</p>
						<h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
							A closer look
						</h2>
					</Reveal>
				</div>

				<motion.div
					ref={trackRef}
					style={{ x }}
					className="flex w-max gap-6 px-6 will-change-transform"
				>
					{images.map((img, i) => (
						<div
							key={`${img.label}-${i}`}
							className="aspect-4/3 w-[82vw] shrink-0 overflow-hidden rounded-3xl ring-1 ring-black/5 sm:w-[62vw] lg:w-[52vw]"
						>
							<Placeholder
								label={img.label}
								src={img.src}
								rounded="rounded-3xl"
							/>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	);
}

function MetaItem({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-sm font-bold uppercase tracking-[0.15em] text-ink/40">
				{label}
			</dt>
			<dd className="mt-2 text-lg font-bold text-ink">{value}</dd>
		</div>
	);
}
