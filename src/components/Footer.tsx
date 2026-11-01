import { motion } from "motion/react";
import { useContent } from "../cms/ContentProvider";
import { color } from "../design-system/tokens";
import ZigZag from "./ui/ZigZag";

/**
 * Blue footer with a zigzag top edge. An oversized wordmark rises out of the
 * bottom as the footer scrolls into view, a quiet sign-off for the page.
 */
export default function Footer({
	/** Colour behind the zigzag teeth: whatever section sits above the footer. */
	above = "bg-white",
}: {
	above?: string;
}) {
	const { footer, meta } = useContent();
	return (
		<footer className={`relative overflow-hidden ${above}`}>
			<ZigZag
				direction="up"
				fill={color.accentDeep}
				className="-mb-px block h-[42px] w-full sm:h-[60px]"
			/>
			<div className="bg-accent-deep text-white">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 pt-12 sm:flex-row">
					<p className="text-center font-pixel text-[15px] tracking-wide text-white/85 sm:text-left">
						© {new Date().getFullYear()} {footer.name}
					</p>
					<nav
						aria-label="Social links"
						className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold"
					>
						{footer.socials.map(s => (
							<a
								key={s.label}
								href={s.href}
								target="_blank"
								rel="noreferrer"
								className="text-white/85 underline decoration-transparent decoration-wavy decoration-1 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white"
							>
								{s.label}
							</a>
						))}
					</nav>
				</div>

				<div aria-hidden className="mt-10 overflow-hidden">
					<motion.p
						initial={{ y: "45%", opacity: 0 }}
						whileInView={{ y: "18%", opacity: 1 }}
						viewport={{ once: true, margin: "0px 0px -40px 0px" }}
						transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
						className="select-none whitespace-nowrap text-center font-pixel text-[12.5vw] font-bold uppercase leading-[0.8] tracking-tight text-white/12"
					>
						{meta.name}
					</motion.p>
				</div>
			</div>
		</footer>
	);
}
