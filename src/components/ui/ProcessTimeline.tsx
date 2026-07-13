import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export type ProcessStep = { step: string; detail?: string };

/**
 * Scroll-driven process timeline. Each step's number pins in place while its
 * text scrolls past underneath — a single spine line runs behind the whole
 * stack, and each row fades/rises into place as it becomes the active step.
 */
export default function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-[22px] top-5 bottom-5 w-px bg-black/10"
      />
      {steps.map((s, i) => (
        <StepRow
          key={s.step}
          index={i}
          total={steps.length}
          step={s}
        />
      ))}
    </div>
  );
}

function StepRow({
  index,
  total,
  step,
}: {
  index: number;
  total: number;
  step: ProcessStep;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <div
      ref={ref}
      className={`relative grid grid-cols-[44px_1fr] gap-6 sm:gap-10 ${
        index === total - 1 ? "pb-0" : "pb-12 sm:pb-16"
      }`}
    >
      <div className="sticky top-24 z-10 self-start sm:top-28">
        <motion.span
          style={{ scale }}
          className="grid h-11 w-11 place-items-center rounded-full bg-accent font-pixel text-lg font-bold text-white shadow-[0_8px_20px_rgba(43,127,255,0.35)]"
        >
          {index + 1}
        </motion.span>
      </div>

      <motion.div style={{ opacity, y }} className="pt-1.5 sm:pt-2">
        <p className="text-lg font-bold text-ink sm:text-xl">{step.step}</p>
        {step.detail && (
          <p className="mt-1.5 max-w-md text-ink/55">{step.detail}</p>
        )}
      </motion.div>
    </div>
  );
}
