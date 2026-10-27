"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Category = "video" | "retouch" | "logo";

export type Work = {
  title: string;
  category: Category;
  src: string;
  /** Video only: still image shown before the video plays */
  poster?: string;
};

// Minimum horizontal travel, in px, for a touch to count as a swipe
const SWIPE_THRESHOLD = 50;

// A photo this close to 1:1 gets a thin dark grey border; any other shape is
// fitted whole, leaving dark grey only above and below or at the sides.
const SQUARE_TOLERANCE = 0.02;

// Full-size photo intro: the photo is cut into vertical strips that each start
// shifted up or down by a random amount, then slide back into place.
const STRIP_COUNT = 24;
const STRIP_MAX_OFFSET = 40; // % of the photo's height
const STRIP_MIN_OFFSET = 10;
const STRIP_DURATION = 700; // ms
const STRIP_MAX_DELAY = 200; // ms

const photoClass =
  "h-auto max-h-[calc(100dvh-5rem)] w-auto max-w-[calc(100vw-3rem)]";

function StripReveal({ work }: { work: Work }) {
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  const [strips] = useState(() =>
    Array.from({ length: STRIP_COUNT }, () => {
      const size =
        STRIP_MIN_OFFSET +
        Math.random() * (STRIP_MAX_OFFSET - STRIP_MIN_OFFSET);
      return {
        offset: Math.random() < 0.5 ? -size : size,
        delay: Math.random() * STRIP_MAX_DELAY,
      };
    }),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setDone(true));
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!loaded || done) return;
    const timer = window.setTimeout(
      () => setDone(true),
      STRIP_DURATION + STRIP_MAX_DELAY,
    );
    return () => clearTimeout(timer);
  }, [loaded, done]);

  return (
    <div className="relative">
      {/* The whole photo sets the size and takes over once the strips land */}
      <Image
        src={work.src}
        alt={work.title}
        width={0}
        height={0}
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        className={`${photoClass} ${done ? "" : "invisible"}`}
      />
      {loaded &&
        !done &&
        strips.map((strip, i) => (
          <Image
            key={i}
            src={work.src}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-fill"
            style={
              {
                clipPath: `inset(0 ${100 - ((i + 1) / STRIP_COUNT) * 100}% 0 ${
                  (i / STRIP_COUNT) * 100
                }%)`,
                "--strip-offset": `${strip.offset}%`,
                animation: `strip-in ${STRIP_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) ${strip.delay}ms both`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}

export default function WorksGallery({ works }: { works: Work[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : works[selectedIndex];
  const isOpen = selectedIndex !== null;
  const touchStart = useRef<{ x: number; y: number } | null>(null);
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
          onTouchStart={(e) => {
            // Leave touches on a video alone so its scrubber still works
            const onVideo = e.target instanceof HTMLVideoElement;
            const touch = e.touches[0];
            touchStart.current = onVideo
              ? null
              : { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy))
              return;
            // Swipe left for the next work, right for the previous one
            step(dx < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>
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
            <StripReveal key={selected.src} work={selected} />
          )}
          <p className="text-xs tracking-wide text-white/70">
            {selected.title}
          </p>
        </div>
      )}
    </>
  );
}
