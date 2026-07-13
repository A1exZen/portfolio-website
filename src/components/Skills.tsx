import Marquee from "./ui/Marquee";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../cms/ContentProvider";

/**
 * Capability / tech-stack section — a credibility signal for clients weighing
 * whether one person can actually build their product. The internal design
 * process lives in the client-facing "How We'll Work" journey instead, so this
 * block is just the tools, presented as scrolling tag rows.
 */
export default function Skills() {
  const { skills } = useContent();
  return (
    <section id="skills" className="overflow-hidden bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading>Tools &amp; Tech</SectionHeading>

        <Reveal className="mx-auto mt-10 max-w-xl text-center" direction="up">
          <p className="text-lg leading-relaxed text-ink/60">
            The full toolkit I design and build with — so you get a finished
            product, not a stack of handoffs.
          </p>
        </Reveal>

        <div className="mt-16 space-y-12 sm:mt-20 sm:space-y-14">
          {skills.groups.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.05} direction="up">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
                <div className="flex shrink-0 items-baseline gap-3 sm:w-52">
                  <span className="font-pixel text-2xl font-bold text-accent">
                    {g.index}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                    {g.label}
                  </h3>
                </div>
                <Marquee
                  items={g.tags}
                  direction={i % 2 === 0 ? "left" : "right"}
                  className="mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
