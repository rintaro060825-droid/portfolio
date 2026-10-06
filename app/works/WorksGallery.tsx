"use client";

import { useState } from "react";
import Image from "next/image";

type Category = "video" | "retouch" | "logo";

export type Work = {
  title: string;
  category: Category;
  src: string;
  /** Video only: still image shown before the video plays */
  poster?: string;
};

export default function WorksGallery({ works }: { works: Work[] }) {
  const [selected, setSelected] = useState<Work | null>(null);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <figure key={work.src} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setSelected(work)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
            >
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
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              )}
            </button>
            <figcaption className="text-sm text-zinc-600 dark:text-zinc-400">
              {work.title}
            </figcaption>
          </figure>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setSelected(null)}
        >
          {selected.category === "video" ? (
            <video
              src={selected.src}
              poster={selected.poster}
              aria-label={selected.title}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full"
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
