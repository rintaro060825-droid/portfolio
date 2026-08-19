import type { Weather } from "@/lib/scene";

// Tsujido Station, Fujisawa, Kanagawa
const LATITUDE = 35.3305;
const LONGITUDE = 139.4489;

function weatherFromCode(code: number): Weather {
  if (code === 0 || code === 1) return "clear";
  if (
    (code >= 51 && code <= 67) ||
    (code >= 71 && code <= 86) ||
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return "rain";
  }
  return "cloudy";
}

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=weather_code&timezone=Asia%2FTokyo`;
    const res = await fetch(url, { next: { revalidate: 600 } });

    if (!res.ok) {
      throw new Error(`Open-Meteo request failed: ${res.status}`);
    }

    const data = await res.json();
    const code: number = data.current?.weather_code;
    const weather = weatherFromCode(code);

    return Response.json({ weather, code, time: data.current?.time });
  } catch {
    return Response.json({ weather: "clear" satisfies Weather, code: null, time: null });
  }
}
