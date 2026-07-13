import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "../lib/lenis";

/**
 * Global buttery smooth-scrolling via Lenis. Also upgrades in-page hash links
 * (e.g. "#work", "/#background") to eased scrolls. Disabled when the user
 * prefers reduced motion.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      // Lower lerp = the viewport eases toward the target more gently, which
      // reads as a smoother, more weighted scroll.
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: true,
    });
    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Ease same-page anchor links instead of hard-jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return; // different route
      const id = url.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -96 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
