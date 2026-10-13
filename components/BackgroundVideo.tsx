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

      {/* 開発中だけ出る空の切り替え。画面右端に縦書きで置き、ページの上には載せない */}
      {isDev && (
        <div
          role="group"
          lang="ja"
          aria-label="空の切り替え（開発用）"
          className="fixed top-1/2 right-1 z-50 flex w-7 -translate-y-1/2 flex-col items-center gap-2.5 rounded-full bg-black/35 py-4 text-xs leading-none tracking-[0.14em] text-white/55 backdrop-blur-md"
        >
          {/* 動画の状態：塗り＝再生中、点滅＝読込中、輪＝動画なし */}
          <span
            title={`${scene} · ${noVideo ? "動画なし" : ready ? "再生中" : "読込中"}`}
            className={`size-1.5 rounded-full border border-white ${
              noVideo ? "" : ready ? "bg-white" : "animate-pulse bg-white"
            }`}
          />
          {WEATHERS.map((w) => (
            <button
              key={w}
              aria-pressed={shownWeather === w}
              onClick={() => setDevWeather(w)}
              className={DEV_BUTTON}
            >
              {WEATHER_LABEL[w]}
            </button>
          ))}
          <span className="h-px w-3 bg-white/30" />
          {TIMES.map((t) => (
            <button
              key={t}
              aria-pressed={(devTime ?? time) === t}
              onClick={() => setDevTime(t)}
              className={DEV_BUTTON}
            >
              {TIME_LABEL[t]}
            </button>
          ))}
          <span className="h-px w-3 bg-white/30" />
          <button
            aria-pressed={!devWeather && !devTime}
            onClick={() => {
              setDevWeather(null);
              setDevTime(null);
            }}
            className={DEV_BUTTON}
          >
            自動
          </button>
        </div>
      )}
    </>
  );
}

const DEV_BUTTON =
  "[writing-mode:vertical-rl] decoration-1 underline-offset-4 transition-colors hover:text-white aria-pressed:text-white aria-pressed:underline";
