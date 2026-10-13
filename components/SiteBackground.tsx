"use client";

import { useEffect, useState } from "react";
import type { Weather } from "@/lib/scene";
import BackgroundVideo from "./BackgroundVideo";
import SkyLoader, { skyKnown } from "./SkyLoader";

export default function SiteBackground() {
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/weather")
      .then((res) => res.json())
      // code が null のときは取得失敗時の仮の値なので、実際の天気としては扱わない
      .then((data: { weather?: Weather; code?: number | null }) =>
        data.code != null ? data.weather : undefined,
      )
      .catch(() => undefined)
      .then((known) => {
        if (cancelled) return;
        if (known) setWeather(known);
        skyKnown(known);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SkyLoader />
      <BackgroundVideo weather={weather} />
    </>
  );
}
