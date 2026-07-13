import { motion } from "motion/react";

type Props = {
  children: string;
  className?: string;
};

/**
 * Pixel-font section title with a hand-drawn wavy underline.
 * Animates in with a soft rise + fade when scrolled into view.
 */
export default function SectionHeading({ children, className = "" }: Props) {
  return (
    <div className={`flex justify-center ${className}`}>
      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="wavy font-pixel text-3xl sm:text-4xl font-bold uppercase tracking-wide text-ink"
      >
        {children}
      </motion.h2>
    </div>
  );
}
