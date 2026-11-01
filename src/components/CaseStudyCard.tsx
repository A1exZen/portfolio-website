import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Placeholder from "./Placeholder";
import Badge from "./ui/Badge";

export type CaseStudyCardData = {
	tag: string;
	/** Preset badge colour. Ignored when `tagColor` is set. */
	tagTone?: "neutral" | "dark" | "accent";
	/** Raw hex override for brand-specific tags (e.g. "#ef4444"). */
	tagColor?: string;
	title: string;
	year: string;
	/** Present => links to the live case study; absent => "Coming soon". */
	slug?: string;
	imgLabel: string;
	imgSrc?: string;
};

type Props = {
	data: CaseStudyCardData;
	/** Which way the card tips on hover, so neighbours lean apart. */
	tilt?: 1 | -1;
};

/**
 * A grid card: tag, title and year on top, the cover shot inset at the
 * bottom. On hover it lifts and tips slightly to one side, like a print
 * being picked up off a table.
 */
export default function CaseStudyCard({ data, tilt = 1 }: Props) {
	const live = Boolean(data.slug);

	const card = (
		<motion.article
			whileHover={{ y: -10, rotate: 1.6 * tilt, scale: 1.015 }}
			transition={{ type: "spring", stiffness: 260, damping: 20 }}
			className="group flex h-full flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_8px_24px_rgba(17,17,19,0.06)] ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-[0_28px_60px_rgba(17,17,19,0.16)] sm:p-6"
		>
			<div>
				{data.tagColor ? (
					<Badge color={data.tagColor}>{data.tag}</Badge>
				) : (
					<Badge tone={data.tagTone}>{data.tag}</Badge>
				)}
			</div>
			<h3 className="mt-4 line-clamp-3 text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
				{data.title}
			</h3>
			<p className="mt-3 text-[15px] font-semibold text-ink/50">
				{live ? data.year : `${data.year} · Case study coming soon`}
			</p>

			<div className="mt-auto pt-8">
				<div className="aspect-16/10 overflow-hidden rounded-2xl ring-1 ring-black/5">
					<div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
						<Placeholder
							label={data.imgLabel}
							src={data.imgSrc}
							rounded="rounded-none"
						/>
					</div>
				</div>
			</div>
		</motion.article>
	);

	return live ? (
		<Link
			to={`/case-studies/${data.slug}`}
			aria-label={`Read case study: ${data.title}`}
			className="block h-full rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
		>
			{card}
		</Link>
	) : (
		card
	);
}
