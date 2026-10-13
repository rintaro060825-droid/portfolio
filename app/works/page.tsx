import type { StaticImageData } from "next/image";
import Sheet from "@/components/Sheet";
import WorksGallery from "./WorksGallery";
// Imported rather than referenced by path so each photo carries its own
// dimensions (shown uncropped) and a blurred placeholder while it loads.
import img0245 from "@/public/works/20260803-20260803-IMG_0245.jpg";
import img1215 from "@/public/works/20260803-IMG_1215.jpg";
import img1337 from "@/public/works/20260803-IMG_1337.jpg";
import img1363 from "@/public/works/20260803-IMG_1363.jpg";
import img1377 from "@/public/works/20260803-IMG_1377.jpg";
import img1487 from "@/public/works/20260804-IMG_1487.jpg";

type Category = "video" | "retouch" | "logo";

type Work = {
  title: string;
  category: Category;
  image: StaticImageData;
};

const works: Work[] = [
  { title: "Retouch 01", category: "retouch", image: img0245 },
  { title: "Retouch 02", category: "retouch", image: img1215 },
  { title: "Retouch 03", category: "retouch", image: img1337 },
  { title: "Retouch 04", category: "retouch", image: img1363 },
  { title: "Retouch 05", category: "retouch", image: img1377 },
  { title: "Retouch 06", category: "retouch", image: img1487 },
];

export default function Works() {
  return (
    <Sheet title="Works" className="paper flex-1 p-3 sm:p-4">
      <WorksGallery works={works} />
    </Sheet>
  );
}
