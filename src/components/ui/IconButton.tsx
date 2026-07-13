import { motion } from "motion/react";
import type { ReactNode } from "react";
import { spring } from "../../design-system/tokens";

type Props = {
  onClick?: () => void;
  ariaLabel: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

/** Circular icon button — slider controls and other compact actions. */
export default function IconButton({
  onClick,
  ariaLabel,
  disabled,
  children,
  className = "",
}: Props) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={spring.snappy}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white shadow-lg transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-0 ${className}`}
    >
      {children}
    </motion.button>
  );
}
