import type { Plant } from "@/data/plants";
import {
  plantInterest,
  type InterestKind,
} from "@/data/bloom";

interface SeasonSummaryProps {
  plants: Plant[];
  seasonalActiveMonths: number[];
  seasonalActiveCount: number;
  onPickPlant: (plant: Plant) => void;
}

function isPlantActive(id: string, months: number[]): boolean {
  const interest = plantInterest[id];

  if (!interest) return false;

  return interest.months.some((month) => months.includes(month));
}

function interestDotClass(kind: InterestKind): string {
  if (kind === "bloom") return "bg-[#A45F76]";
  if (kind === "fruit") return "bg-[#B96332]";
  return "bg-[#496B50]";
}

export function SeasonSummary({
  plants,
  seasonalActiveMonths,
  seasonalActiveCount,
  onPickPlant,
}: SeasonSummaryProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {seasonalActiveCount} of {plants.length} plants active
      </p>

      <ul className="mt-2 divide-y divide-border/40 rounded-md border border-border/60 bg-background/60">
        {plants
          .filter((plant) =>
            isPlantActive(plant.id, seasonalActiveMonths),
          )
          .map((plant) => {
            const interest = plantInterest[plant.id];

            if (!interest) return null;

            return (
              <li key={plant.id}>
                <button
                  type="button"
                  onClick={() => onPickPlant(plant)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/60"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${interestDotClass(
                      interest.kind,
                    )}`}
                  />

                  <span className="flex-1 text-sm">
                    <span className="font-medium">
                      {plant.name}
                    </span>

                    {plant.japanese && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {plant.japanese}
                      </span>
                    )}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {interest.kind}
                  </span>
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}