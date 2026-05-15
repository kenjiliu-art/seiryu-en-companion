import { useEffect, useState } from "react";
import {
  getObservation,
  setObservation,
  clearObservation,
  STATE_META,
  type ObservationState,
} from "@/lib/observations";

export function PlantConfirm({ plantId }: { plantId: string }) {
  const [obs, setObs] = useState(() => getObservation(plantId));

  useEffect(() => {
    setObs(getObservation(plantId));
    const handler = () => setObs(getObservation(plantId));
    window.addEventListener("jaccc:obs-changed", handler);
    return () => window.removeEventListener("jaccc:obs-changed", handler);
  }, [plantId]);

  const pick = (s: ObservationState) => {
    if (obs?.state === s) clearObservation(plantId);
    else setObservation(plantId, s);
  };

  const states: ObservationState[] = ["blooming", "budding", "dormant"];

  return (
    <div className="rounded-md border border-border/60 bg-muted/40 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          What do you see today?
        </h3>
        {obs && (
          <span className="text-[10px] text-muted-foreground">
            You logged {obs.date}
          </span>
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {states.map((s) => {
          const meta = STATE_META[s];
          const active = obs?.state === s;
          return (
            <button
              key={s}
              onClick={() => pick(s)}
              className={`flex flex-col items-center gap-0.5 rounded border px-2 py-1.5 text-[10px] transition-colors ${
                active
                  ? "border-foreground bg-background text-foreground"
                  : "border-border bg-background/50 text-muted-foreground hover:bg-background"
              }`}
              style={active ? { boxShadow: `0 0 0 2px ${meta.color}33` } : undefined}
            >
              <span className="text-base leading-none">{meta.emoji}</span>
              <span className="leading-tight">{meta.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] italic text-muted-foreground">
        Saved on this device only — your private field notebook.
      </p>
    </div>
  );
}
