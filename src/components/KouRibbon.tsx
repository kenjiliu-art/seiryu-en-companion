import { useState } from "react";
import type { Plant } from "@/types/plant";
import { currentKou, kouAt, type Kou } from "@/data/kou72";

interface KouRibbonProps {
  plants: Plant[];
  onPickPlant: (plant: Plant) => void;
}

export function KouRibbon({
  plants,
  onPickPlant,
}: KouRibbonProps) {
  const todayKou = currentKou();
  const [offset, setOffset] = useState(0);
  const k: Kou = kouAt(todayKou.index + offset);

  const linkedPlants = (k.plantIds ?? [])
    .map((id) => plants.find((plant) => plant.id === id))
    .filter((plant): plant is Plant => Boolean(plant));

  const dateLabel = `${k.start.m}/${k.start.d}`;

  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          七十二候 · Microseason {k.index} / 72
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((value) => value - 1)}
            className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-muted"
            aria-label="Previous microseason"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => setOffset(0)}
            className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-muted"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => setOffset((value) => value + 1)}
            className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-muted"
            aria-label="Next microseason"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-serif text-lg leading-tight text-foreground">
          {k.kanji}
        </span>

        <span className="text-[11px] italic text-muted-foreground">
          {k.romaji}
        </span>
      </div>

      <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px]">
        <span className="text-muted-foreground">京都</span>

        <span className="text-foreground">
          {k.en}{" "}
          <span className="text-muted-foreground">
            · ~{dateLabel}
          </span>
        </span>

        <span className="text-muted-foreground">L.A.</span>

        <span className="text-foreground/80">
          {k.laNote ?? (
            <span className="italic text-muted-foreground">
              Reads the same in LA.
            </span>
          )}
        </span>
      </div>

      {linkedPlants.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {linkedPlants.map((plant) => (
            <button
              key={plant.id}
              type="button"
              onClick={() => onPickPlant(plant)}
              className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] hover:bg-muted"
            >
              {plant.name}

              {plant.japanese && (
                <span className="ml-1 text-muted-foreground">
                  {plant.japanese}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}