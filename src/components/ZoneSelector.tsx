import type { FC } from "react";

export type InterpretiveZone =
  | "all"
  | "upper-stream-and-waterfall"
  | "middle-stream"
  | "lower-pool";

interface Props {
  value: InterpretiveZone;
  onChange: (zone: InterpretiveZone) => void;
}

const zones = [
  {
    value: "all",
    place: "Whole Garden",
    generation: "All three areas",
  },
  {
    value: "upper-stream-and-waterfall",
    place: "Upper Waterfall",
    generation: "Issei",
  },
  {
    value: "middle-stream",
    place: "Middle Stream",
    generation: "Nisei",
  },
  {
    value: "lower-pool",
    place: "Lower Pools",
    generation: "Sansei",
  },
] as const;

export const ZoneSelector: FC<Props> = ({
  value,
  onChange,
}) => {
  return (
    <div className="rounded-md border border-border/60 bg-muted/40 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Garden Story
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {zones.map((zone) => (
          <button
            key={zone.value}
            type="button"
            onClick={() => onChange(zone.value)}
            className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
              value === zone.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            <span className="flex flex-col items-start">
              <span className="font-medium">
                {zone.place}
              </span>

              <span
                className={`mt-0.5 text-[10px] uppercase tracking-wider ${
                  value === zone.value
                    ? "text-primary-foreground/75"
                    : "text-muted-foreground"
                }`}
              >
                {zone.generation}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};