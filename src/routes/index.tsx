import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gardenMap from "@/assets/garden-map.jpg";
import { plants as initialPlants, manyoshuUrl, type Plant } from "@/data/plants";
import { poems } from "@/data/poems";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlantThumb } from "@/components/PlantThumb";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "James Irvine Japanese Garden — Interactive Planting Map" },
      {
        name: "description",
        content:
          "Explore the JACCC James Irvine Japanese Garden plant by plant, with Man'yōshū poem connections for each species.",
      },
    ],
  }),
});

type PlantCategory = "manyoshu" | "substitute" | "none";
function plantCategory(p: Plant): PlantCategory {
  // A plant counts as "in the Man'yōshū" only when it's the actual species
  // referenced (specific poems AND not flagged as a SoCal substitute).
  if (p.manyoshu && !p.substitute) return "manyoshu";
  if (p.substitute || p.categoryRefs) return "substitute";
  return "none";
}
function categoryDotClass(c: PlantCategory): string {
  if (c === "manyoshu") return "bg-emerald-600";
  if (c === "substitute") return "bg-amber-500";
  return "bg-muted-foreground";
}
function categoryHaloClass(c: PlantCategory): string {
  if (c === "manyoshu") return "bg-emerald-500/15 group-hover:bg-emerald-500/30";
  if (c === "substitute") return "bg-amber-500/15 group-hover:bg-amber-500/30";
  return "bg-slate-400/15 group-hover:bg-slate-400/30";
}
function categoryGlowStyle(c: PlantCategory): string {
  if (c === "manyoshu") return "0 0 8px rgba(5,150,105,0.45)";
  if (c === "substitute") return "0 0 8px rgba(217,119,6,0.45)";
  return "0 0 8px rgba(71,85,105,0.35)";
}

