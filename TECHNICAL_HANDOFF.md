# Technical Handoff — Man'yōshū Garden Map

**Export date:** 2026-07-23
**Preview URL:** https://id-preview--e8cdb473-d790-42e9-bf3e-16e1633d5f94.lovable.app
**Published URL:** https://poem-paths-explore.lovable.app
**Lovable project ID:** `e8cdb473-d790-42e9-bf3e-16e1633d5f94`

An independent developer can rebuild, run, and deploy this project outside of
Lovable using only this repository. There is no backend database, no
authentication, and no server-side data — everything is static React + curated
TypeScript data files.

---

## 1. Technology Stack

| Concern | Choice | Version | Notes |
|---|---|---|---|
| Language | TypeScript | 5.8.x | `strict: true` |
| UI framework | React | 19.2.x | |
| Meta-framework | TanStack Start | 1.167.x | SSR + file-based routing |
| Router | TanStack Router | 1.168.x | `src/routes/` |
| Build tool | Vite | 7.3.x | |
| Package manager | bun (or npm) | bun 1.x | `bun install` / `npm install` both work |
| Styling | Tailwind CSS | 4.2.x (via `@tailwindcss/vite`) | Tokens in `src/styles.css` |
| UI components | shadcn/ui + Radix primitives | (see `package.json`) | `src/components/ui/*` |
| Icons | lucide-react | 0.575.x | |
| Map interactivity | react-zoom-pan-pinch | 4.0.x | Zoom / pan / pinch |
| Carousel | embla-carousel-react | 8.6.x | Construction photo carousels |
| Forms | react-hook-form + zod + @hookform/resolvers | — | Not currently used at runtime; available via shadcn form primitives |
| Charts | recharts | 2.15.x | Not currently rendered; ships with shadcn |
| Server runtime (SSR) | Cloudflare Workers (workerd) via `@cloudflare/vite-plugin` | 1.25.x | See `wrangler.jsonc` |
| Data source | Static TS files in `src/data/` | — | No database |
| Authentication | **None** | — | Fully public site |
| Analytics | **None** | — | |
| External APIs | Wikipedia REST summary (`en.wikipedia.org/api/rest_v1/page/summary/…`) for plant thumbnails | — | Public, no key |
| External links | `wakapoetry.net` (Man'yōshū poem references) | — | |
| Fonts | Google Fonts (Noto Serif JP, Noto Sans JP, Cormorant Garamond) via `<link>` in `src/routes/__root.tsx` | — | |

### Where each major dependency is used

- **TanStack Router / Start** — every route in `src/routes/`; entry is `src/router.tsx` + `src/start.ts`, SSR entry `src/server.ts`.
- **Tailwind v4** — global styles and design tokens in `src/styles.css`; loaded by `@tailwindcss/vite` in `vite.config.ts`.
- **Radix / shadcn** — `src/components/ui/*` (Dialog, Sheet, Button, Carousel, etc.). The main page uses `Dialog`, `Sheet`, `Button`, and `Carousel`.
- **react-zoom-pan-pinch** — wraps the map image in `src/routes/index.tsx` (`<TransformWrapper>` / `<TransformComponent>`).
- **embla-carousel-react** — used by `src/components/ui/carousel.tsx` inside `src/components/ConstructionGallery.tsx` popovers.
- **lucide-react** — all icons (map pins, chevrons, zoom controls, camera icon).

---

## 2. Repository Layout

```
src/
  routes/
    __root.tsx          Root layout, <head> tags, Google Fonts <link>
    index.tsx           The entire map page (900+ lines): header, map,
                        zoom/pan, plant pins, camera pins, About sheet,
                        Plant Legend sheet, Season sheet with kō ribbon,
                        plant detail Dialog, phenology strip.
  components/
    ConstructionGallery.tsx   Camera-pin overlay + photo carousels
    PlantThumb.tsx            Wikipedia thumbnail loader
    ui/                       shadcn primitives
  data/
    plants.ts           36 plant records (id, names, description, x/y %, MYS refs)
    poems.ts            34 Man'yōshū poems (JP + romaji + English)
    bloom.ts            Per-plant months of visual interest + kind + note
    kou72.ts            72 microseasons (kanji, romaji, EN, sekki tint, LA note)
    plant-images.ts     plant id → Wikipedia article slug
  assets/
    garden-map.jpg      Master map illustration (1696 × 680)
    construction/01.jpg…10.jpg   10 construction photos
  lib/, hooks/          Utilities
  router.tsx, start.ts, server.ts, styles.css, routeTree.gen.ts (generated)
wrangler.jsonc          Cloudflare Worker config (SSR target)
vite.config.ts
package.json
```

---

## 3. Database

**There is no database.** All content is committed source data in
`src/data/*.ts`. Nothing to export from a live DB, no RLS policies, no
migrations, no seed scripts, no auth users. See
`docs/CONTENT_MODEL.md` for the schemas of the in-code data.

If a future maintainer wants to move content into a CMS or database, the
`exports/*.json` and `exports/*.csv` files under this repo are ready-to-import
snapshots of every content record.

---

## 4. Content Exports

Portable snapshots of every content record live in `exports/`:

| File | Description |
|---|---|
| `plants.json` / `plants.csv` | 36 plants — id, names, scientific, description, x/y map %, Man'yōshū refs, substitute flag |
| `poems.json` / `poems.csv` | 34 Man'yōshū poems — preface, JP, romaji, English, author, source URL |
| `plant_interest.json` / `plant_interest.csv` | Per-plant bloom / fruit / foliage months + note |
| `kou72.json` / `kou72.csv` | All 72 microseasons with sekki, kanji, romaji, English, LA-shifted reading, related plant ids |
| `construction_pins.json` / `construction_pins.csv` | 4 camera pins with x/y % and photo filenames |

CSV `months` and `plant_ids` use `|` as an internal separator to stay 1-cell.

---

## 5. Media & Asset Inventory

See `docs/ASSET_INVENTORY.md` for the full table. Summary:

- `src/assets/garden-map.jpg` — master JACCC garden illustration, ~1696×680, used as the map background. **Source: original commissioned/scanned art in this project.** Rights: consult the JACCC / project owner before external redistribution.
- `src/assets/construction/01.jpg` … `10.jpg` — 10 construction-phase photos of the garden build. Credit: Southern California Gardeners Federation (per current on-site caption). Confirm rights with the owner.
- **Plant thumbnails** — fetched at runtime from **Wikipedia REST**
  (CC-BY-SA / public domain via Wikimedia Commons). No files stored locally.
  Article slugs live in `src/data/plant-images.ts`.

No Supabase Storage bucket, no external CDN.

---

## 6. Interactive Map

Full write-up in `docs/MAP.md`. Highlights:

- Source image: `src/assets/garden-map.jpg` (1696 × 680).
- Component: `src/routes/index.tsx` (search for `TransformWrapper`).
- Zoom/pan: `react-zoom-pan-pinch` — wheel, pinch, drag, double-tap.
- Aspect-ratio container so the image fills without cropping.
- Coordinates: **percentages** of the image width/height (`x`, `y` on each plant / pin record, 0–100).
- Pins counter-scale with zoom so they stay a constant visual size.
- Plant markers open a shadcn `Dialog` with description, MYS references,
  phenology strip. Camera markers open an inline shadcn `Carousel`.

Coordinate exports: `exports/plants.csv` (columns `x`, `y`) and
`exports/construction_pins.csv`.

---

## 7. Routes

See `docs/ROUTES.md`. Only two routes exist:

| Route | File | Purpose |
|---|---|---|
| `/` | `src/routes/index.tsx` | Full map + all interactions |
| `__root` | `src/routes/__root.tsx` | HTML shell, `<head>`, font links |

No admin routes, no private routes, no dynamic segments, no API routes.

---

## 8. Authentication & Administration

There is no authentication and no admin surface. Everything is public and
static. The only "editing" is a client-side dev tool in `index.tsx`
(the drag-to-move-pins "Edit mode") that logs new coordinates to the console
via a "Copy coords" button; it does not persist anywhere.

No hard-coded credentials. No permissions. No sessions.

---

## 9. Environment Variables

There are **no runtime env vars** required. `.env.example` is provided as a
placeholder scaffold. Nothing needs to be set to run `bun install && bun run
dev` locally.

---

## 10. Deployment

Full instructions in `docs/DEPLOYMENT.md`. Two supported targets:

- **Cloudflare Workers** (current Lovable production target). Config in
  `wrangler.jsonc`. Run `bun run build`, then `wrangler deploy`.
- **Vercel / Netlify** — set `bun run build` as the build command and use the
  TanStack Start Node/edge preset. Instructions in the deployment doc.

No serverless functions, no cron, no webhooks, no secrets to migrate.

---

## 11. Lovable-Specific Dependencies

See `docs/LOVABLE_DEPENDENCIES.md`. Nothing prevents the project from running
outside Lovable, but the following are Lovable-flavored and can be swapped:

| Item | Impact | Replacement |
|---|---|---|
| `@lovable.dev/vite-tanstack-config` (devDependency) | Wraps Vite config with Lovable defaults | Replace `vite.config.ts` with a plain TanStack Start config (see doc) |
| Preview / published `.lovable.app` URLs | Cosmetic | Any host |
| Lovable script tag (none in `__root.tsx`) | — | — |
| Cloudflare Worker target (`@cloudflare/vite-plugin`, `wrangler.jsonc`) | Optional — keep or swap for Node/Edge on Vercel | See deployment doc |

There is **no** Lovable Cloud (Supabase) integration, no Lovable AI, no
injected analytics, and no Lovable auth in this project.

---

## 12. Local Development

```bash
git clone <your-repo-url>
cd <repo>
bun install          # or: npm install
bun run dev          # or: npm run dev
# open http://localhost:8080
```

- Node ≥ 20 recommended (Vite 7 requires Node 20.19+ or 22.12+).
- No database step. No admin creation. No sample data loading — all data is
  in-repo.
- Build: `bun run build` → outputs the TanStack Start build (SSR).
- Lint: `bun run lint`. Format: `bun run format`.
- No tests are configured.

---

## 13. Content Model

See `docs/CONTENT_MODEL.md` for full field-by-field schemas of `plants`,
`poems`, `plantInterest`, `kou72`, `construction pins`.

---

## 14. Preservation

- Current production is preserved at
  `https://poem-paths-explore.lovable.app` — untouched by this export.
- No database rows were changed (no DB exists).
- No storage assets were deleted.
- No features were replaced with placeholders.
- Tag the exported commit on GitHub as `v1.0-export-2026-07-23` after your
  first push (see status table).

---

## 15. Status Table

| Item | Status | Notes |
|---|---|---|
| 1. GitHub repository connected & pushed | **Requires owner action** | Use Lovable → `+` menu → GitHub → Connect. I cannot connect GitHub for you; once connected, all edits made here sync automatically. |
| 2. Technology stack documented | **Complete** | This file, section 1. |
| 3. Database schema exported | **Not present in the current project** | No database — all content is static TS. |
| 4. Content records exported (CSV + JSON) | **Complete** | `exports/*.csv`, `exports/*.json`. |
| 5. Images & media inventoried | **Complete** | `docs/ASSET_INVENTORY.md`. Locally-stored assets are already in `src/assets/`. |
| 6. Interactive map documented | **Complete** | `docs/MAP.md` + marker CSV/JSON in `exports/`. |
| 7. Routes documented | **Complete** | `docs/ROUTES.md`. |
| 8. Auth & admin documented | **Complete (none exists)** | Section 8. |
| 9. `.env.example` | **Complete** | No runtime env vars required; file is a scaffold. |
| 10. Deployment documented | **Complete** | `docs/DEPLOYMENT.md`. |
| 11. Lovable-specific dependencies listed | **Complete** | `docs/LOVABLE_DEPENDENCIES.md`. |
| 12. Local dev verified | **Partially complete** | Commands documented and current dev server runs. Please re-verify after cloning the GitHub mirror. |
| 13. Content-model inventory | **Complete** | `docs/CONTENT_MODEL.md`. |
| 14. Preservation | **Complete** | No destructive operations performed. |
| 15. Final handoff package | **Complete for code + docs; requires owner action for GitHub push and Git tag** | See section 15 above. |

### Manual actions still required from the owner

1. **Connect GitHub** in Lovable (+ menu → GitHub → Connect project) and choose the target org/repo.
2. After the first sync, on GitHub: create a **release / tag** `v1.0-export-2026-07-23` from the `main` branch.
3. Confirm the current production URL (`https://poem-paths-explore.lovable.app`) and decide whether to keep it, redirect it, or point a custom domain.
4. Confirm image rights for `garden-map.jpg` and `construction/*.jpg` with JACCC / the Southern California Gardeners Federation before redistribution.
