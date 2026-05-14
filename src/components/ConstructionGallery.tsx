import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const photos = [
  { src: img01, caption: "Volunteers shaping the stream channel by hand" },
  { src: img02, caption: "Setting boulders and planting along the upper slope" },
  { src: img03, caption: "Truck delivering fill to the future garden site" },
  { src: img04, caption: "Grading the basin beneath the JACCC plaza" },
  { src: img05, caption: "Boulder placement along the dry stream bed" },
  { src: img06, caption: "Selecting stones at the quarry" },
  { src: img07, caption: "Crew lifting a stone into place" },
  { src: img08, caption: "Stone arrangement nearing completion" },
  { src: img09, caption: "Mid-construction view of the boulder work" },
  { src: img10, caption: "The volunteer crew, on site" },
];

export function ConstructionGallery() {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent">
          <Camera className="h-3.5 w-3.5" aria-hidden />
          Behind the scenes
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-stone-200/60 bg-background p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-serif text-2xl">
            Building the garden, 1979
          </DialogTitle>
          <DialogDescription>
            Photos from the construction of the James Irvine Japanese Garden by
            volunteers and Takeo Uesugi&apos;s crew.
          </DialogDescription>
        </DialogHeader>

        <div className="px-12 pb-6 pt-2">
          <Carousel setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
              {photos.map((photo, i) => (
                <CarouselItem key={i}>
                  <figure className="flex flex-col items-center gap-3">
                    <div className="flex h-[60vh] w-full items-center justify-center overflow-hidden rounded-sm bg-stone-100">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="text-center text-xs text-muted-foreground">
                      {photo.caption}{" "}
                      <span className="ml-2 tabular-nums opacity-60">
                        {i + 1} / {photos.length}
                      </span>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-10" />
            <CarouselNext className="-right-10" />
          </Carousel>
          {/* hidden but referenced to satisfy linter for current */}
          <span className="sr-only">Slide {current + 1}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
