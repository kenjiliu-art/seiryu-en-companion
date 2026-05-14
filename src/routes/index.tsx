import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import gardenMap from "@/assets/garden-map.jpg";
import { plants, manyoshuUrl, type Plant } from "@/data/plants";
import { poems } from "@/data/poems";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function Index() {
  const [active, setActive] = useState<Plant | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

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

      <div className="grid gap-6 px-4 py-6 md:px-10 lg:grid-cols-[1fr_320px]">
        {/* Map */}
        <div className="relative overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <div className="relative">
            <img
              src={gardenMap}
              alt="Planting plan of the JACCC James Irvine Japanese Garden"
              className="block w-full select-none"
              draggable={false}
            />
            {plants.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={p.name}
              >
                <span
                  className={`block h-3 w-3 rounded-full border-2 border-primary-foreground bg-primary shadow-md transition-transform ${
                    hovered === p.id ? "scale-150" : "group-hover:scale-125"
                  } ${p.manyoshu ? "ring-2 ring-accent/60" : p.categoryRefs ? "ring-2 ring-accent/30" : ""}`}
                />
                {hovered === p.id && (
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background shadow-lg">
                    {p.name}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full border-2 border-primary-foreground bg-primary ring-2 ring-accent/60" />
              Plant referenced in the Man&apos;yōshū
            </span>
            <span className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full border-2 border-primary-foreground bg-primary" />
              Garden plant
            </span>
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
          <ScrollArea className="h-[60vh]">
            <ul className="divide-y divide-border/50">
              {plants.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setActive(p)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-muted/60 ${
                      hovered === p.id ? "bg-muted/60" : ""
                    }`}
                  >
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
