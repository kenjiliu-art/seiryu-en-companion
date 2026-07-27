import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import img01 from "@/assets/construction/01.jpg";
import img02 from "@/assets/construction/02.jpg";
import img03 from "@/assets/construction/03.jpg";
import img04 from "@/assets/construction/04.jpg";
import img05 from "@/assets/construction/05.jpg";
import img06 from "@/assets/construction/06.jpg";
import img07 from "@/assets/construction/07.jpg";
import img08 from "@/assets/construction/08.jpg";
import img09 from "@/assets/construction/09.jpg";
import img10 from "@/assets/construction/10.jpg";

type Photo = { src: string; caption: string };

const ALL: Record<string, Photo> = {
  "01": { src: img01, caption: "Volunteers shaping the stream channel by hand" },
  "02": { src: img02, caption: "Setting boulders and planting along the upper slope" },
  "03": { src: img03, caption: "Truck delivering fill to the future garden site" },
  "04": { src: img04, caption: "Grading the basin beneath the JACCC plaza" },
  "05": { src: img05, caption: "Boulder placement along the stream bed and trail" },
  "06": { src: img06, caption: "Selecting stones at the quarry" },
  "07": { src: img07, caption: "Crew lifting a stone into place" },
  "08": { src: img08, caption: "Stone arrangement nearing completion" },
  "09": { src: img09, caption: "Mid-construction view of the boulder work" },
  "10": { src: img10, caption: "The Southern California Gardeners Federation volunteer crew" },
};

export type ConstructionPinSpec = {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  photos: string[];
  date?: string;
  source?: string;
  rights?: string;
};

export const constructionPins: ConstructionPinSpec[] = [
  {
    id: "site-prep",
    x: 44.5,
    y: 31,
    title: "Site preparation",
    description: "Trucks delivering fill and grading the basin beneath the JACCC plaza, 1979.",
    photos: ["03", "04"],
    date: "1979",
    source: "JACCC Archives",
rights: "© Japanese American Cultural & Community Center",
  },
  {
    id: "stream",
    x: 46.4,
    y: 65,
    title: "Stream & basin",
    description: "Hand-shaping the dry stream channel and the central basin.",
    photos: ["01", "02"],
    date: "1979",
    source: "JACCC Archives",
rights: "© Japanese American Cultural & Community Center",
  },
  {
    id: "boulders",
    x: 60.4,
    y: 32.7,
    title: "Boulder placement",
    description: "Selecting stones at the quarry and setting them along the lower slope.",
    photos: ["06", "05", "07", "08", "09"],
    date: "1979",
    source: "JACCC Archives",
rights: "© Japanese American Cultural & Community Center",
  },
  {
  id: "crew",
  x: 54.8,
  y: 54.1,
  title: "Southern California Gardeners Federation",
  description:
    "Members of the Southern California Gardeners Federation volunteered their expertise and labor to help build Seiryū-en in 1979.",
  photos: ["10"],
  date: "1979",
  source: "JACCC Archives",
rights: "© Japanese American Cultural & Community Center",
},
];

export function ConstructionPin({
  pin,
  editMode = false,
  isDragging = false,
  onDragStart,
  scale = 1,
}: {
  pin: ConstructionPinSpec;
  editMode?: boolean;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
  scale?: number;
}) {
  const [open, setOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const photos = pin.photos.map((k) => ALL[k]);

  return (
    <>
      <button
        onClick={() => !editMode && setOpen(true)}
        onMouseDown={(e) => {
          if (editMode) {
            e.preventDefault();
            onDragStart?.(pin.id);
          }
        }}
        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 ${editMode ? "cursor-move" : ""}`}
        aria-label={`Construction photos: ${pin.title}`}
      >
        <span
          className="relative flex h-6 w-6 items-center justify-center"
          style={{ transform: `scale(${1 / scale})` }}
        >
          <span className={`absolute inset-0 rounded-full border border-stone-700/40 bg-stone-50/90 shadow-sm transition-transform duration-300 ${isDragging ? "scale-125 ring-2 ring-accent" : "group-hover:scale-125"}`} />
          <Camera className="relative h-3 w-3 text-stone-700" aria-hidden />
        </span>
        <span
          className={`pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-wider text-background shadow-lg ${isDragging ? "block" : "hidden group-hover:block"}`}
          style={{ transform: `translateX(-50%) scale(${1 / scale})`, transformOrigin: "top center" }}
        >
          {pin.title}
          {isDragging ? ` · ${pin.x}, ${pin.y}` : ` · ${photos.length}`}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[94vh] w-[94vw] max-w-[94vw] overflow-y-auto border-stone-200/60 bg-background p-0 sm:max-w-6xl">
          <DialogHeader className="px-6 pt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
  Construction Photograph
            </p>
            <DialogTitle className="font-serif text-2xl">{pin.title}</DialogTitle>
            <DialogDescription>{pin.description}</DialogDescription>
            {(pin.date || pin.source || pin.rights) && (
  <div className="mt-3 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
    {pin.date && (
      <p>
        <strong>Date:</strong> {pin.date}
      </p>
    )}

    {pin.source && (
      <p>
        <strong>Source:</strong> {pin.source}
      </p>
    )}

    {pin.rights && <p>{pin.rights}</p>}
  </div>
)}
          </DialogHeader>
          <div className={photos.length > 1 ? "px-12 pb-6 pt-2" : "px-6 pb-6 pt-2"}>
            <Carousel setApi={setApi} opts={{ loop: true }}>
  <CarouselContent>
    {photos.map((photo, i) => (
      <CarouselItem key={i}>
        <figure className="flex flex-col gap-3">
          <div className="flex h-[58vh] w-full items-center justify-center bg-stone-100 sm:h-[65vh]">
  <img
    src={photo.src}
    alt={photo.caption}
    className="max-h-full max-w-full object-contain"
    loading="lazy"
  />
</div>

          <figcaption className="flex items-start justify-between gap-4 px-1 text-xs leading-relaxed text-muted-foreground">
            <span>{photo.caption}</span>

            {photos.length > 1 && (
              <span className="shrink-0 tabular-nums opacity-60">
                {i + 1} / {photos.length}
              </span>
            )}
          </figcaption>
        </figure>
      </CarouselItem>
    ))}
  </CarouselContent>

  {photos.length > 1 && (
    <>
      <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 bg-background/90" />
      <CarouselNext className="right-3 top-1/2 -translate-y-1/2 bg-background/90" />
    </>
  )}
</Carousel>
            <span className="sr-only">Slide {current + 1}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
