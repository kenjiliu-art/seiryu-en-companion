# Man'yōshū Garden Map

An interactive illustrated map of the JACCC (Japanese American Cultural &
Community Center) Man'yōshū-inspired garden in Los Angeles. Every plant on
the map links to its Japanese name, description, and the poems from the
8th-century *Man'yōshū* anthology that reference it. A seasonal overlay
tracks Japan's 72 microseasons (*shichijūni-kō*) alongside the LA growing
calendar, with a per-plant phenology strip.

**Live:** https://poem-paths-explore.lovable.app

## Quick start

```bash
bun install   # or: npm install
bun run dev   # or: npm run dev
# open http://localhost:8080
```

Requires Node ≥ 20.19 (or 22.12+). No database, no auth, no env vars.

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start Vite dev server (SSR) on :8080 |
| `bun run build` | Production build (TanStack Start) |
| `bun run preview` | Preview the production build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier write |

## Where things live

- **`src/routes/index.tsx`** — the whole map page (header, map, pins, sheets, dialog, kō ribbon).
- **`src/data/*.ts`** — all content (plants, poems, bloom windows, kō microseasons).
- **`src/components/ConstructionGallery.tsx`** — camera pins + photo carousels.
- **`src/assets/`** — garden map image and 10 construction photos.
- **`exports/`** — CSV + JSON snapshots of every content record.
- **`docs/`** — deployment, routes, content model, asset inventory, map spec, Lovable-specific dependencies.
- **`TECHNICAL_HANDOFF.md`** — the full handoff document.

## Deployment

See `docs/DEPLOYMENT.md`. Current production is on Cloudflare Workers via
`wrangler.jsonc`; the app also runs cleanly on Vercel or Netlify with the
default TanStack Start build.
