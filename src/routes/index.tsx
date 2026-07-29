import GardenMapSvg from "@/assets/maps/manyoshu-garden-layered.svg?react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gardenMap from "@/assets/maps/garden-map.jpg";
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
import { ConstructionPin, constructionPins, type ConstructionPinSpec } from "@/components/ConstructionGallery";
import { Plus, Minus, Maximize2, Leaf, CalendarDays } from "lucide-react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import {
  plantInterest,
  seasonMonths,
  seasonJa,
  currentSeason,
  type Season,
  type InterestKind,
} from "@/data/bloom";
import { kou72, currentKou, kouAt, tintForKou, type Kou } from "@/data/kou72";
import { site } from "../content/site";
import { ZoneSelector } from "@/components/ZoneSelector";
import { GardenSheet } from "@/components/GardenSheet";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Seiryū-en Companion — Interactive Planting Map" },
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
  if (c === "manyoshu") return "bg-[#007b43]"; // 常磐色 Tokiwa
  if (c === "substitute") return "bg-[#ed6d3d]"; // 柿色 Kaki
  return "bg-[#888e7e]"; // 利休鼠 Rikyū-nezumi
}

// Seasonal-mode color tokens (when user enables seasonal view)
type SeasonMode = "off" | "auto" | Season;
const interestColor: Record<
  InterestKind,
  { bg: string; halo: string; glow: string }
> = {
  bloom: {
    bg: "bg-[#A45F76]",
    halo: "",
    glow: "0 0 9px rgba(164,95,118,0.5)",
  },
  fruit: {
    bg: "bg-[#B96332]",
    halo: "",
    glow: "0 0 9px rgba(185,99,50,0.5)",
  },
  foliage: {
    bg: "bg-[#496B50]",
    halo: "",
    glow: "0 0 9px rgba(73,107,80,0.5)",
  },
};
const dormantColor = { bg: "bg-[#949a96]", halo: "bg-[#949a96]/10 group-hover:bg-[#949a96]/20", glow: "0 0 4px rgba(188,182,168,0.25)" };

function activeMonthsFor(mode: Exclude<SeasonMode, "off">): number[] {
  if (mode === "auto") return [new Date().getMonth() + 1];
  return seasonMonths[mode];
}
function isPlantActive(id: string, months: number[]): boolean {
  const interest = plantInterest[id];
  if (!interest || interest.months.length === 0) return false;
  return months.some((m) => interest.months.includes(m));
}
function categoryHaloClass(c: PlantCategory): string {
  if (c === "manyoshu") return "bg-[#007b43]/15 group-hover:bg-[#007b43]/30";
  if (c === "substitute") return "bg-[#ed6d3d]/15 group-hover:bg-[#ed6d3d]/30";
  return "bg-[#888e7e]/15 group-hover:bg-[#888e7e]/30";
}
function categoryGlowStyle(c: PlantCategory): string {
  if (c === "manyoshu") return "0 0 8px rgba(0,123,67,0.45)";
  if (c === "substitute") return "0 0 8px rgba(237,109,61,0.45)";
  return "0 0 8px rgba(136,142,126,0.4)";
}

function Index() {
  const [active, setActive] = useState<Plant | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [pins, setPins] = useState<ConstructionPinSpec[]>(constructionPins);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPinId, setDragPinId] = useState<string | null>(null);
  const [interpretiveZone, setInterpretiveZone] =
  useState<InterpretiveZone>("all");
  const [gardenOpen, setGardenOpen] = useState(false);

  const [visibleCats, setVisibleCats] = useState<
    Record<PlantCategory, boolean>
  >({
    manyoshu: true,
    substitute: true,
    none: true,
  });

  const [scale, setScale] = useState(1);
  const [seasonMode, setSeasonMode] = useState<SeasonMode>("off");
  const [kouWashOn, setKouWashOn] = useState(false);
  const [useSvgMap, setUseSvgMap] = useState(true);

  const toggleCat = (c: PlantCategory) =>
    setVisibleCats((v) => ({ ...v, [c]: !v[c] }));

  const openNearestPlant = (
  event: React.MouseEvent<HTMLButtonElement>,
) => {
  if (editMode) return;

  const markerButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-plant-id]"),
  );

  let nearestId: string | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const button of markerButtons) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
      event.clientX - centerX,
      event.clientY - centerY,
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestId = button.dataset.plantId;
    }
  }

  const nearestPlant = plants.find((plant) => plant.id === nearestId);

  if (nearestPlant) {
    setActive(nearestPlant);
  }
};

  const mapRef = useRef<HTMLDivElement>(null);

  const todayKou = currentKou();
  const todayTint = tintForKou(todayKou.index);

  const seasonalActiveMonths =
    seasonMode === "off" ? null : activeMonthsFor(seasonMode);

  const seasonalActiveCount = seasonalActiveMonths
    ? plants.filter((p) => isPlantActive(p.id, seasonalActiveMonths)).length
    : 0;

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
         <p className="truncate text-[9px] uppercase tracking-[0.18em] text-muted-foreground md:text-[10px]">
  {site.organization}
