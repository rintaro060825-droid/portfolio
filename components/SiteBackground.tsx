"use client";

import { useEffect, useState } from "react";
import type { Weather } from "@/lib/scene";
import BackgroundVideo from "./BackgroundVideo";

export default function SiteBackground() {
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/weather")
      .then((res) => res.json())
      .then((data: { weather?: Weather; code?: number | null }) => {
        // code が null のときは取得失敗時の仮の値なので、実際の天気としては扱わない
        if (!cancelled && data.weather && data.code != null) {
          setWeather(data.weather);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return <BackgroundVideo weather={weather} />;
}
