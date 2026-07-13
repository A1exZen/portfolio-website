import { motion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

type Props = {
  children: ReactNode;
  delay?: number;
  /** How far it travels before settling (px). */
  distance?: number;
  direction?: Direction;
  once?: boolean;
  className?: string;
};

function offset(direction: Direction, d: number) {
  switch (direction) {
    case "up":
      return { y: d };
    case "down":
      return { y: -d };
    case "left":
      return { x: d };
    case "right":
      return { x: -d };
    case "scale":
      return { scale: 0.92 };
    case "fade":
    default:
      return {};
  }
}

/** Fades + moves its children into view every time they scroll into view. */
export default function Reveal({
  children,
  delay = 0,
  distance = 24,
  direction = "up",
  once = false,
  className,
}: Props) {
  const from = offset(direction, distance);
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
