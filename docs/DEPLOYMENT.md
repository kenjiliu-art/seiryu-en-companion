# Deployment

Current production is Lovable's hosting, backed by Cloudflare Workers. The
same build runs unmodified on Vercel and Netlify.

## Current setup (as shipped from Lovable)

| Setting | Value |
|---|---|
| Hosting | Lovable (Cloudflare Workers under the hood) |
| Production URL | https://poem-paths-explore.lovable.app |
| Preview URL | https://id-preview--e8cdb473-d790-42e9-bf3e-16e1633d5f94.lovable.app |
| Build command | `bun run build` (i.e. `vite build`) |
| Output | TanStack Start bundle; server entry `src/server.ts` |
| Deployment branch | Whatever branch you connect to GitHub (Lovable will sync from `main` by default) |
| Custom domain | None configured; add in Lovable Project Settings → Domains, or on your new host |
| Env vars | None |
| Redirects / rewrites / headers | None custom |
| Caching | Vite emits hashed asset filenames; host applies default long-cache for `/assets/*` |
| Serverless / edge functions | None (SSR entry only) |
| Scheduled jobs / cron | None |
| Webhooks | None |
| Preview deployments | Lovable maintains one per branch |

Worker config: `wrangler.jsonc`

```jsonc
{
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts"
}
```

## Deploying without Lovable

### Option A — Vercel (recommended for simplicity)

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Framework preset: **Vite**. Build command: `bun run build`
   (or `npm run build`). Output directory: leave default (TanStack Start
   handles it).
4. **Node version:** 22.x.
5. No environment variables required.
6. Deploy.

If TanStack Start's SSR entry needs a specific adapter, install the
official Vercel adapter later — the current build already produces a
Node-compatible server entry (`src/server.ts`).

### Option B — Netlify

1. Push to GitHub, connect the repo in Netlify.
2. Build command: `bun run build`. Publish dir: whatever the build reports
   (default is `dist/`).
3. Node 22.x.
4. No env vars.

### Option C — Cloudflare Workers (parity with current hosting)

1. `bun install -g wrangler` (or use `bunx wrangler`).
2. `wrangler login`.
3. `bun run build`.
4. `wrangler deploy`.
5. Add a custom domain in the Cloudflare dashboard.

### DNS / custom domain

Whichever host you pick:

- Point an `A`/`AAAA` (or `CNAME` for subdomains) record at the host's
  target as documented in their dashboard.
- Enable HTTPS (all three hosts auto-provision).

## Post-deploy sanity checks

- Load `/`, confirm the map renders and pins are interactive.
- Open a plant Dialog, confirm the Wikipedia thumbnail loads.
- Open a camera pin, scroll through the carousel.
- Toggle the Season panel; today's kō and tint appear.
- On a phone-sized viewport, confirm the Plant Legend opens as a bottom sheet.
