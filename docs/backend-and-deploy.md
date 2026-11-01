# Backend, form & deployment

## Contact form flow

```
WorkWithMe (browser)  ──POST /api/contact (JSON)──►  api/contact.ts (Vercel Edge)  ──►  Telegram Bot API sendMessage  ──►  Alex's chat
```

### Client — `src/components/WorkWithMe.tsx`
State: `{ name, email, type, budget, message, company }` + `status: idle | sending | sent | error`.

| Field | Control | Required | Options |
|---|---|---|---|
| `name` | text | ✅ | |
| `email` | email | ✅ | |
| `type` ("What do you need?") | select | — | Landing page · Business website / store · Web app / dashboard · Mobile app · Redesign of an existing product · Something else (default first) |
| `budget` | select | — | Under $1,000 · $1,000–3,000 · $3,000–8,000 · $8,000+ · Not sure yet (default last) |
| `message` | textarea | ✅ | |
| `company` | hidden text (honeypot, positioned off-screen, `tabIndex=-1`, `aria-hidden`) | — | must stay empty |

The option lists (`projectTypes`, `budgets`) are constants at the top of the component, **not** in `content.ts`.

On submit: `fetch("/api/contact", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(form) })`. Non-2xx or network error ⇒ `status="error"` ⇒ inline message with a prefilled `mailto:` link (`contact.email`). Success ⇒ animated "Brief sent — I'll reply within 24 hours" panel (form is replaced; there is no reset/send-another).

Under the intro text, social links come from `contact.socials`.

### Server — `api/contact.ts`
- `export const config = { runtime: "edge" }`; default-exported `handler(req: Request): Promise<Response>`.
- `405` for non-POST; `500 {"error":"Server is not configured"}` if `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` missing; `400` for invalid JSON or missing `name/email/message`.
- Honeypot: non-empty `company` ⇒ returns `200 {ok:true}` without sending.
- Sanitising: `clean()` = string check + `trim()` + `slice(max)` (name/email/type/budget 200, message 4000). No HTML is sent (plain `text`, no `parse_mode`), no email-format check beyond the browser's `type=email`.
- Message format:
  ```
  🆕 New project enquiry

  Name: …
  Email: …
  Type: …        (if present)
  Budget: …      (if present)

  <message>
  ```
- Telegram failure ⇒ `502 {"error":"Failed to deliver message","detail":"<raw Telegram response>"}` and `console.error` in Vercel logs. The `detail` echo is a temporary debugging aid (see [redesign-notes.md](redesign-notes.md#backend)).
- Success ⇒ `200 {"ok":true}`.

Not implemented: rate limiting, CAPTCHA, CORS handling (same-origin only), email delivery, storing leads, analytics events, `tsconfig` coverage of `api/` (`tsconfig.json` includes only `src` and `vite.config.ts`, so `api/` is not type-checked by `npm run build`; Vercel compiles it itself).

## Environment variables

| Name | Purpose |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather (`/newbot`) |
| `TELEGRAM_CHAT_ID` | Numeric chat id that receives enquiries (own user id via @userinfobot, or a group id starting with `-`) |

Local: copy `.env.example` → `.env.local` (git-ignored; `.env` and `.env.*.local` are ignored too). Production: Vercel dashboard → Project → Settings → Environment Variables. **Never commit real values** and never echo them in docs, logs or chat.

## Running locally

- `npm run dev` → UI only. Submitting the form shows the error state because Vite does not serve `/api/*`.
- `npx vercel dev` → serves the app and the edge function (reads `.env.local`). Requires `vercel login`/link (the repo has a `.vercel/` link locally, ignored by git).

## Build & deploy

- Build: `npm run build` → type-check `src` then `vite build` to `dist/` (static SPA + hashed assets).
- Hosting: Vercel (framework preset Vite; `api/` auto-detected as functions). `dist/` and `.vercel/` are git-ignored.
- **SPA fallback:** there is no `vercel.json` in the repo. Direct loads or refreshes of `/case-studies/<slug>` need a rewrite to `index.html`; confirm this works on the live deployment (or add a `vercel.json` rewrite) before relying on deep links.
- No CI config. Deploys are presumably git-push or CLI based (`vercel` is a devDependency).
- Git: `main` branch, ~11 commits, simple messages; Co-Authored-By trailers are used for AI-assisted commits.

## SEO / meta (current)

Only `index.html`: `<title>`, `<meta name=description>`, Google Fonts preconnects, favicon `/logo.png`. After mount, `useDocTitle` overwrites the title with `"{meta.name} — {meta.title}"` (the two titles differ slightly). Missing: Open Graph / Twitter tags, canonical, sitemap, robots, structured data, per-case-study titles/descriptions (the SPA does not update meta per route), prerendering (content is client-rendered, so crawlers without JS see an empty `#root`).
