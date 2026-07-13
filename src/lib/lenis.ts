import type Lenis from "lenis";

// Lenis is a true app-wide singleton — a module-level reference avoids the
// overhead of a React context for something created/destroyed exactly once.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}
