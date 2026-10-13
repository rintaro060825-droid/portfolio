"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { type Weather, WEATHERS, WEATHER_LABEL } from "@/lib/scene";
import { WEATHER_EN } from "./SkyNote";

// Milliseconds from first paint. HOLD matches --tx in globals.css: the longest
// the darkness waits for the weather. ARRIVED is when the last entrance behind
// it (the name on the home page) has settled.
const HOLD = 2200;
const ARRIVED = 2800;

/**
 * The first screen of a visit: the site's caption on a dark horizon. When the
 * weather over Tsujido is known the sentence finishes ("辻堂 いま はれ") and
 * the darkness lifts off that very sky. It is in the server's HTML and runs on
 * CSS alone (see .skyload in globals.css); skyKnown() below only lets it go
 * sooner. While it is mounted the page's entrances wait for it.
 */
export default function SkyLoader() {
  const pathname = usePathname();
  const [first] = useState(pathname);
  const [gone, setGone] = useState(false);
  // Opening another page ends the first load, so that page is not held too.
  if (!gone && pathname !== first) setGone(true);

  useEffect(() => {
    const id = setTimeout(() => setGone(true), HOLD + ARRIVED);
    return () => clearTimeout(id);
  }, []);

  if (gone) return null;
  return (
    <div className="skyload sky-text" aria-hidden>
      <p className="skyload-ja" lang="ja">
        辻堂 いま{" "}
        {WEATHERS.map((w) => (
          <span key={w} data-w={w}>
            {WEATHER_LABEL[w]}
          </span>
        ))}
      </p>
      <span className="skyload-horizon" />
      <p className="skyload-en">
        {WEATHERS.map((w) => (
          <span key={w} data-w={w}>
            {WEATHER_EN[w]} over Tsujido right now
          </span>
        ))}
      </p>
    </div>
  );
}

/** Called once the weather request settles, with the weather if it is known. */
export function skyKnown(weather?: Weather) {
  const loader = document.querySelector<HTMLElement>(".skyload");
  if (!loader) return;
  // how long the loader has been on screen: its own animation's clock
  const t = Number(loader.getAnimations()[0]?.currentTime ?? performance.now());
  // "辻堂 いま" is read first, then the word finishes it, then the dark lifts
  const word = Math.max(t, 700);
  const lift = Math.max(word + 600, 1300);
  if (lift > HOLD) return; // too late to say: the stylesheet lets go by itself
  if (weather) setTimeout(() => (loader.dataset.weather = weather), word - t);
  document.documentElement.style.setProperty("--tx", `${lift}ms`);
}
