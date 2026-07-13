/**
 * Design tokens — single source of truth for values used outside Tailwind
 * classes (inline styles, Framer Motion transitions). Colours and fonts are
 * defined once in `src/index.css` under `@theme`; these mirror that same
 * scale so JS and CSS never drift apart.
 */

export const color = {
  ink: "#111113",
  muted: "#6b7280",
  cloud: "#ececed",
  paper: "#f4f4f5",
  accent: "#2b7fff",
  accentStrong: "#1a6dff",
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 28,
  pill: 999,
} as const;

export const shadow = {
  sm: "0 10px 30px rgba(0,0,0,0.07)",
  md: "0 18px 50px rgba(0,0,0,0.12)",
  lg: "0 40px 90px rgba(0,0,0,0.28)",
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1],
} as const;

export const spring = {
  /** Quick, lively — hovers, icon buttons, small taps. */
  snappy: { type: "spring", stiffness: 400, damping: 15 },
  /** Gentle settle — nav pill resize, larger surface moves. */
  soft: { type: "spring", stiffness: 220, damping: 28 },
  /** Card lifts and slider motion. */
  card: { type: "spring", stiffness: 300, damping: 24 },
} as const;

export const duration = {
  fast: 0.18,
  base: 0.3,
  slow: 0.6,
  reveal: 0.7,
} as const;
