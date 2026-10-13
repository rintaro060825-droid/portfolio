"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import sparks from "@/public/works/20260803-IMG_1363.jpg";

const NAME = "Rintaro Toda";

// Scroll progress at which the link becomes reachable; matches .hero-cta in globals.css.
const REVEAL_AT = 0.62;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // The burst is driven from CSS by --p, so scrolling never re-renders React.
  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;

    let shown = 0;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const range = hero.offsetHeight - window.innerHeight;
      const goal = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      // Glide toward the scroll position instead of jumping with each wheel
      // step; the 90ms time constant is the knob for how much it trails.
      shown += (goal - shown) * (1 - Math.exp(-(now - last) / 90));
      if (Math.abs(goal - shown) < 0.0005) shown = goal;
      last = now;
      hero.style.setProperty("--p", shown.toFixed(4));
      hero.toggleAttribute("data-revealed", shown > REVEAL_AT);
      frame = shown === goal ? 0 : requestAnimationFrame(tick);
    };
    const update = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main ref={ref} className="hero relative">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div aria-hidden className="hero-sparks absolute inset-0">
          {/* object-cover on a tall screen needs more than the viewport's width */}
          <Image
            src={sparks}
            alt=""
            fill
            sizes="max(100vw, 178vh)"
            className="object-cover"
          />
        </div>

        <h1
          aria-label={NAME}
          className="hero-name relative sm:flex sm:gap-[0.24em]"
        >
          {[...NAME.matchAll(/\S+/g)].map((word) => (
            <span
              key={word.index}
              aria-hidden
              className="block whitespace-nowrap"
            >
              {[...word[0]].map((char, c) => {
                const i = word.index + c;
                // -1 at the word's first letter, 1 at its last: how far, and
                // which way, the letter drifts as the word breathes out.
                const half = (word[0].length - 1) / 2;
                const offset = half ? (c - half) / half : 0;
                return (
                  <span
                    key={i}
                    className="hero-letter"
                    style={
                      {
                        "--i": i,
                        "--o": offset.toFixed(3),
                        // The outer letters go first, the middle lingers.
                        "--d": ((1 - Math.abs(offset)) * 0.06).toFixed(3),
                        // No two letters rise quite the same distance.
                        "--lift": (0.85 + ((i * 7) % 5) * 0.075).toFixed(3),
                      } as React.CSSProperties
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
        <p className="hero-fade hero-rise sky-text relative mt-5 text-lg sm:mt-7 sm:text-xl">
          Photo, retouch, logo
        </p>

        <div className="hero-cta absolute inset-0 grid place-items-center">
          <Link
            href="/works"
            className="sky-text text-[clamp(2rem,5vw,3.5rem)] leading-none underline decoration-1 underline-offset-[0.18em] hover:decoration-2"
          >
            View Works
          </Link>
        </div>

        {/* Says what to do and does it: one press plays the whole burst. */}
        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
          }
          className="hero-fade hero-rise hero-cue sky-text absolute top-[calc(100svh-6.5rem)] flex flex-col items-center gap-3 px-4 text-sm"
        >
          Scroll
          <span aria-hidden className="hero-cue-line" />
        </button>
      </div>
    </main>
  );
}
