"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  /** 表示したい天候。実際の天気が分かるまでは未指定（背景は "clear" で描く） */
  weather?: Weather;
  /** 文字を読みやすくする暗幕を敷くか */
  overlay?: boolean;
};

// 1分ごとに時間帯を見直す
function everyMinute(onTick: () => void) {
  const id = setInterval(onTick, 60_000);
  return () => clearInterval(id);
}

export default function BackgroundVideo({ weather, overlay = true }: Props) {
  // サーバーは閲覧者の時刻を知らないので null。
  // useState で初期化すると、ビルドした時刻の空が HTML に焼き付いたままになる
  const time = useSyncExternalStore<TimeOfDay | null>(
    everyMinute,
    getTimeOfDay,
    () => null,
  );
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);

  // 開発中だけ使う手動切り替え
  const [devWeather, setDevWeather] = useState<Weather | null>(null);
  const [devTime, setDevTime] = useState<TimeOfDay | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  const shownWeather = devWeather ?? weather;
  const scene: Scene = sceneId(shownWeather ?? "clear", devTime ?? time ?? "night");

  // シーンが変わったら読み込み状態をリセット（レンダー中に反映）
  const [prevScene, setPrevScene] = useState(scene);
  if (scene !== prevScene) {
    setPrevScene(scene);
    setReady(false);
    setFailed(false);
  }

  // 空の注記（SkyNote）が CSS から読む。実際の天気が分かるまでは付けない
  useEffect(() => {
    const root = document.documentElement;
    if (shownWeather) root.dataset.weather = shownWeather;
    else delete root.dataset.weather;
  }, [shownWeather]);

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

  const noVideo = failed || !allowMotion;

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-black">
        {/* 常に敷かれる下地。動画が無くても成立する。時刻が分かったらフェードイン */}
        <div
          className={`absolute inset-0 transition-[background,opacity] duration-[1200ms] ${
            time ? "opacity-100" : "opacity-0"
          }`}
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

      {/* 開発中だけ出る空の切り替え。画面の下端に敷く一本の線で、写真のデータ表示のように読む。
          白い文字＝いま出ている空、下線＝手で固定している値（もう一度押すと外れる） */}
      {isDev && (
        <div
          role="group"
          lang="ja"
          aria-label="空の切り替え（開発用）"
          className="sky-line fixed inset-x-0 bottom-0 z-50 box-content flex h-5 items-center justify-end gap-2 bg-black pr-5 pb-[env(safe-area-inset-bottom)] pl-4 text-xs leading-none whitespace-nowrap text-white/60 sm:gap-5 sm:pr-[2.125rem]"
        >
          <p className="hidden pr-1.5 sm:block" title={videoSrc(scene)}>
            <span lang="en" className="text-white">
              {scene}
            </span>
            <span lang="en">.mp4</span>
            <span
              className={`ml-3 ${noVideo ? "" : ready ? "text-white" : "animate-pulse"}`}
            >
              {noVideo ? "動画なし" : ready ? "再生中" : "読込中"}
            </span>
          </p>
          <div className="flex h-full">
            {WEATHERS.map((w) => (
              <button
                key={w}
                aria-pressed={devWeather === w}
                onClick={() => setDevWeather(devWeather === w ? null : w)}
                className={`${DEV_BUTTON} ${shownWeather === w ? "text-white" : ""}`}
              >
                {WEATHER_LABEL[w]}
              </button>
            ))}
          </div>
          <div className="flex h-full">
            {TIMES.map((t) => (
              <button
                key={t}
                aria-pressed={devTime === t}
                onClick={() => setDevTime(devTime === t ? null : t)}
                className={`${DEV_BUTTON} ${(devTime ?? time) === t ? "text-white" : ""}`}
              >
                {TIME_LABEL[t]}
              </button>
            ))}
          </div>
          <button
            aria-pressed={!devWeather && !devTime}
            onClick={() => {
              setDevWeather(null);
              setDevTime(null);
            }}
            className={`${DEV_BUTTON} ${!devWeather && !devTime ? "text-white" : ""}`}
          >
            自動
          </button>
        </div>
      )}
    </>
  );
}

// before: 細い線でも押しやすいよう、当たり判定だけ上に広げる / after: 固定中の印
const DEV_BUTTON =
  "relative h-full px-1 transition-colors hover:text-white focus-visible:-outline-offset-1! sm:px-1.5 before:absolute before:inset-x-0 before:-top-3 before:bottom-0 after:absolute after:inset-x-1 after:bottom-0.5 after:h-px after:bg-white after:opacity-0 after:transition-opacity aria-pressed:after:opacity-100 sm:after:inset-x-1.5";
