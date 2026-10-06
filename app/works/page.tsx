import WorksGallery, { type Work } from "./WorksGallery";

const works: Work[] = [
  { title: "Retouch 01", category: "retouch", src: "/works/photos/20260803-20260803-IMG_0245.jpg" },
  { title: "Retouch 02", category: "retouch", src: "/works/photos/20260803-IMG_1215.jpg" },
  { title: "Retouch 03", category: "retouch", src: "/works/photos/20260803-IMG_1337.jpg" },
  { title: "Retouch 04", category: "retouch", src: "/works/photos/20260803-IMG_1363.jpg" },
  { title: "Retouch 05", category: "retouch", src: "/works/photos/20260803-IMG_1377.jpg" },
  { title: "Retouch 06", category: "retouch", src: "/works/photos/20260804-IMG_1487.jpg" },
  { title: "Retouch 07", category: "retouch", src: "/works/photos/20260310-IMG_0338-2.jpg" },
  { title: "Retouch 08", category: "retouch", src: "/works/photos/20260803-IMG_0233.jpg" },
  { title: "Retouch 09", category: "retouch", src: "/works/photos/20260803-IMG_0247.jpg" },
  { title: "Retouch 10", category: "retouch", src: "/works/photos/20260902-IMG_2844.jpg" },
  { title: "Retouch 11", category: "retouch", src: "/works/photos/20261004-IMG_2942.jpg" },
  { title: "Retouch 12", category: "retouch", src: "/works/photos/20261004-IMG_3003.jpg" },
];

export default function Works() {
  return (
    <div className="flex flex-1 flex-col bg-background px-6 py-16 sm:px-16">
      <h1 className="text-2xl font-semibold tracking-tight">Works</h1>
      <WorksGallery works={works} />
    </div>
  );
}
