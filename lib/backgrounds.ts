// Background movie per page. Files live in public/backgrounds/.
// Set `video` (and optionally `poster`) to turn a page's background on;
// pages left out, or set to null, keep the plain background.

export type Background = {
  /** e.g. "home.mp4" */
  video: string;
  /** e.g. "home.jpg" — shown while loading and when video is skipped */
  poster?: string;
  /** Darken the video so text stays readable. 0–1, default 0.3 */
  dim?: number;
};

export const BACKGROUNDS: Record<string, Background | null> = {
  "/": null, // { video: "home.mp4", poster: "home.jpg" }
  "/works": null, // { video: "works.mp4", poster: "works.jpg" }
  "/about": null, // { video: "about.mp4", poster: "about.jpg" }
  "/contact": null, // { video: "contact.mp4", poster: "contact.jpg" }
  "/basement": null, // { video: "basement.mp4", poster: "basement.jpg" }
};

export const backgroundSrc = (file: string) => `/backgrounds/${file}`;
