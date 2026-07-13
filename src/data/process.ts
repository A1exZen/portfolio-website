import type { ProcessStep } from "../components/ui/ProcessTimeline";

/**
 * The design process, straight from the "Design Process" line of the
 * resume. Shared between the Skills section and every case study's
 * "approach" step so the site tells one consistent story.
 */
export const designProcess: ProcessStep[] = [
  {
    step: "Discovery & Requirements",
    detail: "Translating goals into flows and information architecture",
  },
  { step: "Wireframing", detail: "Low-fidelity structure before pixels" },
  {
    step: "Mid/Hi-Fi Prototyping",
    detail: "Figma prototypes ready for real feedback",
  },
  {
    step: "Design-to-Dev Handoff",
    detail: "Component libraries and specs engineering can build from",
  },
  { step: "Iteration on Feedback", detail: "Refining from real usage" },
];
