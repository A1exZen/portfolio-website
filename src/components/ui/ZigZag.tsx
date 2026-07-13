type Props = {
	/** Which way the teeth point. */
	direction?: "up" | "down";
	/** Fill colour of the solid band (the teeth are cut into the opposite edge). */
	fill?: string;
	className?: string;
};

// Base polygon: a solid band along the bottom with teeth cut into the TOP edge,
// alternating between y=8 (valley) and y=52 (peak) — i.e. teeth pointing up.
const TEETH_UP =
	"0,60 0,8 40,52 80,8 120,52 160,8 200,52 240,8 280,52 320,8 360,52 400,8 440,52 480,8 520,52 560,8 600,52 640,8 680,52 720,8 760,52 800,8 840,52 880,8 920,52 960,8 1000,52 1040,8 1080,52 1120,8 1160,52 1200,8 1240,52 1280,8 1320,52 1360,8 1400,52 1440,8 1440,60";

// Same teeth cut into the BOTTOM edge instead (teeth pointing down).
const TEETH_DOWN =
	"0,0 1440,0 1440,52 1400,8 1360,52 1320,8 1280,52 1240,8 1200,52 1160,8 1120,52 1080,8 1040,52 1000,8 960,52 920,8 880,52 840,8 800,52 760,8 720,52 680,8 640,52 600,8 560,52 520,8 480,52 440,8 400,52 360,8 320,52 280,8 240,52 200,8 160,52 120,8 80,52 40,8 0,52";

/**
 * A jagged transition edge. Renders a solid band whose exposed edge is a row of
 * triangular teeth — used to knit one section into the next.
 */
export default function ZigZag({
	direction = "down",
	fill = "#ffffff",
	className = "h-[42px] w-full sm:h-[60px]",
}: Props) {
	return (
		<svg
			viewBox="0 0 1440 60"
			preserveAspectRatio="none"
			className={`block leading-[0] ${className}`}
			aria-hidden
		>
			<polygon
				fill={fill}
				points={direction === "up" ? TEETH_UP : TEETH_DOWN}
			/>
		</svg>
	);
}
