"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAME = "Rintaro Toda";

const BOTTOM_THRESHOLD = 32;

export default function Hero() {
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
      setRevealed(atBottom);
    };
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      onScroll();
    };
    onResize();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const throwDistance = Math.hypot(viewport.width, viewport.height);

  return (
    <div className="relative min-h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <h1 className="flex flex-wrap justify-center text-4xl font-semibold tracking-tight sm:text-5xl">
          {NAME.split("").map((char, i) => {
            const angle = i * 47;
            const distance = progress * throwDistance;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            const rotate = (i % 2 === 0 ? 1 : -1) * progress * 360;

            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
                }}
              >
                {char === " " ? " " : char}
              </span>
            );
          })}
        </h1>
        <div
          className={`relative flex flex-col items-center transition-opacity duration-700 ${
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