</p>

<h1 className="site-title truncate">
  {site.title}
</h1>

<p className="mt-1 text-sm italic text-muted-foreground">
  {site.tagline}
</p>

        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Sheet>
            <SheetTrigger asChild>
              <button
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
            <SheetContent side="right" className="w-[88vw] overflow-y-auto sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">Seasonal view</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Recolor the map by what each plant is doing in Los Angeles right now.
                </p>
              </SheetHeader>

              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    ["off", "Off", "Show category colors"],
                    ["auto", "Auto", "Use today's date"],
                    ["spring", `${seasonJa.spring.kanji} Spring`, "Mar – May"],
                    ["summer", `${seasonJa.summer.kanji} Summer`, "Jun – Aug"],
                    ["autumn", `${seasonJa.autumn.kanji} Autumn`, "Sep – Nov"],
                    ["winter", `${seasonJa.winter.kanji} Winter`, "Dec – Feb"],
                  ] as const).map(([mode, label, hint]) => {
                    const on = seasonMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setSeasonMode(mode)}
                        className={`flex flex-col items-start gap-0.5 rounded-md border px-2.5 py-2 text-left transition-colors ${
                          on
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        <span className="text-xs font-medium">{label}</span>
                        <span className={`text-[10px] ${on ? "text-background/70" : "text-muted-foreground"}`}>
                          {hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <KouRibbon plants={plants} onPickPlant={(p) => setActive(p)} />

                <button
                  onClick={() => setKouWashOn((v) => !v)}
                  className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                    kouWashOn ? "border-foreground bg-foreground/5" : "border-border bg-background hover:bg-muted"
                  }`}
                  aria-pressed={kouWashOn}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border/60"
                      style={{ backgroundColor: todayTint.hex }}
                    />
                    <span>
                      <span className="font-medium">Kō tint wash</span>
                      <span className="ml-1.5 text-muted-foreground">{todayTint.name}</span>
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
                          .filter((p) => isPlantActive(p.id, seasonalActiveMonths))
                          .map((p) => {
                            const interest = plantInterest[p.id]!;
                            const c = interestColor[interest.kind];
                            return (
                              <li key={p.id}>
                                <button
                                  onClick={() => setActive(p)}
                                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/60"
                                >
                                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.bg}`} />
                                  <span className="flex-1 text-sm">
                                    <span className="font-medium">{p.name}</span>
                                    {p.japanese && (
                                      <span className="ml-1.5 text-xs text-muted-foreground">{p.japanese}</span>
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
                      Bloom windows are curated estimates for the Los Angeles climate, not
                      live observations. Persimmon, cherry, and wisteria timing in Little
                      Tokyo can shift a few weeks year-to-year.
                    </p>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <GardenSheet
            open={gardenOpen}
            onOpenChange={setGardenOpen}
            interpretiveZone={interpretiveZone}
            onInterpretiveZoneChange={setInterpretiveZone}
          />
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
                              ? "bg-[#007b43]"
                              : plantCategory(p) === "substitute"
                                ? "bg-[#ed6d3d]"
                                : "bg-[#888e7e]"
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
      <div
  className="relative flex-1 overflow-hidden transition-colors duration-700"
  style={{
    backgroundColor: kouWashOn
      ? todayTint.hex + "20"
      : "var(--map-background)",
  }}
>
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
          onTransform={(ref) => setScale(ref.state.scale)}
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
              {useSvgMap ? (
  <GardenMapSvg
  className={`garden-map-svg zone-${interpretiveZone} block h-full w-full select-none`}
  role="img"
  aria-label="Illustrated planting plan of Seiryū-en"
  preserveAspectRatio="xMidYMid meet"
/>
) : (
  <img
    src={gardenMap}
    alt="Illustrated planting plan of Seiryū-en"
    className="block h-full w-full select-none object-contain"
    draggable={false}
  />
)}
              {plants.map((p) => {
                const category = plantCategory(p);
                if (!visibleCats[category]) return null;
                // Determine effective color: seasonal mode overrides category colors.
                let dotBg = categoryDotClass(category);
                let haloBg = categoryHaloClass(category);
                let glow = categoryGlowStyle(category);
                let isSeasonalActive = false;
                if (seasonalActiveMonths) {
                  isSeasonalActive = isPlantActive(p.id, seasonalActiveMonths);
                  if (isSeasonalActive) {
                    const kind = plantInterest[p.id]!.kind;
                    dotBg = interestColor[kind].bg;
                    haloBg = interestColor[kind].halo;
                    glow = interestColor[kind].glow;
                  } else {
                    dotBg = dormantColor.bg;
                    haloBg = dormantColor.halo;
                    glow = dormantColor.glow;
                  }
                }
                const fade = seasonalActiveMonths && !isSeasonalActive ? "opacity-40" : "";
                return (
                  <button
                    type="button"
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
                    className={`group absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
  editMode ? "cursor-move" : ""
} ${fade}`}
                    aria-label={p.name}
                  >
                    <span
  className="relative flex h-6 w-6 items-center justify-center"
  style={{ transform: `scale(${1 / scale})` }}
>
  <span
    className={`absolute inset-0 rounded-full border-2 border-white bg-white/80 shadow-[0_1px_4px_rgba(20,30,25,0.35)] transition-transform duration-200 ${
      hovered === p.id || dragId === p.id
        ? "scale-110"
        : "group-hover:scale-110"
    }`}
  />

  <span
    className={`relative h-3 w-3 rounded-full border border-white ${dotBg}`}
    style={{
      boxShadow:
        hovered === p.id || dragId === p.id
          ? glow
          : "0 1px 3px rgba(20,30,25,0.4)",
    }}
  />
</span>
                    {(hovered === p.id || dragId === p.id) && (
                      <span
                        className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background shadow-lg"
                        style={{ transform: `translateX(-50%) scale(${1 / scale})`, transformOrigin: "top center" }}
                      >
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
                  scale={scale}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>

        {/* Floating filter chips */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center gap-1.5 md:right-auto md:max-w-md">
          {([
            ["manyoshu", "bg-[#007b43]", "bg-[#007b43]/15 border-[#007b43]/30", "Man\u2019yōshū"],
            ["substitute", "bg-[#ed6d3d]", "bg-[#ed6d3d]/15 border-[#ed6d3d]/30", "SoCal sub"],
            ["none", "bg-[#888e7e]", "bg-[#888e7e]/15 border-[#888e7e]/30", "Other"],
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

              {plantInterest[active.id] && plantInterest[active.id].months.length > 0 && (
                <PhenologyStrip plantId={active.id} />
              )}

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

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function PhenologyStrip({ plantId }: { plantId: string }) {
  const interest = plantInterest[plantId];
  if (!interest) return null;
  const now = new Date().getMonth() + 1;
  const c = interestColor[interest.kind];
  const kindLabel =
    interest.kind === "bloom" ? "Flowering" : interest.kind === "fruit" ? "Fruiting" : "Foliage interest";
  return (
    <div className="rounded-md border border-border/60 bg-muted/40 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Seasonal interest · Los Angeles
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{kindLabel}</span>
      </div>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const on = interest.months.includes(m);
          const isNow = m === now;
          return (
            <div key={m} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`h-3 w-full rounded-sm border ${
                  on ? `${c.bg} border-transparent` : "border-border/60 bg-background/60"
                } ${isNow ? "ring-1 ring-foreground" : ""}`}
                aria-label={on ? `Active in month ${m}` : `Not active in month ${m}`}
              />
              <span
                className={`text-[9px] tabular-nums ${
                  isNow ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {MONTH_LABELS[m - 1]}
              </span>
            </div>
          );
        })}
      </div>
      {interest.note && (
        <p className="mt-2 text-[11px] italic text-muted-foreground">{interest.note}</p>
      )}
    </div>
  );
}

