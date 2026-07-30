import { CalendarDays } from "lucide-react";
import type { Plant } from "@/types/plant";
import {
  seasonJa,
  type Season,
} from "@/data/bloom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { KouRibbon } from "@/components/KouRibbon";
import { ColorKey } from "@/components/ColorKey";
import { SeasonSummary } from "@/components/SeasonSummary";

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
              <ColorKey />

              <SeasonSummary
                plants={plants}
                seasonalActiveMonths={seasonalActiveMonths}
                seasonalActiveCount={seasonalActiveCount}
                onPickPlant={onPickPlant}
                />

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