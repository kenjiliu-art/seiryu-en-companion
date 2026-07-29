import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Plant } from "@/data/plants";
import {
  plantInterest,
  seasonJa,
  type Season,
  type InterestKind,
} from "@/data/bloom";
import {
  currentKou,
  kouAt,
  type Kou,
} from "@/data/kou72";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type SeasonMode = "off" | "auto" | Season;

interface SeasonSheetProps {
  seasonMode: SeasonMode;
  onSeasonModeChange: (mode: SeasonMode) => void;
  plants: Plant[];
  seasonalActiveMonths: number[] | null;
  seasonalActiveCount: number;
  onPickPlant: (plant: Plant) => void;
  kouWashOn: boolean;
  onKouWashChange: (enabled: boolean) => void;
  todayTint: {
    name: string;
    hex: string;
  };
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

function KouRibbon({
  plants,
  onPickPlant,
}: {
  plants: Plant[];
  onPickPlant: (plant: Plant) => void;
}) {
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

export function SeasonSheet({
  seasonMode,
  onSeasonModeChange,
  plants,
  seasonalActiveMonths,
  seasonalActiveCount,
  onPickPlant,
  kouWashOn,
  onKouWashChange,
  todayTint,
}: SeasonSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors ${
            seasonMode === "off"
              ? "border-border bg-background text-foreground hover:bg-muted"
              : "border-[#d05a6e]/40 bg-[#d05a6e]/10 text-[#a93b53] hover:bg-[#d05a6e]/15"
          }`}
          aria-label="Open season panel"
        >
          <CalendarDays className="h-3.5 w-3.5" />

          <span className="hidden sm:inline">
            {seasonMode === "off"
              ? "Season"
              : seasonMode === "auto"
                ? `Now · ${seasonalActiveCount}`
                : `${seasonJa[seasonMode].kanji} ${seasonJa[seasonMode].romaji} · ${seasonalActiveCount}`}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[88vw] overflow-y-auto sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            Seasonal view
          </SheetTitle>

          <p className="text-xs text-muted-foreground">
            Recolor the map by what each plant is doing in Los Angeles right
            now.
          </p>
        </SheetHeader>

        <div className="mt-4 space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              ["off", "Off", "Show category colors"],
              ["auto", "Auto", "Use today's date"],
              ["spring", `${seasonJa.spring.kanji} Spring`, "Mar – May"],
              ["summer", `${seasonJa.summer.kanji} Summer`, "Jun – Aug"],
              ["autumn", `${seasonJa.autumn.kanji} Autumn`, "Sep – Nov"],
              ["winter", `${seasonJa.winter.kanji} Winter`, "Dec – Feb"],
            ].map(([mode, label, hint]) => {
              const typedMode = mode as SeasonMode;
              const selected = seasonMode === typedMode;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onSeasonModeChange(typedMode)}
                  className={`flex flex-col items-start gap-0.5 rounded-md border px-2.5 py-2 text-left transition-colors ${
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  <span className="text-xs font-medium">
                    {label}
                  </span>

                  <span
                    className={`text-[10px] ${
                      selected
                        ? "text-background/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {hint}
                  </span>
                </button>
              );
            })}
          </div>

          <KouRibbon
            plants={plants}
            onPickPlant={onPickPlant}
          />

          <button
            type="button"
            onClick={() => onKouWashChange(!kouWashOn)}
            className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-xs transition-colors ${
              kouWashOn
                ? "border-foreground bg-foreground/5"
                : "border-border bg-background hover:bg-muted"
            }`}
            aria-pressed={kouWashOn}
          >
            <span className="flex items-center gap-2">
              <span
                className="h-3.5 w-3.5 rounded-full border border-border/60"
                style={{ backgroundColor: todayTint.hex }}
              />

              <span>
                <span className="font-medium">
                  Kō tint wash
                </span>

                <span className="ml-1.5 text-muted-foreground">
                  {todayTint.name}
                </span>
              </span>
            </span>

            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {kouWashOn ? "On" : "Off"}
            </span>
          </button>

          {seasonMode !== "off" && seasonalActiveMonths && (
            <>
              <div className="rounded-md border border-border/60 bg-muted/40 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Color key
                </p>

                <ul className="mt-2 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#A45F76]" />
                    In bloom
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#B96332]" />
                    Fruit / berries
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#496B50]" />
                    Foliage interest
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#7E8782]" />
                    Quiet / dormant
                  </li>
                </ul>
              </div>

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

              <p className="text-[11px] italic text-muted-foreground">
                Bloom windows are curated estimates for the Los Angeles
                climate, not live observations. Persimmon, cherry, and
                wisteria timing in Little Tokyo can shift a few weeks
                year-to-year.
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}