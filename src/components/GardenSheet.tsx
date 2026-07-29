import { Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ZoneSelector,
  type InterpretiveZone,
} from "@/components/ZoneSelector";

interface GardenSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interpretiveZone: InterpretiveZone;
  onInterpretiveZoneChange: (zone: InterpretiveZone) => void;
}

export function GardenSheet({
  open,
  onOpenChange,
  interpretiveZone,
  onInterpretiveZoneChange,
}: GardenSheetProps) {
  const handleZoneChange = (zone: InterpretiveZone) => {
    onInterpretiveZoneChange(zone);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          aria-label="Open garden information"
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Garden</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[88vw] overflow-y-auto sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            About this map
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <p>
            An interactive planting plan after Takeo Uesugi&apos;s 1979
            design. Tap a marker on the map — or a plant in the legend — to
            read its uses, symbolism, and Man&apos;yōshū (万葉集) poem
            references.
          </p>

          <ZoneSelector
            value={interpretiveZone}
            onChange={handleZoneChange}
          />

          <div className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3">
            <h2 className="font-serif text-base text-foreground">
              What is the Man&apos;yōshū?
            </h2>

            <p>
              The <em>Man&apos;yōshū</em> (万葉集, &ldquo;Collection of Ten
              Thousand Leaves&rdquo;) is Japan&apos;s oldest surviving
              anthology of poetry, compiled around 759 CE during the Nara
              period. Its 4,500+ poems were written by emperors and farmers
              alike, and they record the natural world — plants, birds,
              seasons, weather — with extraordinary attentiveness. It is a
              foundational text of Japanese literature and a touchstone for
              how the Japanese aesthetic tradition reads meaning into nature.
            </p>
          </div>

          <div className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3">
            <h2 className="font-serif text-base text-foreground">
              What is a Man&apos;yōshū garden?
            </h2>

            <p>
              A <em>Man&apos;yō-shokubutsu-en</em> (万葉植物園) is a garden
              planted with species named in the Man&apos;yōshū — a living
              anthology where each plant carries the poem that mentions it.
              The form began at shrines and universities in 20th-century Japan
              as both a botanical record and a literary one. The James Irvine
              Garden adapts this idea for Southern California: where the
              original species can&apos;t survive the local climate, a
              substitute marked{" "}
              <span className="rounded-full border border-dashed border-muted-foreground/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                LA sub
              </span>{" "}
              stands in for the Man&apos;yōshū plant it represents.
            </p>
          </div>

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
  );
}