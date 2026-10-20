import WorksGallery, { type Work } from "./WorksGallery";

const works: Work[] = [
  { title: "Retouch x00001", category: "retouch", src: "/works/photos/20260803-20260803-IMG_0245.jpg" },
  { title: "Retouch x00002", category: "retouch", src: "/works/photos/20260803-IMG_1215.jpg" },
  { title: "Retouch x00003", category: "retouch", src: "/works/photos/20260803-IMG_1337.jpg" },
  { title: "Retouch x00004", category: "retouch", src: "/works/photos/20260803-IMG_1363.jpg" },
  { title: "Retouch x00005", category: "retouch", src: "/works/photos/20260803-IMG_1377.jpg" },
  { title: "Retouch x00006", category: "retouch", src: "/works/photos/20260804-IMG_1487.jpg" },
  { title: "Retouch x00007", category: "retouch", src: "/works/photos/20260310-IMG_0338-2.jpg" },
  { title: "Retouch x00008", category: "retouch", src: "/works/photos/20260803-IMG_0233.jpg" },
  { title: "Retouch x00009", category: "retouch", src: "/works/photos/20260803-IMG_0247.jpg" },
  { title: "Retouch x0000A", category: "retouch", src: "/works/photos/20260902-IMG_2844.jpg" },
  { title: "Retouch x0000B", category: "retouch", src: "/works/photos/20261004-IMG_2942.jpg" },
  { title: "Retouch x0000C", category: "retouch", src: "/works/photos/20261004-IMG_3003.jpg" },
  { title: "Retouch x0000D", category: "retouch", src: "/works/photos/1009612_0005.JPG" },
  { title: "Retouch x0000E", category: "retouch", src: "/works/photos/1009612_0016.jpg" },
  { title: "Retouch x0000F", category: "retouch", src: "/works/photos/1009612_0023.jpg" },
  { title: "Retouch x00010", category: "retouch", src: "/works/photos/1009612_0026.jpg" },
  { title: "Retouch x00011", category: "retouch", src: "/works/photos/1009612_0035.jpg" },
  { title: "Retouch x00012", category: "retouch", src: "/works/photos/1009612_0036.jpg" },
  { title: "Retouch x00013", category: "retouch", src: "/works/photos/1009612_0037.jpg" },
];

export default function Works() {
  return (
    <div className="flex flex-1 flex-col px-6 py-16 sm:px-16">
      <h1 className="text-4xl font-semibold tracking-tight">Works</h1>
      <WorksGallery works={works} />
    </div>
  );
}
