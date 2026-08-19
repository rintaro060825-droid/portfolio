"use client";

import { useEffect, useState } from "react";
import {
  type Weather,
  type TimeOfDay,
  type Scene,
  WEATHERS,
  TIMES,
  WEATHER_LABEL,
  TIME_LABEL,
  getTimeOfDay,
  sceneId,
  videoSrc,
  posterSrc,
  SCENE_GRADIENT,
} from "@/lib/scene";

type Props = {
  /** 表示したい天候。未指定なら "clear" */
  weather?: Weather;
  /** 文字を読みやすくする暗幕を敷くか */
  overlay?: boolean;
};

export default function BackgroundVideo({
  weather = "clear",
  overlay = true,
}: Props) {
  const [time, setTime] = useState<TimeOfDay>(() => getTimeOfDay());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);

  // 開発中だけ使う手動切り替え
  const [devWeather, setDevWeather] = useState<Weather | null>(null);
  const [devTime, setDevTime] = useState<TimeOfDay | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  const scene: Scene = sceneId(devWeather ?? weather, devTime ?? time);

  // シーンが変わったら読み込み状態をリセット（レンダー中に反映）
  const [prevScene, setPrevScene] = useState(scene);
  if (scene !== prevScene) {
    setPrevScene(scene);
    setReady(false);
    setFailed(false);
  }

  // 1分ごとに時間帯を見直す
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeOfDay()), 60_000);
    return () => clearInterval(id);
  }, []);

  // 動きを減らす設定 / 小さい画面では動画を再生しない
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

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        {/* 常に敷かれる下地。動画が無くても成立する */}
        <div
          className="absolute inset-0 transition-[background] duration-[1200ms]"
          style={{ background: SCENE_GRADIENT[scene] }}
        />

        {allowMotion && !failed && (
          <video
            key={scene}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            src={videoSrc(scene)}
            poster={posterSrc(scene)}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        )}

        {overlay && <div className="absolute inset-0 bg-black/25" />}
      </div>

      {isDev && (
        <div className="fixed bottom-3 left-3 z-50 flex flex-col gap-1 rounded-lg bg-black/70 p-2 text-[11px] text-white backdrop-blur">
          <div className="flex gap-1">
            {WEATHERS.map((w) => (
              <button
                key={w}
                onClick={() => setDevWeather(w)}
                className={`rounded px-2 py-1 ${
                  (devWeather ?? weather) === w ? "bg-white text-black" : "bg-white/20"
                }`}
              >
                {WEATHER_LABEL[w]}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setDevTime(t)}
                className={`rounded px-2 py-1 ${
                  (devTime ?? time) === t ? "bg-white text-black" : "bg-white/20"
                }`}
              >
                {TIME_LABEL[t]}
              </button>
            ))}
          </div>
          <div className="opacity-60">
            {scene}
            {failed ? " · 動画なし" : ready ? " · 再生中" : " · 読込中"}
          </div>
          <button
            onClick={() => {
              setDevWeather(null);
              setDevTime(null);
            }}
            className="rounded bg-white/20 px-2 py-1"
          >
            自動に戻す
          </button>
        </div>
      )}
    </>
  );
}
