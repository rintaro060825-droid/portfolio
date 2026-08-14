import WorksGallery from "./WorksGallery";

type Category = "video" | "retouch" | "logo";

type Work = {
  title: string;
  category: Category;
  src: string;
};

const works: Work[] = [
  { title: "Retouch 01", category: "retouch", src: "/works/20260803-20260803-IMG_0245.jpg" },
  { title: "Retouch 02", category: "retouch", src: "/works/20260803-IMG_1215.jpg" },
  { title: "Retouch 03", category: "retouch", src: "/works/20260803-IMG_1337.jpg" },
  { title: "Retouch 04", category: "retouch", src: "/works/20260803-IMG_1363.jpg" },
  { title: "Retouch 05", category: "retouch", src: "/works/20260803-IMG_1377.jpg" },
  { title: "Retouch 06", category: "retouch", src: "/works/20260804-IMG_1487.jpg" },
];

export default function Works() {
  return (
    <div className="flex flex-1 flex-col bg-background px-6 py-16 sm:px-16">
      <h1 className="text-2xl font-semibold tracking-tight">Works</h1>
      <WorksGallery works={works} />
    </div>
  );
}
