import { useEffect, useState } from "react";
import { plantWiki } from "@/data/plant-images";

const cache = new Map<string, string | null>();

async function fetchThumb(slug: string): Promise<string | null> {
  if (cache.has(slug)) return cache.get(slug) ?? null;
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
      cache.set(slug, null);
      return null;
    }
    const data = (await res.json()) as { thumbnail?: { source?: string } };
    const url = data.thumbnail?.source ?? null;
    cache.set(slug, url);
    return url;
  } catch {
    cache.set(slug, null);
    return null;
  }
}

export function PlantThumb({
  plantId,
  alt,
  fallbackClass,
}: {
  plantId: string;
  alt: string;
  fallbackClass: string;
}) {
  const slug = plantWiki[plantId];
  const [src, setSrc] = useState<string | null>(() =>
    slug ? cache.get(slug) ?? null : null,
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug || src) return;
    let cancelled = false;
    fetchThumb(slug).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, src]);

  return (
    <span className="relative block h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-stone-200 bg-stone-100">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <span
          className={`absolute inset-0 m-auto h-2 w-2 rounded-full ${fallbackClass}`}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      )}
    </span>
  );
}
