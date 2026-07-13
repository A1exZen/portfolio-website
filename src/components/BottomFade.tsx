import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

/**
 * A fixed strip at the bottom of the viewport that softly blurs and fades the
 * content scrolling underneath it. Fades in once the page has scrolled a little
 * so it never covers the hero at the very top.
 */
export default function BottomFade() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 200));

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-20 sm:h-24"
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        maskImage:
          "linear-gradient(to top, black 15%, rgba(0,0,0,0.6) 55%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, black 15%, rgba(0,0,0,0.6) 55%, transparent 100%)",
        background:
          "linear-gradient(to top, rgba(236,237,237,0.9), rgba(236,237,237,0))",
      }}
    />
  );
}
