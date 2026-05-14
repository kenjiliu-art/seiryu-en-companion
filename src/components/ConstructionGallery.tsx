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
  "05": { src: img05, caption: "Boulder placement along the dry stream bed" },
  "06": { src: img06, caption: "Selecting stones at the quarry" },
  "07": { src: img07, caption: "Crew lifting a stone into place" },
  "08": { src: img08, caption: "Stone arrangement nearing completion" },
  "09": { src: img09, caption: "Mid-construction view of the boulder work" },
  "10": { src: img10, caption: "The volunteer crew, on site" },
};

export type ConstructionPinSpec = {
  id: string;
  x: number; // % of map width
  y: number; // % of map height
  title: string;
  description: string;
  photos: string[]; // keys into ALL
};

export const defaultConstructionPins: ConstructionPinSpec[] = [
  {
    id: "site-prep",
    x: 44.5,
    y: 31,
    title: "Site preparation",
    description: "Trucks delivering fill and grading the basin beneath the JACCC plaza, 1979.",
    photos: ["03", "04"],
  },
  {
    id: "stream",
    x: 48,
    y: 50,
    title: "Stream &amp; basin",
    description: "Hand-shaping the dry stream channel and the central basin.",
    photos: ["01", "02"],
  },
  {
    id: "boulders",
    x: 60.4,
    y: 32.7,
    title: "Boulder placement",
    description: "Selecting stones at the quarry and setting them along the lower slope.",
    photos: ["06", "05", "07", "08", "09"],
  },
  {
    id: "crew",
    x: 88,
    y: 88,
    title: "The volunteer crew",
    description: "On-site portrait of the volunteers who built the garden.",
    photos: ["10"],
  },
];

export function ConstructionPin({
  pin,
  editMode = false,
  isDragging = false,
  onDragStart,
}: {
  pin: ConstructionPinSpec;
  editMode?: boolean;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
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
        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className={`absolute inset-0 rounded-full border border-stone-700/40 bg-stone-50/90 shadow-sm transition-transform duration-300 ${isDragging ? "scale-125 ring-2 ring-accent" : "group-hover:scale-125"}`} />
          <Camera className="relative h-3.5 w-3.5 text-stone-700" aria-hidden />
        </span>
        <span className={`pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-wider text-background shadow-lg ${isDragging ? "block" : "hidden group-hover:block"}`}>
          {pin.title.replace(/&amp;/g, "&")}
          {isDragging ? ` · ${pin.x}, ${pin.y}` : ` · ${photos.length}`}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-stone-200/60 bg-background p-0 sm:max-w-3xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle
              className="font-serif text-2xl"
              dangerouslySetInnerHTML={{ __html: pin.title }}
            />
            <DialogDescription>{pin.description}</DialogDescription>
          </DialogHeader>
          <div className={photos.length > 1 ? "px-12 pb-6 pt-2" : "px-6 pb-6 pt-2"}>
            <Carousel setApi={setApi} opts={{ loop: true }}>
              <CarouselContent>
                {photos.map((photo, i) => (
                  <CarouselItem key={i}>
                    <figure className="flex flex-col items-center gap-3">
                      <div className="flex h-[55vh] w-full items-center justify-center overflow-hidden rounded-sm bg-stone-100">
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <figcaption className="text-center text-xs text-muted-foreground">
                        {photo.caption}
                        {photos.length > 1 && (
                          <span className="ml-2 tabular-nums opacity-60">
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
                  <CarouselPrevious className="-left-10" />
                  <CarouselNext className="-right-10" />
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
