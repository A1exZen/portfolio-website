# Project documentation

Documentation for **Alex Zenchik's portfolio website** — a single-page marketing/portfolio site (React + Vite + Tailwind v4 + Motion) with one serverless endpoint that forwards the contact form to Telegram.

It is written for AI agents and developers picking the project up cold, ahead of the planned UI/UX redesign. Read in this order:

| # | File | Read it when you need to… |
|---|------|---------------------------|
| 1 | [overview.md](overview.md) | Understand what the site is, its stack, commands, folder map |
| 2 | [architecture.md](architecture.md) | Understand the app shell: entry point, routing, providers, scroll engine, page transitions |
| 3 | [content-model.md](content-model.md) | Change copy, projects, case studies, links — the `SiteContent` schema |
| 4 | [components.md](components.md) | Find a component, see what it does, its props, section ids, status (active / disabled / unused) |
| 5 | [design-system.md](design-system.md) | Know the tokens, typography, spacing, motion language and recurring UI patterns |
| 6 | [animation-and-scroll.md](animation-and-scroll.md) | Touch anything sticky, pinned, parallax or scroll-driven (the riskiest area to redesign) |
| 7 | [backend-and-deploy.md](backend-and-deploy.md) | Work on the contact form, env vars, Vercel deployment |
| 8 | [redesign-notes.md](redesign-notes.md) | Plan the redesign: coupling, constraints, known issues, tech debt, checklist |

## Ground rules (TL;DR)

- **Content lives in code.** All copy is in `src/cms/content.ts` (+ `src/data/*`). There is no CMS, no backend store, no persistence. See [content-model.md](content-model.md).
- **Styling is Tailwind v4 utility classes only.** Tokens are declared in `src/index.css` under `@theme`; there is no `tailwind.config`. Almost no custom CSS.
- **No tests, no linter.** The only gates are `tsc` (strict, `noUnusedLocals`/`noUnusedParameters`) and `vite build`: `npm run build`.
- **The homepage is a sales funnel**: hook → proof → offer → trust → objections → action (the form). Keep that order in mind when restructuring.
- **Scroll is smoothed by Lenis**, and the hero is *pinned* with sticky wrappers whose heights are coupled to magic numbers. Read [animation-and-scroll.md](animation-and-scroll.md) before changing any section height.
- **Docs reflect the repo at the time of writing** (see git history). When code and docs disagree, trust the code and fix the docs.
