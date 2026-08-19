# Background videos

`components/BackgroundVideo.tsx` picks a scene from weather × time of day.
Place files here with **this exact naming**, `.mp4` + `.jpg` poster per scene:

```
public/videos/
  rain-dawn.mp4     rain-dawn.jpg
  rain-day.mp4      rain-day.jpg
  rain-dusk.mp4     rain-dusk.jpg
  rain-night.mp4    rain-night.jpg
  cloudy-dawn.mp4   cloudy-dawn.jpg
  cloudy-day.mp4    cloudy-day.jpg
  cloudy-dusk.mp4   cloudy-dusk.jpg
  cloudy-night.mp4  cloudy-night.jpg
  clear-dawn.mp4    clear-dawn.jpg
  clear-day.mp4     clear-day.jpg
  clear-dusk.mp4    clear-dusk.jpg
  clear-night.mp4   clear-night.jpg
```

No video needed to see it working — each scene has a CSS gradient
fallback (`SCENE_GRADIENT` in `lib/scene.ts`) that upgrades to video the
moment a matching file appears here.

Time-of-day bands (`getTimeOfDay` in `lib/scene.ts`, browser local time):

- `dawn` — 04:00–07:59
- `day` — 08:00–15:59
- `dusk` — 16:00–18:59
- `night` — 19:00–03:59

Weather comes live from `app/api/weather/route.ts` (Open-Meteo, no API
key, cached 10 minutes, coordinates set to Tsujido Station).

### Export spec

- 1920×1080, 8–12s seamless loop, H.264 mp4, no audio, 24–30fps, faststart
- Target ≤3MB per file (~36MB total for all 12)

```
ffmpeg -i source.mp4 -t 10 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart clear-day.mp4
ffmpeg -i clear-day.mp4 -vframes 1 -q:v 6 clear-day.jpg
```

Never commit Adobe project files (`.prproj` / `.aep`) here — exported
mp4/jpg only.
