import { motion } from "motion/react";

type Props = {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  className?: string;
};

/** Pill-shaped pagination track — the active dot widens into a bar. */
export default function Dots({ count, active, onSelect, className = "" }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-black/8 px-3 py-2.5 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={active === i}
          onClick={() => onSelect?.(i)}
          animate={{ width: active === i ? 18 : 7 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`h-1.5 rounded-full transition-colors ${
            active === i ? "bg-ink/70" : "bg-ink/20"
          }`}
        />
      ))}
    </div>
  );
}
