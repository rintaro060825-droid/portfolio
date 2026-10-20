"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BACKGROUNDS, backgroundSrc } from "@/lib/backgrounds";

export default function BackgroundVideo() {
  const pathname = usePathname();
  const bg = BACKGROUNDS[pathname] ?? null;

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);

  // Reset load state when the page changes
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setReady(false);
    setFailed(false);
  }

  // Skip the video on reduced-motion and small screens; the poster still shows
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 768px)");
    const update = () => setAllowMotion(!reduce.matches && !small.matches);
    update();
    reduce.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);

  if (!bg) return null;

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {bg.poster && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundSrc(bg.poster)})` }}
        />
      )}

      {allowMotion && !failed && (
        <video
          key={pathname}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={backgroundSrc(bg.video)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}

      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: bg.dim ?? 0.3 }}
      />
    </div>
  );
}
