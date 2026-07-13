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
	/** Shown only on hover (desktop), always visible on touch. */
	desc?: string;
	/** Present => links to the live case study; absent => "Coming soon". */
	slug?: string;
	imgLabel: string;
	imgSrc?: string;
};

type Props = {
	data: CaseStudyCardData;
	/** Slightly stronger shadow — the lead card. */
	featured?: boolean;
};

// Shared expo-out easing so every transition on the card feels of a piece.
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * A single slider card. The caption panel is flush with the card's bottom and
 * side edges (rounded top only) so no background ever peeks out beneath it.
 * On desktop it's compact (tag + title) and grows upward on hover to reveal
 * the description; on touch there's no hover, so it stays expanded by default.
 */
export default function CaseStudyCard({ data, featured = false }: Props) {
	const live = Boolean(data.slug);

	const card = (
		<article
			data-slider-card
			className={`group relative flex aspect-3/4 w-[78vw] max-w-88 shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[1.75rem] ring-1 ring-black/5 transition-shadow duration-500 ${EASE} hover:shadow-[0_14px_34px_rgba(0,0,0,0.15)] ${
				featured
					? "shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
					: "shadow-[0_10px_28px_rgba(0,0,0,0.09)]"
			}`}
		>
			{/* Background image — slow zoom on hover, clipped by the card */}
			<div className="absolute inset-0 overflow-hidden">
				<div
					className={`h-full w-full transition-transform duration-800 ${EASE} group-hover:scale-[1.06]`}
				>
					<Placeholder
						label={data.imgLabel}
						src={data.imgSrc}
						rounded="rounded-none"
					/>
				</div>
			</div>

			{/* Caption panel — flush to bottom/side edges, rounded top only */}
			<div
				className={`relative flex min-h-[56%] flex-col rounded-t-[1.4rem] bg-white/95 p-5 backdrop-blur-md transition-[min-height] duration-500 ${EASE} sm:min-h-[42%] sm:group-hover:min-h-[66%]`}
			>
				<div className="flex-1">
					{data.tagColor ? (
						<Badge color={data.tagColor}>{data.tag}</Badge>
					) : (
						<Badge tone={data.tagTone}>{data.tag}</Badge>
					)}
					<h3 className="mt-3 text-lg font-bold leading-snug text-ink sm:text-xl">
						{data.title}
					</h3>

					{data.desc && (
						<div
							className={`grid grid-rows-[1fr] opacity-100 transition-all duration-500 ${EASE} sm:mt-0 sm:grid-rows-[0fr] sm:opacity-0 sm:group-hover:grid-rows-[1fr] sm:group-hover:opacity-100`}
						>
							<p className="mt-2 min-h-0 overflow-hidden text-sm leading-relaxed text-ink/55">
								{data.desc}
							</p>
						</div>
					)}
				</div>

				<div className="mt-4">
					{live ? (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition-transform duration-300 group-hover:scale-[1.03]">
							Read Case Study
							<ArrowIcon />
						</span>
					) : (
						<span className="text-sm font-bold text-accent/70">
							Coming soon…
						</span>
					)}
				</div>
			</div>
		</article>
	);

	return live ? (
		<Link
			to={`/case-studies/${data.slug}`}
			className="shrink-0 cursor-pointer"
		>
			{card}
		</Link>
	) : (
		card
	);
}

function ArrowIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden
			className="transition-transform duration-300 group-hover:translate-x-0.5"
		>
			<path
				d="M5 12h14m0 0-6-6m6 6-6 6"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
