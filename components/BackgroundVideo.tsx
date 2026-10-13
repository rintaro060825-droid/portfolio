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
  const shownTime = devTime ?? time ?? "night";
  const scene: Scene = sceneId(shownWeather ?? "clear", shownTime);

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

      {/* 開発中だけ出る空の切り替え。空の上に直接置く色の粒で、粒の色＝押すと出る空（天気の粒は昼の色で見せる。夜はどれも暗くて見分けがつかない）。
          輪＝いま出ている空（濃い輪は手で固定中、もう一度押すと外れる）。
          md 以上はヘッダーの中央、それより狭い画面では左端に縦に並ぶ */}
      {isDev && (
        <div
          role="group"
          lang="ja"
          aria-label="空の切り替え（開発用）"
          title={`${videoSrc(scene)} ${noVideo ? "動画なし" : ready ? "再生中" : "読込中"}`}
          className="sky-line sky-text fixed top-1/2 left-0 z-50 flex -translate-y-1/2 flex-col items-center gap-2 text-xs leading-none whitespace-nowrap text-white/70 md:absolute md:top-[1.125rem] md:left-1/2 md:-translate-x-1/2 md:translate-y-0 md:flex-row md:gap-4"
        >
          <div className="flex flex-col md:flex-row">
            {WEATHERS.map((w) => (
              <DevDot
                key={w}
                label={WEATHER_LABEL[w]}
                sky={SCENE_GRADIENT[sceneId(w, "day")]}
                shown={shownWeather === w}
                pinned={devWeather === w}
                onClick={() => setDevWeather(devWeather === w ? null : w)}
              />
            ))}
          </div>
          <div className="flex flex-col md:flex-row">
            {TIMES.map((t) => (
              <DevDot
                key={t}
                label={TIME_LABEL[t]}
                sky={SCENE_GRADIENT[sceneId(shownWeather ?? "clear", t)]}
                shown={shownTime === t}
                pinned={devTime === t}
                onClick={() => setDevTime(devTime === t ? null : t)}
              />
            ))}
          </div>
          <DevDot
            label="自動"
            sky={AUTO_SKY}
            shown={!devWeather && !devTime}
            pinned={!devWeather && !devTime}
            onClick={() => {
              setDevWeather(null);
              setDevTime(null);
            }}
          />
        </div>
      )}
    </>
  );
}

// 自動の粒：一日の空を一周
const AUTO_SKY = "linear-gradient(90deg, #f0a978, #74b4e8, #f2803f, #1b2a4d)";

function DevDot({
  label,
  sky,
  shown,
  pinned,
  onClick,
}: {
  label: string;
  sky: string;
  shown: boolean;
  pinned: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={pinned}
      aria-label={label}
      onClick={onClick}
      className={`group flex items-center gap-1.5 p-1.5 transition-colors hover:text-white ${
        shown ? "text-white" : ""
      }`}
    >
      <span
        className={`block size-4 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3),0_1px_8px_rgb(0_0_0/0.3)] outline-2 outline-offset-2 transition-[outline-color,scale] duration-300 group-hover:scale-110 ${
          pinned ? "outline-white" : shown ? "outline-white/50" : "outline-transparent"
        }`}
        style={{ background: sky }}
      />
      {/* 文字は広い画面だけ。狭いときは粒の色で読む */}
      <span aria-hidden className="hidden xl:inline">
        {label}
      </span>
    </button>
  );
}
