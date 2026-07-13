import { motion } from "motion/react";

type Props = {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  className?: string;
};

/** Pill-shaped pagination track — the active dot widens into a bar. Each dot
 * has a generous invisible hit area (via a `before` pseudo-element) so it's
 * comfortable to tap on touch even though the visible bar is small. */
export default function Dots({ count, active, onSelect, className = "" }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full bg-black/8 px-4 py-3 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={active === i}
          onClick={() => onSelect?.(i)}
          whileHover={{ scale: active === i ? 1 : 1.25 }}
          whileTap={{ scale: 0.9 }}
          animate={{ width: active === i ? 28 : 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`relative h-2.5 cursor-pointer rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] ${
            active === i ? "bg-ink/75" : "bg-ink/25 hover:bg-ink/45"
          }`}
        />
      ))}
    </div>
  );
}
