import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLenis } from "../lib/lenis";

type Phase = "idle" | "covering" | "revealing";

const FADE_IN_MS = 320;
const FADE_OUT_MS = 480;
const HOLD_MS = 60;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Route-change transition: a soft veil in the page colour fades over the
 * screen, the route swaps and scroll resets underneath, then the veil lifts
 * while the new page drifts up a few pixels into place.
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
			}, FADE_IN_MS);
			return () => window.clearTimeout(t);
		}
		if (phase === "revealing") {
			const t = window.setTimeout(() => setPhase("idle"), FADE_OUT_MS);
			return () => window.clearTimeout(t);
		}
	}, [phase, navigate]);

	// Nudge the incoming page up into place as the veil lifts.
	useEffect(() => {
		if (phase !== "revealing") return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const main = document.querySelector("main");
		main?.animate(
			[
				{ transform: "translateY(18px)", opacity: 0.6 },
				{ transform: "translateY(0)", opacity: 1 },
			],
			{ duration: FADE_OUT_MS, easing: "cubic-bezier(0.22,1,0.36,1)" },
		);
	}, [phase]);

	return (
		<motion.div
			aria-hidden
			initial={false}
			animate={{ opacity: phase === "covering" ? 1 : 0 }}
			transition={{
				duration: (phase === "covering" ? FADE_IN_MS : FADE_OUT_MS) / 1000,
				ease: EASE,
			}}
			className="fixed inset-0 z-999 bg-cloud"
			style={{ pointerEvents: phase === "idle" ? "none" : "auto" }}
		/>
	);
}
