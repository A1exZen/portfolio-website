import { useEffect, useState } from "react";

/** Tracks a max-width media query — used to tone effects down on phones. */
export default function useIsNarrow(breakpoint = 640) {
	const [narrow, setNarrow] = useState(
		() => typeof window !== "undefined" && window.innerWidth < breakpoint,
	);
	useEffect(() => {
		const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
		const onChange = () => setNarrow(mq.matches);
		onChange();
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [breakpoint]);
	return narrow;
}
