# Content Model

All content is hard-coded in TypeScript under `src/data/`. Nothing is stored
in a database. Portable snapshots live in `exports/`.

## `Plant` — `src/data/plants.ts`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | ✅ | Stable slug; primary key across all data files |
| `name` | `string` | ✅ | English display name |
| `japanese` | `string` | — | Kanji / kana |
| `romaji` | `string` | — | Romanized reading(s) |
| `scientific` | `string` | — | Binomial |
| `description` | `string` | ✅ | Single-paragraph blurb shown in the dialog |
| `manyoshu` | `string[]` | — | Raw refs like `"MYS X: 1869"`; auto-linked to wakapoetry.net |
| `categoryRefs` | `{ label: string; refs: string[] }` | — | Fallback general-category poems when no species-specific MYS poem exists |
| `substitute` | `boolean` | — | `true` when the species is an LA substitute for the original Man'yōshū plant |
| `links` | `{ label; url }[]` | — | Extra curated external links |
| `x`, `y` | `number` (0–100) | ✅ | Percent coordinates on the map image |

**Count:** 36 records. Displayed in `src/routes/index.tsx` map pins and Plant Legend sheet.

## `Poem` — `src/data/poems.ts`

Keyed by MYS reference (e.g. `"MYS I: 65"`).

| Field | Type | Required | Notes |
|---|---|---|---|
| `preface` | `string` | — | Editorial context |
| `japanese` | `string` | — | Original text |
| `romaji` | `string` | — | Line-broken transliteration |
| `english` | `string` | ✅ | Translation |
| `author` | `string` | — | |
| `source` | `'wakapoetry' \| 'ngs'` | ✅ | Attribution |
| `url` | `string` | — | Canonical source URL |

**Count:** 34 records. Rendered inline in the plant Dialog.

## `PlantInterest` — `src/data/bloom.ts`

Keyed by `plant.id`.

| Field | Type | Notes |
|---|---|---|
| `months` | `number[]` (1–12) | Months of peak visual interest in LA |
| `kind` | `'bloom' \| 'fruit' \| 'foliage'` | Dominant interest type; drives seasonal tint |
| `note` | `string` | Plain-language description shown in the phenology strip |

Used to (a) recolor pins in Season mode, (b) render the 12-month phenology strip inside each plant Dialog, (c) build the "active this season" list.

## `Kou` — `src/data/kou72.ts`

Array of 72 microseasons (*shichijūni-kō*).

| Field | Type | Notes |
|---|---|---|
| `index` | `number` (0–71) | Sort order |
| `sekki` | `string` | Parent solar term (of 24) |
| `kanji` | `string` | Original name, e.g. `東風解凍` |
| `romaji` | `string` | e.g. `Harukaze kōri o toku` |
| `en` | `string` | English gloss, e.g. `"East wind melts the ice"` |
| `laReading` | `string` | LA-shifted alternate reading; may be identical |
| `plantIds` | `string[]` | Related garden plants |
| `approxMonth` / `approxDay` | `number` | Canonical Kyoto date; used to pick "today's kō" |

Also exports `tintForKou(index)` returning a Nippon-traditional color per sekki, used for the optional map background wash.

## Construction pins — `src/components/ConstructionGallery.tsx`

Inline in the component (not in `src/data/`):

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable slug |
| `x`, `y` | `number` | Percent coordinates |
| `title` | `string` | Popover heading + a11y label |
| `photos` | `string[]` | Filenames in `src/assets/construction/` |

**Count:** 4 pins covering 10 photos.

## Duplicated / unstructured content to consider migrating later

- **`substitute` explanation blurbs** are currently repeated across some
  plant `description` fields — could become a shared field or a separate
  `substitutions.ts` record.
- **Wikipedia slug map (`plant-images.ts`)** could be merged into the main
  `plants.ts` records as a `wikiSlug` field.
- **Construction pins** live inside a component file. If more are added,
  move them into `src/data/construction.ts` for parity with the other
  content types.

No migration is performed as part of this export.
