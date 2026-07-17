import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const homeLinks = [
	{ label: "Services", href: "/#services" },
	{ label: "Work", href: "/#work" },
	// Pricing temporarily disabled — uncomment when the Packages section returns.
	// { label: "Pricing", href: "/#pricing" },
	{ label: "About", href: "/#background" },
	{ label: "FAQ", href: "/#faq" },
];

const caseLinks = [
	{ label: "Problem", href: "#problem" },
	{ label: "Solution", href: "#solution" },
	{ label: "Outcome", href: "#outcome" },
];

const spring = { type: "spring" as const, stiffness: 220, damping: 28 };

// The entrance animation should play exactly once, on the very first paint of
// the app — never again on route changes or dev/StrictMode remounts. A
// module-scoped flag survives remounts within a session.
let hasIntroPlayed = false;

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [playIntro] = useState(() => !hasIntroPlayed);
	const { scrollY } = useScroll();
	const { pathname } = useLocation();

	useEffect(() => {
		hasIntroPlayed = true;
	}, []);

	const isCase = pathname.startsWith("/case-studies/");
	// On a case study the full nav is always shown; on home it expands on scroll.
	const expanded = isCase || scrolled;

	useMotionValueEvent(scrollY, "change", v => setScrolled(v > 40));

	const links = isCase ? caseLinks : homeLinks;

	// Close the mobile menu whenever the route changes.
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	return (
		<motion.header
			initial={playIntro ? { y: -24, opacity: 0 } : false}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4"
		>
			<div className="relative flex flex-col items-center">
				<motion.nav
					layout
					transition={spring}
					className="flex items-center gap-2 rounded-full bg-white/85 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.10)] ring-1 ring-black/5 backdrop-blur-xl sm:gap-5"
				>
					<Link
						to="/"
						className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-black/5"
						aria-label="Home"
						onClick={() => setMobileOpen(false)}
					>
						<Avatar />
					</Link>

					<AnimatePresence initial={false} mode="popLayout">
						{expanded && (
							<motion.div
								key="links"
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ opacity: { duration: 0.18 } }}
								className="hidden items-center overflow-hidden md:flex"
							>
								{links.map(l => (
									<motion.a
										key={l.label}
										href={l.href}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.94 }}
										transition={{ type: "spring", stiffness: 400, damping: 15 }}
										className="inline-block whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-semibold text-ink/70 underline decoration-wavy decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:decoration-ink"
									>
										{l.label}
									</motion.a>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					<MenuToggle open={mobileOpen} onClick={() => setMobileOpen(v => !v)} />

					{isCase ? (
						<CtaButton to="/">Return Home</CtaButton>
					) : (
						<CtaButton href="/#start-project">Start a Project</CtaButton>
					)}
				</motion.nav>

				{/* Mobile links panel — only ever rendered below md */}
				<AnimatePresence>
					{mobileOpen && (
						<motion.div
							key="mobile-links"
							initial={{ opacity: 0, y: -8, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.96 }}
							transition={spring}
							className="absolute left-1/2 top-[calc(100%+10px)] z-50 flex w-56 -translate-x-1/2 flex-col gap-1 rounded-3xl bg-white/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 backdrop-blur-xl md:hidden"
						>
							{links.map(l => (
								<a
									key={l.label}
									href={l.href}
									onClick={() => setMobileOpen(false)}
									className="rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink/70 transition-colors hover:bg-black/5 hover:text-ink"
								>
									{l.label}
								</a>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Backdrop — dims the page and closes the menu on outside tap */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.button
						key="backdrop"
						type="button"
						aria-label="Close menu"
						onClick={() => setMobileOpen(false)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 -z-10 bg-black/10 backdrop-blur-[2px] md:hidden"
					/>
				)}
			</AnimatePresence>
		</motion.header>
	);
}

/** Animated hamburger ↔ close icon — mobile only. */
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			aria-label={open ? "Close menu" : "Open menu"}
			aria-expanded={open}
			onClick={onClick}
			className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-black/5 md:hidden"
		>
			<span className="relative flex h-4 w-4.5 flex-col justify-between">
				<motion.span
					animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
					transition={spring}
					className="h-0.5 w-full rounded-full bg-current"
				/>
				<motion.span
					animate={open ? { opacity: 0 } : { opacity: 1 }}
					transition={{ duration: 0.15 }}
					className="h-0.5 w-full rounded-full bg-current"
				/>
				<motion.span
					animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
					transition={spring}
					className="h-0.5 w-full rounded-full bg-current"
				/>
			</span>
		</button>
	);
}

/**
 * Primary pill CTA. On hover, blue parentheses ease in on either side of the
 * pill — "( Work with Me )".
 */
function CtaButton({
	children,
	to,
	href,
}: {
	children: React.ReactNode;
	to?: string;
	href?: string;
}) {
	const pill =
		"block shrink-0 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-[15px] font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-[1.03] group-hover:bg-accent-strong active:scale-95";

	return (
		<span className="group relative shrink-0">
			<span className="pointer-events-none absolute -left-3 top-1/2 -translate-y-1/2 translate-x-2 text-xl font-bold text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
				(
			</span>
			{to ? (
				<Link to={to} className={pill}>
					{children}
				</Link>
			) : (
				<a href={href} className={pill}>
					{children}
				</a>
			)}
			<span className="pointer-events-none absolute -right-3 top-1/2 -translate-x-2 -translate-y-1/2 text-xl font-bold text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
				)
			</span>
		</span>
	);
}

/** Simple monochrome doodle avatar (SVG) — replace with your own. */
function Avatar() {
	return (
		// <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden>
		// 	<circle cx="24" cy="24" r="23" fill="#f4f4f5" />
		// 	<path
		// 		d="M14 22c0-8 6-12 10-12s10 4 10 12c1 2 1 5-1 6-1 5-5 8-9 8s-8-3-9-8c-2-1-2-4-1-6Z"
		// 		fill="#e7e7ea"
		// 		stroke="#111"
		// 		strokeWidth="1.6"
		// 	/>
		// 	<path
		// 		d="M13 20c2-6 8-8 11-8s9 2 11 8c-4-3-7-4-11-4s-7 1-11 4Z"
		// 		fill="#111"
		// 	/>
		// 	<circle cx="20" cy="26" r="1.6" fill="#111" />
		// 	<circle cx="29" cy="26" r="1.6" fill="#111" />
		// 	<path
		// 		d="M20 32c2 1.5 6 1.5 8 0"
		// 		stroke="#111"
		// 		strokeWidth="1.5"
		// 		fill="none"
		// 		strokeLinecap="round"
		// 	/>
		// 	<path
		// 		d="M18 33c1 3 2 5 3 6M30 33c-1 3-2 5-3 6"
		// 		stroke="#111"
		// 		strokeWidth="1.2"
		// 		fill="none"
		// 		strokeLinecap="round"
		// 	/>
		// </svg>
		<img
			src="/logo.png"
			alt="Avatar"
			width={36}
			height={36}
			className="h-9 w-9 rounded-full"
		/>
	);
}
