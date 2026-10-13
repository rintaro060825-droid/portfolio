import { type Weather, WEATHERS, WEATHER_LABEL } from "@/lib/scene";

export const WEATHER_EN: Record<Weather, string> = {
  rain: "Rain",
  cloudy: "Clouds",
  clear: "Clear skies",
};

/**
 * Caption for the sky behind the page: the weather over Tsujido right now.
 * All three lines are rendered; globals.css shows the one matching the
 * `data-weather` that BackgroundVideo sets on <html>, and none until it is known.
 */
export default function SkyNote({ className = "" }: { className?: string }) {
  return (
    <p className={`sky-note sky-text text-sm leading-snug ${className}`}>
      {WEATHERS.map((w) => (
        <span key={w} data-weather={w}>
          <span lang="ja" className="block text-[0.9375rem]">
            辻堂 いま {WEATHER_LABEL[w]}
          </span>
          <span className="block opacity-80">
            {WEATHER_EN[w]} over Tsujido right now
          </span>
        </span>
      ))}
    </p>
  );
}
