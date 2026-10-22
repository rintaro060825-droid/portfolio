"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Category = "video" | "retouch" | "logo";

export type Work = {
  title: string;
  category: Category;
  src: string;
  /** Video only: still image shown before the video plays */
  poster?: string;
};

// A photo this close to 1:1 gets a thin dark grey border; any other shape is
// fitted whole, leaving dark grey only above and below or at the sides.
const SQUARE_TOLERANCE = 0.02;

export default function WorksGallery({ works }: { works: Work[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : works[selectedIndex];
  const isOpen = selectedIndex !== null;
  const [squares, setSquares] = useState<Record<string, boolean>>({});

  const measure = (src: string, width: number, height: number) => {
    if (!width || !height) return;
    if (Math.abs(width / height - 1) <= SQUARE_TOLERANCE) {
      setSquares((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
    }
  };

  const close = () => setSelectedIndex(null);
  // Wraps around at either end
  const step = (delta: number) =>
    setSelectedIndex((i) =>
      i === null ? i : (i + delta + works.length) % works.length,
    );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // step and close only call setSelectedIndex, so they never go stale
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
        {works.map((work, index) => (
          <figure key={work.src} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`group relative aspect-square overflow-hidden bg-[#333338] shadow-lg ${
                squares[work.src] ? "p-[4%]" : ""
              }`}
            >
              <div className="relative h-full w-full">
                {work.category === "video" ? (
                  <>
                    <video
                      src={work.src}
                      poster={work.poster}
                      aria-label={work.title}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) =>
                        e.currentTarget.play().catch(() => {})
                      }
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      onLoadedMetadata={(e) =>
                        measure(
                          work.src,
                          e.currentTarget.videoWidth,
                          e.currentTarget.videoHeight,
                        )
                      }
                      className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                    >
                      ▶
                    </span>
                  </>
                ) : (
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    onLoad={(e) =>
                      measure(
                        work.src,
                        e.currentTarget.naturalWidth,
                        e.currentTarget.naturalHeight,
                      )
                    }
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                )}
              </div>
            </button>
            <figcaption className="text-sm tracking-wide text-white/70">
              {work.title}
            </figcaption>
          </figure>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/90 p-6"
          onClick={close}
        >
          {selected.category === "video" ? (
            <video
              key={selected.src}
              src={selected.src}
              poster={selected.poster}
              aria-label={selected.title}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[calc(100%-2rem)] max-w-full"
            />
          ) : (
            <Image
              src={selected.src}
              alt={selected.title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto max-h-[calc(100%-2rem)] w-auto max-w-full"
            />
          )}
          <p className="text-xs tracking-wide text-white/70">
            {selected.title}
          </p>
        </div>
      )}
    </>
  );
}
