import { useEffect, useState } from "react";

// JACCC + Little Tokyo bbox is too small for ornamental plant observations,
// so widen to greater LA for meaningful counts.
const BBOX = { swlat: 33.70, swlng: -118.67, nelat: 34.34, nelng: -118.15 };
const DAYS = 30;

type Phenology = "flowering" | "fruiting" | "budding" | "none";
type Counts = Record<Phenology, number> & { total: number };

// iNaturalist controlled-term ids for Plant Phenology
const TERM_ID = 12;
const TERM_VALUES: Record<number, Phenology> = {
  13: "flowering",
  14: "fruiting",
  15: "budding",
  21: "none",
};

async function fetchCounts(scientific: string): Promise<Counts | null> {
  const d1 = new Date(Date.now() - DAYS * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  const params = new URLSearchParams({
    taxon_name: scientific,
    swlat: String(BBOX.swlat),
    swlng: String(BBOX.swlng),
    nelat: String(BBOX.nelat),
    nelng: String(BBOX.nelng),
    d1,
    per_page: "200",
    quality_grade: "research,needs_id",
  });
  const url = `https://api.inaturalist.org/v1/observations?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iNat ${res.status}`);
  const json = (await res.json()) as { results: unknown[]; total_results: number };

  const counts: Counts = { flowering: 0, fruiting: 0, budding: 0, none: 0, total: 0 };
  counts.total = json.total_results ?? json.results.length;

  for (const r of json.results as Array<{ annotations?: Array<{ controlled_attribute_id: number; controlled_value_id: number }> }>) {
    for (const a of r.annotations ?? []) {
      if (a.controlled_attribute_id !== TERM_ID) continue;
      const phen = TERM_VALUES[a.controlled_value_id];
      if (phen) counts[phen] += 1;
    }
  }
  return counts;
}

export function INaturalistTile({ scientific }: { scientific: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchCounts(scientific)
      .then((c) => alive && setCounts(c))
      .catch((e) => alive && setError(String(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [scientific]);

  const inatUrl = `https://www.inaturalist.org/observations?taxon_name=${encodeURIComponent(
    scientific,
  )}&swlat=${BBOX.swlat}&swlng=${BBOX.swlng}&nelat=${BBOX.nelat}&nelng=${BBOX.nelng}&d1=${new Date(
    Date.now() - DAYS * 24 * 3600 * 1000,
  )
    .toISOString()
    .slice(0, 10)}`;

  return (
    <div className="rounded-md border border-border/60 bg-muted/40 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          iNaturalist · Greater LA, last {DAYS} days
        </h3>
        <a
          href={inatUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[10px] text-accent underline-offset-2 hover:underline"
        >
          View on iNat ↗
        </a>
      </div>
      {loading && (
        <p className="mt-2 text-[11px] italic text-muted-foreground">Loading observations…</p>
      )}
      {error && (
        <p className="mt-2 text-[11px] italic text-muted-foreground">
          Couldn&apos;t reach iNaturalist.
        </p>
      )}
      {counts && !loading && (
        <>
          <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
            {([
              ["Total", counts.total, "#888e7e"],
              ["🌸 Flow.", counts.flowering, "#d05a6e"],
              ["🍒 Fruit.", counts.fruiting, "#ed6d3d"],
              ["🟡 Bud.", counts.budding, "#e8b84a"],
            ] as const).map(([label, n, color]) => (
              <div
                key={label}
                className="rounded border border-border bg-background/50 px-1 py-1.5"
              >
                <div className="text-sm font-semibold tabular-nums" style={{ color }}>
                  {n}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
          {counts.total === 0 && (
            <p className="mt-2 text-[11px] italic text-muted-foreground">
              No recent observations of this species nearby.
            </p>
          )}
        </>
      )}
    </div>
  );
}
