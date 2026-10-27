import type { Work } from "./WorksGallery";

// Every piece of work. Retouched photos live in public/works/photos and use
// category "retouch"; movies live in public/works/movies and use "video".
// Titles are generated: each work is numbered in hexadecimal, counting up
// within its category in the order listed (Retouch x00001, x00002, ...).
const entries: Omit<Work, "title">[] = [
  { category: "retouch", src: "/works/photos/20260803-20260803-IMG_0245.jpg" },
  { category: "retouch", src: "/works/photos/20260803-IMG_1215.jpg" },
  { category: "retouch", src: "/works/photos/20260804-IMG_1487.jpg" },
  { category: "retouch", src: "/works/photos/20260803-IMG_1363.jpg" },
  { category: "retouch", src: "/works/photos/20260803-IMG_1377.jpg" },
  { category: "retouch", src: "/works/photos/20260803-IMG_1337.jpg" },
  { category: "retouch", src: "/works/photos/20260310-IMG_0338-2.jpg" },
  { category: "retouch", src: "/works/photos/20260803-IMG_0233.jpg" },
  { category: "retouch", src: "/works/photos/20260803-IMG_0247.jpg" },
  { category: "retouch", src: "/works/photos/20260902-IMG_2844.jpg" },
  { category: "retouch", src: "/works/photos/20261004-IMG_2942.jpg" },
  { category: "retouch", src: "/works/photos/20261004-IMG_3003.jpg" },
  { category: "retouch", src: "/works/photos/1009612_0005.JPG" },
  { category: "retouch", src: "/works/photos/1009612_0016.jpg" },
  { category: "retouch", src: "/works/photos/1009612_0023.jpg" },
  { category: "retouch", src: "/works/photos/1009612_0026.jpg" },
  { category: "retouch", src: "/works/photos/1009612_0035.jpg" },
  { category: "retouch", src: "/works/photos/1009612_0036.jpg" },
  { category: "retouch", src: "/works/photos/1009612_0037.jpg" },
];

const labels: Record<Work["category"], string> = {
  retouch: "Retouch",
  video: "Movie",
  logo: "Logo",
};

const counts: Partial<Record<Work["category"], number>> = {};

export const works: Work[] = entries.map((entry) => {
  const n = (counts[entry.category] ?? 0) + 1;
  counts[entry.category] = n;
  const hex = n.toString(16).toUpperCase().padStart(5, "0");
  return { ...entry, title: `${labels[entry.category]} x${hex}` };
});
