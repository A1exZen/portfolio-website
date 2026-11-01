import { lazy, Suspense } from "react";

// three.js is large, so it loads after first paint; the sky gradient
// below is already on screen while it arrives.
const HeroSky = lazy(() => import("./HeroSky"));

/**
 * Hero backdrop: a dusk-navy sky (deep but not black, a little lighter toward
 * the bottom) with a layered parallax starfield on top.
 * Used by the home hero and the case-study cover. The canvas takes pointer
 * input, so text layered above it must be pointer-events-none (links excepted).
 */
export default function HeroBackdrop() {
	return (
		<div
			className="absolute inset-0 overflow-hidden"
			style={{
				background:
					[
					// Faint colour clouds (CSS, so the falloff is perfectly smooth).
					"radial-gradient(ellipse 38% 45% at 18% 28%, rgba(120,90,255,0.16), transparent 70%)",
					"radial-gradient(ellipse 42% 50% at 82% 68%, rgba(40,130,255,0.15), transparent 70%)",
					"radial-gradient(ellipse 100% 80% at 50% 105%, #34457f 0%, #222d5c 40%, #151c3d 100%)",
				].join(", "),
			}}
		>
			<Suspense fallback={null}>
				<HeroSky />
			</Suspense>
		</div>
	);
}
