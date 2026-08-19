export type Weather = "rain" | "cloudy" | "clear";
export type TimeOfDay = "dawn" | "day" | "dusk" | "night";
export type Scene = `${Weather}-${TimeOfDay}`;

export const WEATHERS = ["rain", "cloudy", "clear"] as const;
export const TIMES = ["dawn", "day", "dusk", "night"] as const;

export const WEATHER_LABEL: Record<Weather, string> = {
  rain: "雨",
  cloudy: "くもり",
  clear: "はれ",
};

export const TIME_LABEL: Record<TimeOfDay, string> = {
  dawn: "明け方",
  day: "昼",
  dusk: "夕方",
  night: "夜",
};

/** 現在時刻から時間帯を判定 */
export function getTimeOfDay(d: Date = new Date()): TimeOfDay {
  const h = d.getHours();
  if (h >= 4 && h < 8) return "dawn";
  if (h >= 8 && h < 16) return "day";
  if (h >= 16 && h < 19) return "dusk";
  return "night";
}

export function sceneId(w: Weather, t: TimeOfDay): Scene {
  return `${w}-${t}`;
}

export const videoSrc = (s: Scene) => `/videos/${s}.mp4`;
export const posterSrc = (s: Scene) => `/videos/${s}.jpg`;

/**
 * 動画が無い / 読み込めない / 動きを減らす設定のときに使う背景。
 * 動画の平均色に寄せてあるので、動画が来ても違和感なく入れ替わる。
 */
export const SCENE_GRADIENT: Record<Scene, string> = {
  "rain-dawn":   "linear-gradient(180deg, #2b3350 0%, #4a5570 55%, #6b7186 100%)",
  "rain-day":    "linear-gradient(180deg, #6d7784 0%, #8b939c 55%, #a7adb3 100%)",
  "rain-dusk":   "linear-gradient(180deg, #3e3a4a 0%, #6b5a5e 55%, #8f7a6c 100%)",
  "rain-night":  "linear-gradient(180deg, #0d1220 0%, #182236 55%, #26324a 100%)",

  "cloudy-dawn":  "linear-gradient(180deg, #4b4a5c 0%, #8a7f88 50%, #cbb3a4 100%)",
  "cloudy-day":   "linear-gradient(180deg, #9aa4ad 0%, #b8bfc5 55%, #d6dade 100%)",
  "cloudy-dusk":  "linear-gradient(180deg, #4a4356 0%, #7d6570 50%, #b98d78 100%)",
  "cloudy-night": "linear-gradient(180deg, #101319 0%, #1c2130 55%, #2b3040 100%)",

  "clear-dawn":  "linear-gradient(180deg, #2f4a72 0%, #9a7ba0 45%, #f0a978 100%)",
  "clear-day":   "linear-gradient(180deg, #2f7fd1 0%, #74b4e8 55%, #cfe6f7 100%)",
  "clear-dusk":  "linear-gradient(180deg, #1f2f5c 0%, #8a4d78 45%, #f2803f 100%)",
  "clear-night": "linear-gradient(180deg, #05070f 0%, #0d1530 55%, #1b2a4d 100%)",
};
