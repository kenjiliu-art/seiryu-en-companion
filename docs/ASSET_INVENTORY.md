# Asset Inventory

All media is bundled in the repo under `src/assets/`. Nothing is stored in
external object storage. Wikipedia plant thumbnails are fetched at runtime
and not cached in the repo.

## Locally stored assets

| Filename | Type | Path | Used in | Public | Related record | Notes |
|---|---|---|---|---|---|---|
| `garden-map.jpg` | JPEG (raster illustration, ~1696×680) | `src/assets/garden-map.jpg` | `src/routes/index.tsx` — the main map background | Yes (bundled) | — | Master file. This is the original in the project; no separate high-res is stored elsewhere. Confirm rights with JACCC. |
| `construction/01.jpg` … `10.jpg` | JPEG photos | `src/assets/construction/` | `src/components/ConstructionGallery.tsx` — camera pin carousels | Yes (bundled) | `construction_pins` (see `exports/construction_pins.json`) | Photos of the garden construction. Credit: Southern California Gardeners Federation. Confirm rights with the owner before external redistribution. |

Photo → pin mapping:

| Pin | Photos |
|---|---|
| `site-prep` | 01.jpg, 02.jpg |
| `stream` | 03.jpg, 04.jpg, 05.jpg |
| `boulders` | 06.jpg, 07.jpg |
| `crew` | 08.jpg, 09.jpg, 10.jpg |

Captions and alt text live inline in `src/components/ConstructionGallery.tsx`.

## Runtime-fetched assets (not stored locally)

| Source | What | Where used | License | Notes |
|---|---|---|---|---|
| Wikipedia REST — `en.wikipedia.org/api/rest_v1/page/summary/{slug}` | Plant lead thumbnails | `src/components/PlantThumb.tsx` | CC-BY-SA / public domain via Wikimedia Commons | Slugs listed in `src/data/plant-images.ts`. Falls back to a colored placeholder if the article has no lead image. |
| Google Fonts | Noto Serif JP, Noto Sans JP, Cormorant Garamond | Loaded via `<link>` in `src/routes/__root.tsx` | Google Fonts license (SIL OFL) | Preconnect + preload for faster first paint. |

## External storage buckets

**None.** No Supabase Storage, no S3, no R2, no external CDN.

## Code that assumes a specific asset URL

- `src/routes/index.tsx` imports `garden-map.jpg` via `import mapImage from "@/assets/garden-map.jpg"` (Vite handles hashing).
- `src/components/ConstructionGallery.tsx` imports each construction photo via `import p01 from "@/assets/construction/01.jpg"` etc.
- No hard-coded CDN URLs.
