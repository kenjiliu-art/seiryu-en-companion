# Interactive Map — Implementation Notes

## Source image

- File: `src/assets/garden-map.jpg`
- Dimensions: ~1696 × 680 (JPEG)
- Origin: JACCC garden illustration bundled with the project. No separate
  high-res master is stored elsewhere in the repo.

## Component

- All map logic lives in **`src/routes/index.tsx`**. Search for
  `TransformWrapper` to jump straight in.
- Camera pins are rendered by
  **`src/components/ConstructionGallery.tsx`** as an absolutely-positioned
  overlay inside the same aspect-ratio container.
- Plant thumbnails inside the Dialog: **`src/components/PlantThumb.tsx`**.

## Zoom / pan

- Library: **`react-zoom-pan-pinch`** (`TransformWrapper` +
  `TransformComponent`).
- Interactions:
  - mouse-wheel zoom on desktop
  - pinch zoom on touch
  - click-drag pan when zoomed in
  - double-click / double-tap to zoom in
  - explicit `+ / − / ⛶` (reset) buttons in the top-right, wired via
    `useControls()` from the same library (`ZoomControls` component at the
    bottom of `index.tsx`)
- Edit mode disables panning so that plant / camera pins can be dragged
  individually.

## Coordinate system

- **Percentages.** Every plant record (`src/data/plants.ts`) and every
  camera pin (`src/components/ConstructionGallery.tsx`) stores `x` and `y`
  as numbers in **0–100**, representing percent of the image width / height.
- Pins are positioned with `style={{ left: `${x}%`, top: `${y}%` }}` inside
  an aspect-locked container, then translated to be centered on that
  coordinate.
- **Pins counter-scale with zoom** (`transform: scale(1 / zoom)`) so their
  on-screen size stays constant. This is applied on the inner span; the
  outer button keeps `translate(-50%, -50%)` so hit areas stay centered.

## Marker data source

- Plants: `src/data/plants.ts` (36 records) — see `exports/plants.csv` for a
  cleaned tabular version with just the coordinates.
- Camera pins: inline array in `src/components/ConstructionGallery.tsx` —
  see `exports/construction_pins.csv`.

## Responsive behavior

- The map container uses `aspect-ratio: 1696 / 680` so the image fills its
  width without cropping on any viewport.
- On phones the Plant Legend and About panels open as bottom sheets
  (`Sheet` primitive) rather than side panels; the plant Dialog uses
  near-full height.
- Filter chips and Edit toggle sit on floating rows along the bottom of the
  map on all screen sizes.

## Pop-up / detail-panel behavior

- Clicking a **plant pin** opens a shadcn `Dialog` with:
  - name (English + Japanese + romaji + scientific)
  - description
  - Man'yōshū references (auto-linked to wakapoetry.net)
  - a Wikipedia thumbnail
  - a 12-month **phenology strip** driven by `plantInterest[id]`
- Clicking a **camera pin** opens a shadcn `Popover` with a shadcn
  `Carousel` of that pin's photos plus captions.

## Links between markers and content records

Everything is keyed by `plant.id`. Bloom windows (`bloom.ts`), Wikipedia
slugs (`plant-images.ts`), and kō ↔ plant relations (`kou72.ts` →
`plantIds`) all reference the same slug.

## Known limitations / bugs

- The **Edit mode** ("drag pins to precise locations") logs updated coords
  via a "Copy coords" button but does not persist anywhere — it's a
  developer authoring tool, not a user feature.
- Wikipedia thumbnail fetches are unauthenticated and rate-unaware; on
  aggressive reloads Wikipedia may serve a placeholder.
- Bloom data (`bloom.ts`) is curated by hand and only approximate for LA.
