import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Plant } from "@/data/plants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlantThumb } from "@/components/PlantThumb";
import { useSearchListNavigation } from "@/hooks/useSearchListNavigation";

interface PlantSearchSheetProps {
  plants: Plant[];
  onPickPlant: (plant: Plant) => void;
}

function searchableText(plant: Plant): string {
  return [
    plant.name,
    plant.japanese,
    plant.romaji,
    plant.scientific,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <>{text}</>;
  }

  const lowerText = text.toLocaleLowerCase();
  const lowerQuery = trimmedQuery.toLocaleLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return <>{text}</>;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(
    matchIndex,
    matchIndex + trimmedQuery.length,
  );
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
  <>
    {before}
    <span className="rounded-sm bg-accent/20 text-inherit">
      {match}
    </span>
    {after}
  </>
);
}

export function PlantSearchSheet({
  plants,
  onPickPlant,
}: PlantSearchSheetProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return plants;

    return plants.filter((plant) =>
      searchableText(plant).includes(normalizedQuery),
    );
  }, [plants, normalizedQuery]);

  const selectPlant = (plant: Plant) => {
    onPickPlant(plant);
    setOpen(false);
    setQuery("");
  };

  const {
  activeIndex,
  setActiveIndex,
  handleKeyDown,
  getItemRef,
} = useSearchListNavigation({
  items: results,
  onSelect: selectPlant,
  onEscape: () => setOpen(false),
});

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setQuery("");
    }
  };

  useEffect(() => {
  if (open) {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }
}, [open]);

useEffect(() => {
  setActiveIndex(-1);
}, [normalizedQuery, setActiveIndex]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          aria-label="Search plants"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[92vw] flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60 px-4 py-3">
          <SheetTitle className="font-serif text-lg">
            Search plants
          </SheetTitle>

          <p className="text-xs text-muted-foreground">
            Search by English, Japanese, romaji, or scientific name.
          </p>
        </SheetHeader>

        <div className="border-b border-border/60 p-4">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <input
                ref={inputRef}
                type="search"
                value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search plants"
              onKeyDown={handleKeyDown}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search plants"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <p
  className="mt-2 text-[11px] text-muted-foreground"
  aria-live="polite"
>
  {normalizedQuery
    ? `${results.length} matching ${
        results.length === 1 ? "plant" : "plants"
      }`
    : `${plants.length} plants`}
</p>
        </div>

        <ScrollArea className="flex-1">
          {results.length > 0 ? (
            <ul className="divide-y divide-border/50">
              {results.map((plant, index) => (
                <li key={plant.id}>
                  <button
                    ref={getItemRef(index)}
                    type="button"
                    onClick={() => selectPlant(plant)}
                    onMouseEnter={() => setActiveIndex(index)}
                    aria-selected={activeIndex === index}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
  activeIndex === index
    ? "bg-muted"
    : "hover:bg-muted/60"
}`}
                  >
                    <PlantThumb
                      plantId={plant.id}
                      alt=""
                      fallbackClass="bg-[#888e7e]"
                    />

                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
  <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
  <span>
    <HighlightedText
      text={plant.name}
      query={query}
    />
  </span>

    {plant.manyoshu && (
      <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
        poem
      </span>
    )}

    {!plant.manyoshu && plant.categoryRefs && (
      <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent/80">
        general
      </span>
    )}
  </span>

  {plant.japanese && (
    <span className="text-xs text-muted-foreground">
      <HighlightedText
        text={plant.japanese}
        query={query}
      />
    </span>
  )}

  {plant.substitute && (
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
      LA substitute
    </span>
  )}

  {(plant.romaji || plant.scientific) && (
    <span className="truncate text-xs italic text-muted-foreground">
      {plant.romaji && (
        <HighlightedText
          text={plant.romaji}
          query={query}
        />
      )}

      {plant.romaji && plant.scientific && " · "}

      {plant.scientific && (
        <HighlightedText
          text={plant.scientific}
          query={query}
        />
      )}
    </span>
  )}
</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium">
                No plants match your search.
              </p>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Try an English, Japanese, romaji, or scientific name.
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}