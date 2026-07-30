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

interface SeasonalPlant {
  plant: Plant;
  kind: InterestKind;
}

const groupOrder: InterestKind[] = [
  "bloom",
  "fruit",
  "foliage",
];

function isPlantActive(id: string, months: number[]): boolean {
  const interest = plantInterest[id];

  if (!interest) return false;

  return interest.months.some((month) =>
    months.includes(month),
  );
}

function interestDotClass(kind: InterestKind): string {
  if (kind === "bloom") return "bg-[#A45F76]";
  if (kind === "fruit") return "bg-[#B96332]";
  return "bg-[#496B50]";
}

function interestHeading(kind: InterestKind): string {
  if (kind === "bloom") return "Flowers";
  if (kind === "fruit") return "Fruit";
  return "Foliage";
}

export function SeasonSummary({
  plants,
  seasonalActiveMonths,
  seasonalActiveCount,
  onPickPlant,
}: SeasonSummaryProps) {
  const activePlants: SeasonalPlant[] = plants.flatMap(
    (plant) => {
      if (
        !isPlantActive(
          plant.id,
          seasonalActiveMonths,
        )
      ) {
        return [];
      }

      const interest = plantInterest[plant.id];

      if (!interest) {
        return [];
      }

      return [
        {
          plant,
          kind: interest.kind,
        },
      ];
    },
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {seasonalActiveCount} of {plants.length} plants active
      </p>

      <div className="mt-4 space-y-5">
        {groupOrder.map((kind) => {
          const groupedPlants = activePlants.filter(
            (item) => item.kind === kind,
          );

          if (groupedPlants.length === 0) {
            return null;
          }

          return (
            <section key={kind}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${interestDotClass(
                    kind,
                  )}`}
                  aria-hidden="true"
                />

                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {interestHeading(kind)}
                </h3>

                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {groupedPlants.length}
                </span>
              </div>

              <ul className="divide-y divide-border/40 rounded-md border border-border/60 bg-background/60">
                {groupedPlants.map(({ plant }) => (
                  <li key={plant.id}>
                    <button
                      type="button"
                      onClick={() =>
                        onPickPlant(plant)
                      }
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {plant.name}
                        </span>

                        {plant.japanese && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {plant.japanese}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}