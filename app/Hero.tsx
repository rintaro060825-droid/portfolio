"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAME = "Rintaro Toda";

const BOTTOM_THRESHOLD = 32;

// Fraction of the remaining distance the letters cover each frame.
// Lower = smoother and more lag behind the scroll position.
const SMOOTHING = 0.12;

// Typing intro: delay before the first letter, then time between letters.
const TYPE_DELAY = 400;
const TYPE_INTERVAL = 110;

export default function Hero() {
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState(0);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setTyped(NAME.length));
      return () => clearTimeout(timer);
    }

    const timers: number[] = [];
    for (let i = 1; i <= NAME.length; i++) {
      timers.push(
        window.setTimeout(() => setTyped(i), TYPE_DELAY + i * TYPE_INTERVAL),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let target = 0;
    let current = 0;
    let frame = 0;

    const apply = () => {
      const throwDistance = Math.hypot(window.innerWidth, window.innerHeight);
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = (i * 47 * Math.PI) / 180;
        const distance = current * throwDistance;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const rotate = (i % 2 === 0 ? 1 : -1) * current * 360;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
      });
    };

    const tick = () => {
      current += (target - current) * SMOOTHING;
      if (Math.abs(target - current) < 0.0005) {
        current = target;
        frame = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      apply();
    };

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      target = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setRevealed(
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - BOTTOM_THRESHOLD,
      );
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      onScroll();
      apply();
    };

    onScroll();
    current = target;
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative min-h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <h1 className="flex flex-wrap justify-center text-4xl font-semibold tracking-tight sm:text-5xl">
          {NAME.split("").map((char, i) => (
            <span key={i} className="contents">
              <span
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className={`inline-block will-change-transform ${
                  i < typed ? "" : "invisible"
                }`}
              >
                {char === " " ? " " : char}
              </span>
            </span>
          ))}
        </h1>
        <div
          className={`flex flex-col items-center transition-opacity duration-700 ${
            revealed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Link
            href="/works"
            className="mt-10 inline-flex h-14 w-72 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            View Works
          </Link>
        </div>
      </div>
    </div>
  );
}
