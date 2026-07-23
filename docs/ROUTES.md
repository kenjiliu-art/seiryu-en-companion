# Route Inventory

The app has exactly two route files. No dynamic segments, no authenticated
routes, no admin panel, no API routes, no unfinished/hidden routes.

| URL | File | Purpose | Auth | Data source | Metadata |
|---|---|---|---|---|---|
| `/` | `src/routes/index.tsx` | Full interactive garden map: pins, About sheet, Plant Legend sheet, Season sheet with kō ribbon, plant detail Dialog. | Public | `src/data/plants.ts`, `poems.ts`, `bloom.ts`, `kou72.ts`, `plant-images.ts` | `head()` in the file — title, description, og:title, og:description |
| (root layout) | `src/routes/__root.tsx` | HTML shell, `<head>` metadata, Google Fonts `<link>` preloads (Noto Serif JP, Noto Sans JP, Cormorant Garamond), `<Outlet />`. | — | — | Global `<meta>` tags |

Auto-generated `src/routeTree.gen.ts` is owned by TanStack Router's Vite
plugin — never edit by hand.

## Query params / dynamic URL fields

None. The page is entirely client-state driven (season, kō index,
selected plant, active camera pin, edit mode).

## API calls

- **Wikipedia REST**: `https://en.wikipedia.org/api/rest_v1/page/summary/{slug}` — fetched by `src/components/PlantThumb.tsx` at render time for plant thumbnails. Public endpoint, no key.
- No other network calls. No internal API routes.

## Hidden / deprecated / test routes

None.
