import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLenis } from "../lib/lenis";

type Phase = "idle" | "covering" | "revealing";

const COLS = 5;
const DURATION = 0.62;
const STAGGER = 0.06;
const HOLD_MS = 120;
// Smooth, weighted expo curve — slow-in, slow-out.
const EASE = [0.83, 0, 0.17, 1] as const;

// Total time for one full sweep across every staggered column.
const SWEEP_MS = (DURATION + STAGGER * (COLS - 1)) * 1000;

/**
 * Route-change transition: a set of vertical panels sweep up in a staggered
 * cascade to cover the viewport, the route swaps + scroll resets underneath,
 * then the panels continue upward (staggered from the other side) to reveal the
 * new page. One continuous directional motion, layered for depth.
 *
 * Intercepts clicks on same-origin, same-tab links anywhere in the app so no
 * individual `<Link>` needs to be touched.
 */
export default function PageTransition() {
	const navigate = useNavigate();
	const location = useLocation();
	const [phase, setPhase] = useState<Phase>("idle");
	const pendingHref = useRef<string | null>(null);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
				return;
			const a = (e.target as HTMLElement).closest(
				"a",
			) as HTMLAnchorElement | null;
			if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

			const url = new URL(a.href, window.location.href);
			if (url.origin !== window.location.origin) return; // external / mailto / tel
			if (url.pathname === location.pathname) return; // same-page anchor

			e.preventDefault();
			pendingHref.current = url.pathname + url.search + url.hash;
			setPhase("covering");
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [location.pathname]);

	// Phase machine driven by timers so the staggered columns stay in sync
	// regardless of which one finishes last.
	useEffect(() => {
		if (phase === "covering") {
			const t = window.setTimeout(() => {
				if (pendingHref.current) {
					navigate(pendingHref.current);
					pendingHref.current = null;
				}
				const lenis = getLenis();
				if (lenis) lenis.scrollTo(0, { immediate: true });
				else window.scrollTo(0, 0);
				window.setTimeout(() => setPhase("revealing"), HOLD_MS);
			}, SWEEP_MS);
			return () => window.clearTimeout(t);
		}
		if (phase === "revealing") {
			const t = window.setTimeout(() => setPhase("idle"), SWEEP_MS);
			return () => window.clearTimeout(t);
		}
	}, [phase, navigate]);

	const active = phase !== "idle";

	return (
		<div
			aria-hidden
			className="fixed inset-0 z-999 flex"
			style={{ pointerEvents: active ? "auto" : "none" }}
		>
			{Array.from({ length: COLS }).map((_, i) => {
				// Covering cascades left→right; revealing continues from the same
				// leading edge so the motion reads as one continuous pass.
				const delay =
					phase === "revealing" ? (COLS - 1 - i) * STAGGER : i * STAGGER;
				// Parked below the fold; up to cover; further up to reveal.
				const y =
					phase === "covering" ? "0%" : phase === "revealing" ? "-101%" : "101%";

				return (
					<motion.div
						key={i}
						initial={{ y: "101%" }}
						animate={{ y }}
						transition={{
							duration: phase === "idle" ? 0 : DURATION,
							ease: EASE,
							delay: phase === "idle" ? 0 : delay,
						}}
						className="relative h-full flex-1 bg-ink"
					>
						{/* Leading accent edge on the top of each panel */}
						<span className="absolute inset-x-0 top-0 h-1 bg-accent" />
					</motion.div>
				);
			})}

			{/* Centered monogram, fading in only while the screen is covered */}
			<AnimatePresence>
				{active && (
					<motion.span
						initial={{ opacity: 0, scale: 0.9, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: -10 }}
						transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						className="pointer-events-none absolute inset-0 grid place-items-center font-pixel text-4xl font-bold tracking-wide text-white/90 sm:text-5xl"
					>
						AZ
					</motion.span>
				)}
			</AnimatePresence>
		</div>
	);
}
