import type { ReactNode } from "react";

type Tone = "neutral" | "dark" | "accent";

type Props = {
	children: ReactNode;
	tone?: Tone;
	/** Raw hex colour for brand-specific tags — overrides `tone` when set. */
	color?: string;
	className?: string;
};

const toneClass: Record<Tone, string> = {
	neutral: "bg-black/5 text-ink",
	dark: "bg-ink text-white",
	accent: "bg-accent text-white",
};

/** Small pill label — project tags, status chips, etc. */
export default function Badge({
	children,
	tone = "neutral",
	color,
	className = "",
}: Props) {
	if (color) {
		return (
			<span
				style={{ backgroundColor: color }}
				className={`inline-block rounded-full px-3 py-1 text-md font-bold text-white ${className}`}
			>
				{children}
			</span>
		);
	}
	return (
		<span
			className={`inline-block rounded-full px-3 py-1 text-md font-bold ${toneClass[tone]} ${className}`}
		>
			{children}
		</span>
	);
}
