# Portfolio website — agent entry point

React 18 + Vite 6 + Tailwind v4 + Motion + Lenis portfolio site for Alex Zenchik (home page + case-study pages) with a Vercel Edge function (`api/contact.ts`) that forwards the contact form to Telegram.

**Start with [docs/README.md](docs/README.md)** — full documentation (architecture, content model, component catalog, design system, scroll/animation reference, backend/deploy, redesign notes).

Quick rules:
- All copy/links/images: `src/cms/content.ts` and `src/data/projects.ts` (no CMS, no persistence).
- Styling: Tailwind v4 utilities; tokens in `src/index.css` `@theme` (mirrored in `src/design-system/tokens.ts`).
- The home hero and Showcase are pinned with coupled viewport heights (`Home.tsx` `165vh` / `-65vh`, Showcase `320vh`) — read `docs/animation-and-scroll.md` before touching them.
- No tests/linter: verify with `npm run build` (tsc strict + vite) and check visually at several widths and zoom levels.
- `npm run dev` does not serve `/api/contact`; use `npx vercel dev` with `.env.local` (see `.env.example`). Never commit or print secrets.
- Keep `docs/` in sync when you change structure, content schema, tokens or behaviour.
