"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image, { type StaticImageData } from "next/image";

export type Work = { title: string } & (
  | { image: StaticImageData }
  | {
      video: string;
      /** Still image shown before the film plays */
      poster?: string;
      /** width / height; 16:9 unless given */
      ratio?: number;
    }
);

const srcOf = (work: Work) => ("image" in work ? work.image.src : work.video);
const ratioOf = (work: Work) =>
  "image" in work ? work.image.width / work.image.height : (work.ratio ?? 16 / 9);

// Rows alternate between wide-and-tall and long-and-low: a row is closed once
// its works' proportions add up to its target, so a landscape photo gets a
// row to itself, while portraits and squares are grouped until they fill one.
const ROW_TARGETS = [1.7, 3];

function toRows(works: Work[]) {
  const rows: { items: { work: Work; i: number }[]; sum: number; target: number }[] = [];
  works.forEach((work, i) => {
    let row = rows.at(-1);
    if (!row || row.sum >= row.target) {
      row = { items: [], sum: 0, target: ROW_TARGETS[rows.length % ROW_TARGETS.length] };
      rows.push(row);
    }
    row.items.push({ work, i });
    row.sum += ratioOf(work);
  });
  return rows;
}

export default function WorksGallery({ works }: { works: Work[] }) {
  const lightbox = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const selected = works[index];

  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  const step = (by: number) =>
    transition(() => setIndex((i) => (i + by + works.length) % works.length));

  // The thumbnail and the lightbox photo share one view-transition name, so
  // the photo grows out of its place in the gallery and settles back into it.
  const open = (i: number) => {
    const thumb = thumbs.current[i];
    if (thumb) thumb.style.viewTransitionName = "photo";
    transition(() => {
      if (thumb) thumb.style.viewTransitionName = "";
      setIndex(i);
      lightbox.current?.showModal();
    });
  };

  const close = () => {
    const thumb = thumbs.current[index];
    const clear = () => {
      if (thumb) thumb.style.viewTransitionName = "";
    };
    const closing = transition(() => {
      lightbox.current?.close();
      if (!thumb) return;
      thumb.style.viewTransitionName = "photo";
      // After stepping, the photo on screen may live further down the page.
      thumb.scrollIntoView({ block: "nearest" });
    });
    if (closing) closing.finished.then(clear, clear);
    else clear();
  };

  return (
    <>
      {/* Within a row each work is as wide as its own proportions need for
          all of them to end at the same height. On a phone they simply stack. */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {toRows(works).map((row) => (
          <div key={row.items[0].i} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {row.items.map(({ work, i }) => (
              <figure
                key={srcOf(work)}
                className="work sm:min-w-0 sm:flex-(--ratio)"
                style={{ "--ratio": ratioOf(work) } as React.CSSProperties}
              >
                <button
                  type="button"
                  ref={(el) => {
                    thumbs.current[i] = el;
                  }}
                  onClick={() => open(i)}
                  className="group block w-full cursor-zoom-in overflow-hidden"
                >
                  {"image" in work ? (
                    <Image
                      src={work.image}
                      alt={work.title}
                      placeholder="blur"
                      preload={i === 0}
                      sizes={`(min-width: 640px) ${Math.ceil((100 * ratioOf(work)) / Math.max(row.sum, row.target))}vw, 100vw`}
                      className={THUMB}
                    />
                  ) : (
                    // A film plays silently while the pointer is on it.
                    <video
                      src={work.video}
                      poster={work.poster}
                      aria-label={work.title}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      className={`${THUMB} object-cover`}
                      style={{ aspectRatio: ratioOf(work) }}
                    />
                  )}
                </button>
                <figcaption className="pt-2 text-sm opacity-60">
                  {work.title}
                  {"video" in work && ", film"}
                </figcaption>
              </figure>
            ))}
            {/* A last row that is not full keeps its height instead of blowing up. */}
            {row.sum < row.target && (
              <div aria-hidden className="hidden sm:block" style={{ flex: row.target - row.sum }} />
            )}
          </div>
        ))}
      </div>

      {/* A native modal dialog: Esc closes it and focus stays inside for free. */}
      <dialog
        ref={lightbox}
        aria-label={selected.title}
        className="h-dvh max-h-none w-full max-w-none grid-rows-[minmax(0,1fr)_auto] bg-black text-white open:grid"
        onClick={(e) => {
          if (!(e.target as Element).closest("button, video")) close();
        }}
        // Esc goes through close() too, so the photo still returns to its place.
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        <div className="min-h-0 cursor-zoom-out p-3 pb-0 sm:p-8 sm:pb-0">
          {/* The <img> box is exactly the fitted photo, so the blurred
              placeholder sits right where the photo will appear. */}
          <div className="relative h-full">
            {"image" in selected ? (
              <Image
                key={selected.image.src}
                src={selected.image}
                alt={selected.title}
                placeholder="blur"
                sizes="100vw"
                className={LIGHTBOX}
              />
            ) : (
              <video
                key={selected.video}
                src={selected.video}
                poster={selected.poster}
                aria-label={selected.title}
                controls
                autoPlay
                playsInline
                className={LIGHTBOX}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 px-6 py-5 text-[0.9375rem] leading-none sm:px-10">
          <span className="flex items-center gap-5">
            <button type="button" onClick={() => step(-1)} className={BUTTON}>
              Previous
            </button>
            <span aria-live="polite" className="tabular-nums">
              {index + 1} / {works.length}
            </span>
            <button type="button" onClick={() => step(1)} className={BUTTON}>
              Next
            </button>
          </span>
          <button
            type="button"
            onClick={close}
            className={BUTTON}
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}

const BUTTON = "decoration-1 underline-offset-[6px] hover:underline";
const THUMB =
  "h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none";
const LIGHTBOX = "lightbox-photo absolute inset-0 m-auto h-auto max-h-full w-auto max-w-full";

/** Runs a change as a view transition where the browser has them. */
function transition(update: () => void) {
  if (!document.startViewTransition) return void update();
  return document.startViewTransition(() => flushSync(update));
}
