"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image, { type StaticImageData } from "next/image";

type Work = {
  title: string;
  image: StaticImageData;
};

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
      {/* Every third photo runs the full width; the two after it share a row,
          each as wide as its own proportions need to end at the same height. */}
      <ul className="flex flex-wrap gap-3 sm:gap-4">
        {works.map((work, i) => (
          <li
            key={work.image.src}
            className={`work ${
              i % 3 === 0 ? "w-full" : "w-full sm:w-auto sm:min-w-0 sm:flex-(--ratio)"
            }`}
            style={
              { "--ratio": work.image.width / work.image.height } as React.CSSProperties
            }
          >
            <button
              type="button"
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              onClick={() => open(i)}
              className="group block w-full cursor-zoom-in overflow-hidden"
            >
              <Image
                src={work.image}
                alt={work.title}
                placeholder="blur"
                preload={i === 0}
                sizes={i % 3 === 0 ? "100vw" : "(min-width: 640px) 55vw, 100vw"}
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* A native modal dialog: Esc closes it and focus stays inside for free. */}
      <dialog
        ref={lightbox}
        aria-label={selected.title}
        className="h-dvh max-h-none w-full max-w-none grid-rows-[minmax(0,1fr)_auto] bg-black text-white open:grid"
        onClick={(e) => {
          if (!(e.target as Element).closest("button")) close();
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
            <Image
              key={selected.image.src}
              src={selected.image}
              alt={selected.title}
              placeholder="blur"
              sizes="100vw"
              className="lightbox-photo absolute inset-0 m-auto h-auto max-h-full w-auto max-w-full"
            />
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

/** Runs a change as a view transition where the browser has them. */
function transition(update: () => void) {
  if (!document.startViewTransition) return void update();
  return document.startViewTransition(() => flushSync(update));
}
