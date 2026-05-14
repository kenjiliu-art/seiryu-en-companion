## Problem
The current `src/assets/garden-map.svg` was traced from a negated source, so potrace filled the background and left line work as cutouts. Result: black fills dominate the image and lines appear as the gaps.

## Fix
Re-trace the original `garden-map.jpg` without negating it, so potrace treats the dark ink as the foreground and leaves the paper as empty space.

Steps:
1. Convert `src/assets/garden-map.jpg` → grayscale PBM with a threshold around 60% (no `-negate` this time) using ImageMagick.
2. Run potrace on the PBM with `-s -t 2 -a 1 --tight` to overwrite `src/assets/garden-map.svg`.
3. Verify the resulting SVG no longer starts with a full-canvas filled rectangle, then reload the preview.

No code changes needed in `src/routes/index.tsx` — the import path stays the same.