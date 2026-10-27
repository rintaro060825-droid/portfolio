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

// Dragging a full-size photo cuts it into vertical strips that each bob up and
// down on their own random wave as the drag moves, then snap back on release.
const STRIP_COUNT = 24;
const STRIP_MAX_OFFSET = 30; // % of the photo's height
// Drag distance, in px, over which the strips grow to their full movement
const STRIP_RAMP = 120;
// How fast each strip's wave turns as the drag moves, in radians per px
const STRIP_MIN_SPEED = 0.01;
const STRIP_MAX_SPEED = 0.04;
const STRIP_SETTLE = 450; // ms

const photoClass =
  "h-auto max-h-[calc(100dvh-5rem)] w-auto max-w-[calc(100vw-3rem)]";

function StripPhoto({
  work,
  dragX,
  settling,
}: {
  work: Work;
  dragX: number;
  settling: boolean;
}) {
  const [strips] = useState(() =>
    Array.from({ length: STRIP_COUNT }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed:
        STRIP_MIN_SPEED + Math.random() * (STRIP_MAX_SPEED - STRIP_MIN_SPEED),
    })),
  );
  const active = dragX !== 0 || settling;
  const ramp = Math.min(Math.abs(dragX) / STRIP_RAMP, 1);

  return (
    <div className="relative">
      {/* The whole photo sets the size and shows whenever the strips rest */}
      <Image
        src={work.src}
        alt={work.title}
        width={0}
        height={0}
        sizes="100vw"
        draggable={false}
        className={`${photoClass} ${active ? "invisible" : ""}`}
      />
      {active &&
        strips.map((strip, i) => (
          <Image
            key={i}
            src={work.src}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            draggable={false}
            className="object-fill"
            style={{
              clipPath: `inset(0 ${100 - ((i + 1) / STRIP_COUNT) * 100}% 0 ${
                (i / STRIP_COUNT) * 100
              }%)`,
              transform: `translateY(${
                STRIP_MAX_OFFSET * ramp * Math.sin(dragX * strip.speed + strip.phase)
              }%)`,
              transition: settling
                ? `transform ${STRIP_SETTLE}ms cubic-bezier(0.22, 1, 0.36, 1)`
                : undefined,
            }}
          />
        ))}
    </div>
  );
}

export default function WorksGallery({ works }: { works: Work[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : works[selectedIndex];
  const isOpen = selectedIndex !== null;
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  // Set once a press moves far enough to be a drag, so letting go won't close
  const dragged = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [settling, setSettling] = useState(false);
  const [squares, setSquares] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!settling) return;
    const timer = window.setTimeout(() => setSettling(false), STRIP_SETTLE);
    return () => clearTimeout(timer);
  }, [settling]);

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
          className="fixed inset-0 z-50 flex touch-none flex-col items-center justify-center gap-3 bg-black/90 p-6 select-none"
          onClick={() => {
            if (dragged.current) dragged.current = false;
            else close();
          }}
          onPointerDown={(e) => {
            // Leave presses on a video or the close button alone, so the
            // video's scrubber and the button still work
            const target = e.target as Element;
            if (target instanceof HTMLVideoElement || target.closest("button"))
              return;
            dragStart.current = { x: e.clientX, y: e.clientY };
            dragged.current = false;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const start = dragStart.current;
            if (!start) return;
            const dx = e.clientX - start.x;
            if (Math.abs(dx) > 5) dragged.current = true;
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
              setDragX(dx);
          }}
          onPointerUp={(e) => {
            const start = dragStart.current;
            dragStart.current = null;
            if (!start) return;
            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            setDragX(0);
            if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
              setSettling(dx !== 0);
              return;
            }
            // Swipe left for the next work, right for the previous one
            step(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            setDragX(0);
            setSettling(true);
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
            <StripPhoto
              key={selected.src}
              work={selected}
              dragX={dragX}
              settling={settling}
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
