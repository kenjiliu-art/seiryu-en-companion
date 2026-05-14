import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type Props = {
  src: string;
  className?: string;
};

export function PdfMap({ src, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderTask: any = null;

    async function render() {
      const loadingTask = pdfjs.getDocument(src);
      const pdf = await loadingTask.promise;
      if (cancelled) return;
      const page = await pdf.getPage(1);
      if (cancelled) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const baseViewport = page.getViewport({ scale: 1 });
      setRatio(baseViewport.height / baseViewport.width);

      const containerWidth = container.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      // Render at 2x for crisp zoom-in; capped to avoid huge canvases.
      const renderScale = Math.min(3, (containerWidth * dpr * 2) / baseViewport.width);
      const viewport = page.getViewport({ scale: renderScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      renderTask = page.render({ canvasContext: ctx, viewport, canvas });
      try {
        await renderTask.promise;
      } catch {
        /* cancelled */
      }
    }

    render();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={ratio ? { aspectRatio: `${1 / ratio}` } : undefined}
    >
      <canvas ref={canvasRef} className="block w-full select-none" />
    </div>
  );
}
