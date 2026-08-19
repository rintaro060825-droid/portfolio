"use client";

import { useEffect, useState } from "react";
import type { Weather } from "@/lib/scene";
import BackgroundVideo from "./BackgroundVideo";

export default function SiteBackground() {
  const [weather, setWeather] = useState<Weather>("clear");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/weather")
      .then((res) => res.json())
      .then((data: { weather?: Weather }) => {
        if (!cancelled && data.weather) setWeather(data.weather);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return <BackgroundVideo weather={weather} />;
}