function Index() {
  const [active, setActive] = useState<Plant | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [dragId, setDragId] = useState<string | null>(null);
  const [visibleCats, setVisibleCats] = useState<Record<PlantCategory, boolean>>({
    manyoshu: true,
    substitute: true,
    none: true,
  });
  const toggleCat = (c: PlantCategory) =>
    setVisibleCats((v) => ({ ...v, [c]: !v[c] }));
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dragId) return;
    const onMove = (e: MouseEvent) => {
      const el = mapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setPlants((prev) =>
        prev.map((p) => (p.id === dragId ? { ...p, x: +x.toFixed(1), y: +y.toFixed(1) } : p)),
      );
    };
    const onUp = () => setDragId(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragId]);

  const exportCoords = () => {
    const text = plants.map((p) => `  ${p.id}: { x: ${p.x}, y: ${p.y} },`).join("\n");
    navigator.clipboard.writeText(text);
  };


  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Japanese American Cultural &amp; Community Center
        </p>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl">
          James Irvine Japanese Garden
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          An interactive planting plan after Takeo Uesugi&apos;s 1979 design. Click a
          marker on the map — or a plant in the legend — to read its uses,
          symbolism, and Man&apos;yōshū (万葉集) poem references.
        </p>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:px-16 md:py-14">
        {/* Map */}
        <div
          className="relative overflow-hidden rounded-md border border-stone-200/60 p-6 shadow-sm md:p-12"
          style={{ backgroundColor: "#FDFCF8" }}
        >
          {/* Washi paper grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" }}
          />
          {/* Faint vertical sumi accent line */}
          <div aria-hidden className="pointer-events-none absolute right-1/4 top-0 h-32 w-px bg-stone-300/60" />

          {/* Asymmetric inner frame — offset right for ma (negative space) */}
          <div className="relative ml-0 lg:ml-[5%]">
            <div
              className="relative border border-stone-200 p-1"
              style={{ backgroundColor: "#F7F5EF" }}
            >
              <div className="relative overflow-hidden bg-white" ref={mapRef}>
                <img
                  src={gardenMap}
                  alt="Planting plan of the JACCC James Irvine Japanese Garden"
                  className="block w-full select-none opacity-40 grayscale contrast-90 mix-blend-multiply"
                  draggable={false}
                />
                {/* Atmospheric fog wash — light from upper-left */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    background:
                      "linear-gradient(to top right, transparent 40%, #FDFCF8 100%)",
                  }}
                />

            {plants.map((p) => {
              const category = plantCategory(p);
              if (!visibleCats[category]) return null;
              return (
              <button
                key={p.id}
                onClick={() => !editMode && setActive(p)}
                onMouseDown={(e) => {
                  if (editMode) {
                    e.preventDefault();
                    setDragId(p.id);
                  }
                }}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 ${editMode ? "cursor-move" : ""}`}
                aria-label={p.name}
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full border border-white/60 shadow-sm backdrop-blur-[2px] transition-all duration-300 ${categoryHaloClass(category)} ${
                      hovered === p.id || dragId === p.id ? "scale-125" : "group-hover:scale-125"
                    }`}
                  />
                  <span
                    className={`relative h-2.5 w-2.5 rounded-full transition-transform duration-300 ${categoryDotClass(category)} ${
                      hovered === p.id || dragId === p.id ? "scale-125" : ""
                    }`}
                    style={{ boxShadow: categoryGlowStyle(category) }}
                  />
                </span>
                {(hovered === p.id || dragId === p.id) && (
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background shadow-lg">
                    {p.name}{editMode && ` · ${p.x}, ${p.y}`}
                  </span>
                )}
              </button>
              );
            })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editMode}
                onChange={(e) => setEditMode(e.target.checked)}
              />
              Edit positions
            </label>
            {editMode && (
              <button
                onClick={exportCoords}
                className="rounded border border-accent/40 px-2 py-0.5 text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Copy coords
              </button>
            )}
            {([
              ["manyoshu", "bg-emerald-600", "bg-emerald-500/15 border-emerald-500/30", "In the Man\u2019yōshū"],
              ["substitute", "bg-amber-500", "bg-amber-500/15 border-amber-500/30", "SoCal substitute / general match"],
              ["none", "bg-muted-foreground", "bg-slate-400/15 border-slate-400/30", "Not in the Man\u2019yōshū"],
            ] as const).map(([cat, dot, halo, label]) => {
              const on = visibleCats[cat];
              return (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border px-2 py-1 transition-colors ${
                    on
                      ? "border-border bg-background text-foreground"
                      : "border-dashed border-border/60 text-muted-foreground/60 line-through"
                  }`}
                >
                  <span className={`relative flex h-5 w-5 items-center justify-center ${on ? "" : "opacity-40"}`}>
                    <span className={`absolute inset-0 rounded-full border ${halo}`} />
                    <span className={`relative h-1.5 w-1.5 rounded-full ${dot}`} />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <aside className="rounded-md border border-border bg-card">
          <div className="border-b border-border/60 px-4 py-3">
            <h2 className="font-serif text-lg">Plant Legend</h2>
            <p className="text-xs text-muted-foreground">
              {plants.length} species · {plants.filter((p) => p.manyoshu || p.categoryRefs).length} with
              Man&apos;yōshū poems
            </p>
          </div>
          <ScrollArea className="max-h-[60vh]">
            <ul className="divide-y divide-border/50">
              {plants.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setActive(p)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/60 ${
                      hovered === p.id ? "bg-muted/60" : ""
                    }`}
                  >
                    <PlantThumb
                      plantId={p.id}
                      alt={p.name}
                      fallbackClass={
                        plantCategory(p) === "manyoshu"
                          ? "bg-emerald-600"
                          : plantCategory(p) === "substitute"
                            ? "bg-amber-500"
                            : "bg-muted-foreground"
                      }
                    />
                    <span className="flex flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {p.name}
                      {p.manyoshu && (
                        <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
                          poem
                        </span>
                      )}
                      {!p.manyoshu && p.categoryRefs && (
                        <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent/80">
                          general
                        </span>
                      )}
                      {p.substitute && (
                        <span
                          title="Substituted for the original Man'yōshū plant to suit the Los Angeles climate"
                          className="rounded-full border border-dashed border-muted-foreground/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          LA sub
                        </span>
                      )}
                    </span>
                    {(p.japanese || p.romaji || p.scientific) && (
                      <span className="text-xs italic text-muted-foreground">
                        {p.japanese && <span className="not-italic mr-1">{p.japanese}</span>}
                        {p.romaji && <span className="mr-1">{p.romaji}</span>}
                        {p.scientific && <span>· {p.scientific}</span>}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>
      </div>

      <footer className="border-t border-border/60 px-6 py-6 text-xs text-muted-foreground md:px-10">
        Planting survey by Jon Ngai, landscape architecture intern, August 2021. Garden
        designed 1978–1979 by Takeo Uesugi for the JACCC, inspired by Murin-an in Kyoto.
      </footer>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  {active.name}
                  {active.japanese && (
                    <span className="ml-2 text-lg font-normal text-muted-foreground">
                      {active.japanese}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="italic">
                  {active.romaji && <>{active.romaji}</>}
                  {active.romaji && active.scientific && " · "}
                  {active.scientific && <>{active.scientific}</>}
                </DialogDescription>
              </DialogHeader>

              {active.substitute && (
                <p className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">LA substitute</span> ·
                  Not the exact species in the Man&apos;yōshū — a local stand-in chosen to thrive in the
                  Southern California climate.
                </p>
              )}

              <p className="text-sm leading-relaxed">{active.description}</p>

              {(active.manyoshu || active.categoryRefs) && (
                <div className="rounded-md border border-border/60 bg-muted/40 p-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Man&apos;yōshū Connection · 万葉集
                  </h3>

                  {active.manyoshu && (
                    <RefsSection
                      title={`${active.manyoshu.length} poem${active.manyoshu.length === 1 ? "" : "s"} cited for this species`}
                      refs={active.manyoshu}
                    />
                  )}

                  {active.categoryRefs && (
                    <RefsSection
                      title={`No species-specific poems — showing general ${active.categoryRefs.label} poems`}
                      refs={active.categoryRefs.refs}
                      muted
                    />
                  )}

                  {active.links && active.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-border/40 pt-3">
                      {active.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs text-accent underline-offset-2 hover:underline"
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function RefsSection({
  title,
  refs,
  muted,
}: {
  title: string;
  refs: string[];
  muted?: boolean;
}) {
  const withText = refs.filter((r) => poems[r]);
  const linksOnly = refs.filter((r) => !poems[r]);
  return (
    <div className={muted ? "mt-4 border-t border-border/40 pt-3" : "mt-2"}>
      <p className={`text-[11px] ${muted ? "italic text-muted-foreground" : "text-muted-foreground"}`}>
        {title}
      </p>
      {withText.length > 0 && (
        <div className="mt-2 space-y-3">
          {withText.map((ref) => {
            const poem = poems[ref];
            const url = poem.url || manyoshuUrl(ref);
            return (
              <article
                key={ref}
                className="rounded border border-border/50 bg-background/60 p-3"
              >
                <header className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-accent">{ref}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {poem.source === "wakapoetry" ? "trans. McAuley" : "trans. NGS 1940"}
                  </span>
                </header>
                {poem.preface && (
                  <p className="mt-1 text-[11px] italic text-muted-foreground">
                    {poem.preface}
                  </p>
                )}
                {poem.japanese && (
                  <p className="mt-2 font-serif text-sm leading-relaxed">
                    {poem.japanese}
                  </p>
                )}
                <pre className="mt-2 whitespace-pre-wrap font-serif text-[13px] leading-relaxed text-foreground">
                  {poem.english}
                </pre>
                <footer className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  {poem.author && <span>— {poem.author}</span>}
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-accent underline-offset-2 hover:underline"
                    >
                      source ↗
                    </a>
                  )}
                </footer>
              </article>
            );
          })}
        </div>
      )}
      {linksOnly.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {linksOnly.map((ref) => {
            const url = manyoshuUrl(ref);
            return url ? (
              <a
                key={ref}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded border border-accent/40 bg-background px-2 py-0.5 text-[11px] text-accent hover:bg-accent hover:text-accent-foreground"
              >
                {ref.replace("MYS ", "")}
              </a>
            ) : (
              <span key={ref} className="px-2 py-0.5 text-[11px] text-muted-foreground">
                {ref}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
