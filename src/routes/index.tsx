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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlantThumb } from "@/components/PlantThumb";
import { ConstructionPin, defaultConstructionPins, type ConstructionPinSpec } from "@/components/ConstructionGallery";
import { Plus, Minus, Maximize2, Leaf, Info } from "lucide-react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

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
  const [pins, setPins] = useState<ConstructionPinSpec[]>(defaultConstructionPins);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPinId, setDragPinId] = useState<string | null>(null);
  const [visibleCats, setVisibleCats] = useState<Record<PlantCategory, boolean>>({
    manyoshu: true,
    substitute: true,
    none: true,
  });
  const toggleCat = (c: PlantCategory) =>
    setVisibleCats((v) => ({ ...v, [c]: !v[c] }));
  const mapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!dragId && !dragPinId) return;
    const onMove = (e: MouseEvent) => {
      const el = mapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = +Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)).toFixed(1);
      const y = +Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)).toFixed(1);
      if (dragId) {
        setPlants((prev) => prev.map((p) => (p.id === dragId ? { ...p, x, y } : p)));
      }
      if (dragPinId) {
        setPins((prev) => prev.map((p) => (p.id === dragPinId ? { ...p, x, y } : p)));
      }
    };
    const onUp = () => {
      setDragId(null);
      setDragPinId(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragId, dragPinId]);

  const exportCoords = () => {
    const plantText = plants.map((p) => `  ${p.id}: { x: ${p.x}, y: ${p.y} },`).join("\n");
    const pinText = pins
      .map((p) => `  { id: "${p.id}", x: ${p.x}, y: ${p.y} },`)
      .join("\n");
    navigator.clipboard.writeText(
      `// plants\n${plantText}\n\n// construction pins\n${pinText}`,
    );
  };


  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/95 px-3 py-2 backdrop-blur md:px-5 md:py-3">
        <div className="min-w-0">
          <p className="truncate text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:text-[10px]">
            JACCC
          </p>
          <h1 className="truncate font-serif text-base leading-tight md:text-xl">
            James Irvine Japanese Garden
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                aria-label="Open about panel"
              >
                <Info className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">About</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">About this map</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>
                  An interactive planting plan after Takeo Uesugi&apos;s 1979 design.
                  Tap a marker on the map — or a plant in the legend — to read its
                  uses, symbolism, and Man&apos;yōshū (万葉集) poem references.
                </p>
                <p>
                  Planting survey by Jon Ngai, landscape architecture intern, August
                  2021. Garden designed 1978–1979 by Takeo Uesugi for the JACCC,
                  inspired by Murin-an in Kyoto.
                </p>
                <p className="opacity-70">
                  Camera icons on the map open construction photos from 1979.
                </p>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                aria-label="Open plant legend"
              >
                <Leaf className="h-3.5 w-3.5" />
                Plants
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[92vw] flex-col p-0 sm:max-w-md">
              <SheetHeader className="border-b border-border/60 px-4 py-3">
                <SheetTitle className="font-serif text-lg">Plant Legend</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {plants.length} species ·{" "}
                  {plants.filter((p) => p.manyoshu || p.categoryRefs).length} with
                  Man&apos;yōshū poems
                </p>
              </SheetHeader>
              <ScrollArea className="flex-1">
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
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Map fills remaining viewport */}
      <div className="relative flex-1 overflow-hidden bg-white">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={6}
          doubleClick={{ mode: "zoomIn", step: 0.7 }}
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          panning={{ disabled: editMode, velocityDisabled: true }}
          limitToBounds
          centerOnInit
          onTransformed={(_, s) => setScale(s.scale)}
        >
          <ZoomControls />
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full !flex !items-center !justify-center"
          >
            <div
              ref={mapRef}
              className="relative"
              style={{
                aspectRatio: "1696 / 680",
                width: "min(100%, calc(100vh * 1696 / 680))",
                maxHeight: "100%",
              }}
            >
              <img
                src={gardenMap}
                alt="Planting plan of the JACCC James Irvine Japanese Garden"
                className="block h-full w-full select-none opacity-40 grayscale contrast-90 mix-blend-multiply"
                draggable={false}
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
              {pins.map((pin) => (
                <ConstructionPin
                  key={pin.id}
                  pin={pin}
                  editMode={editMode}
                  isDragging={dragPinId === pin.id}
                  onDragStart={(id) => setDragPinId(id)}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>

        {/* Floating filter chips */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center gap-1.5 md:right-auto md:max-w-md">
          {([
            ["manyoshu", "bg-emerald-600", "bg-emerald-500/15 border-emerald-500/30", "Man\u2019yōshū"],
            ["substitute", "bg-amber-500", "bg-amber-500/15 border-amber-500/30", "SoCal sub"],
            ["none", "bg-muted-foreground", "bg-slate-400/15 border-slate-400/30", "Other"],
          ] as const).map(([cat, dot, halo, label]) => {
            const on = visibleCats[cat];
            return (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                aria-pressed={on}
                className={`pointer-events-auto flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] shadow-sm backdrop-blur-sm transition-colors ${
                  on
                    ? "border-border bg-background/95 text-foreground"
                    : "border-dashed border-border/60 bg-background/70 text-muted-foreground/60 line-through"
                }`}
              >
                <span className={`relative flex h-4 w-4 items-center justify-center ${on ? "" : "opacity-40"}`}>
                  <span className={`absolute inset-0 rounded-full border ${halo}`} />
                  <span className={`relative h-1.5 w-1.5 rounded-full ${dot}`} />
                </span>
                {label}
              </button>
            );
          })}
          {editMode && (
            <button
              onClick={exportCoords}
              className="pointer-events-auto rounded-full border border-accent/40 bg-background/95 px-2 py-1 text-[11px] text-accent shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Copy coords
            </button>
          )}
          <label className="pointer-events-auto ml-auto flex items-center gap-1.5 rounded-full border border-border bg-background/95 px-2 py-1 text-[11px] text-muted-foreground shadow-sm">
            <input
              type="checkbox"
              checked={editMode}
              onChange={(e) => setEditMode(e.target.checked)}
              className="h-3 w-3"
            />
            Edit
          </label>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-lg sm:p-6">
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


function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute right-2 top-2 z-20 flex flex-col gap-1 rounded-md border border-stone-200/80 bg-background/90 p-1 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => zoomIn()}
        aria-label="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded text-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => zoomOut()}
        aria-label="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded text-foreground transition-colors hover:bg-muted"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => resetTransform()}
        aria-label="Reset view"
        className="flex h-8 w-8 items-center justify-center rounded text-foreground transition-colors hover:bg-muted"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
