# Background movies

Drop background clips here, then turn them on in `lib/backgrounds.ts`.

| Page        | Video file      | Poster (optional, first frame) |
| ----------- | --------------- | ------------------------------ |
| `/`         | `home.mp4`      | `home.jpg`                     |
| `/works`    | `works.mp4`     | `works.jpg`                    |
| `/about`    | `about.mp4`     | `about.jpg`                    |
| `/contact`  | `contact.mp4`   | `contact.jpg`                  |
| `/basement` | `basement.mp4`  | `basement.jpg`                 |

You can use any file name — just match it in `lib/backgrounds.ts`.

## Export tips

- MP4 (H.264), no audio track (it always plays muted), 10–20 s seamless loop
- 1920×1080 or smaller, aim for under ~8 MB per clip
- Poster JPG shows instantly while the video loads, and on phones /
  reduced-motion where the video is skipped

```sh
ffmpeg -i input.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart home.mp4
ffmpeg -i home.mp4 -frames:v 1 -q:v 3 home.jpg
```
