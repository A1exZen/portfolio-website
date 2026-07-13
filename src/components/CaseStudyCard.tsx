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
	/** Shown only on hover, once the panel expands. */
	desc?: string;
	/** Present => links to the live case study; absent => "Coming soon". */
	slug?: string;
	imgLabel: string;
	imgSrc?: string;
};

type Props = {
	data: CaseStudyCardData;
	/** Slightly stronger shadow + accent ring on hover — the lead card. */
	featured?: boolean;
};

/**
 * A single slider card. Default state is compact (tag + title only, most of
 * the card showing image); hovering grows the panel to reveal the
 * description, which visually pushes the image up and out of view.
 */
export default function CaseStudyCard({ data, featured = false }: Props) {
	const live = Boolean(data.slug);

	const card = (
		<article
			data-slider-card
			className={`group relative flex aspect-3/4 w-[78vw] max-w-90 shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[1.8rem] ring-1 ring-black/5 transition-shadow duration-300 ${
				featured
					? "shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
					: "shadow-[0_10px_30px_rgba(0,0,0,0.07)]"
			}`}
		>
			{/* Background image — subtle push-up on hover as the panel grows */}
			<div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:blur-sm">
				<Placeholder
					label={data.imgLabel}
					src={data.imgSrc}
					rounded="rounded-none"
				/>
			</div>

			{/* Content panel: grows taller on hover to reveal the description; the
          CTA row stays pinned to the bottom via the flex-1 spacer above it. */}
			<div className="relative m-2.5 flex min-h-[44%] flex-col rounded-[1.4rem] bg-white/95 p-5 backdrop-blur transition-[min-height] duration-300 ease-out group-hover:min-h-[68%] group-hover:m-0 group-hover:transition-all">
				<div className="flex-1">
					{data.tagColor ? (
						<Badge color={data.tagColor}>{data.tag}</Badge>
					) : (
						<Badge tone={data.tagTone}>{data.tag}</Badge>
					)}
					<h3 className="mt-3 text-xl font-bold leading-snug text-ink">
						{data.title}
					</h3>

					{data.desc && (
						<div className="mt-0 grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-2 group-hover:grid-rows-[1fr] group-hover:opacity-100">
							<p className="min-h-0 overflow-hidden text-sm text-ink/55">
								{data.desc}
							</p>
						</div>
					)}
				</div>

				<div>
					{live ? (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition-transform group-hover:scale-[1.03]">
							Read Case Study
						</span>
					) : (
						<span className="text-sm font-bold text-accent/70">
							Coming soon...
						</span>
					)}
				</div>
			</div>
		</article>
	);

	return live ? (
		<Link to={`/case-studies/${data.slug}`} className="shrink-0">
			{card}
		</Link>
	) : (
		card
	);
}