function KouRibbon({
  plants,
  onPickPlant,
}: {
  plants: Plant[];
  onPickPlant: (p: Plant) => void;
}) {
  const todayKou = currentKou();
  const [offset, setOffset] = useState(0);
  const k: Kou = kouAt(todayKou.index + offset);
  const linkedPlants = (k.plantIds ?? [])
    .map((id) => plants.find((p) => p.id === id))
    .filter((p): p is Plant => Boolean(p));
  const dateLabel = `${k.start.m}/${k.start.d}`;
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          七十二候 · Microseason {k.index} / 72
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffset(offset - 1)}
            className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-muted"
            aria-label="Previous microseason"
          >
            ‹
          </button>
          <button
            onClick={() => setOffset(0)}
            className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-muted"
          >
            Today
          </button>
          <button
            onClick={() => setOffset(offset + 1)}
            className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:bg-muted"
            aria-label="Next microseason"
          >
            ›
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-serif text-lg leading-tight text-foreground">{k.kanji}</span>
        <span className="text-[11px] italic text-muted-foreground">{k.romaji}</span>
      </div>
      <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px]">
        <span className="text-muted-foreground">京都</span>
        <span className="text-foreground">
          {k.en} <span className="text-muted-foreground">· ~{dateLabel}</span>
        </span>
        <span className="text-muted-foreground">L.A.</span>
        <span className="text-foreground/80">
          {k.laNote ?? <span className="italic text-muted-foreground">Reads the same in LA.</span>}
        </span>
      </div>
      {linkedPlants.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {linkedPlants.map((p) => (
            <button
              key={p.id}
              onClick={() => onPickPlant(p)}
              className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] hover:bg-muted"
            >
              {p.name}
              {p.japanese && <span className="ml-1 text-muted-foreground">{p.japanese}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
