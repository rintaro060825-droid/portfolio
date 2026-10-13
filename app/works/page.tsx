import Sheet from "@/components/Sheet";
import WorksGallery, { type Work } from "./WorksGallery";
// Photos are imported rather than referenced by path so each carries its own
// dimensions (shown uncropped) and a blurred placeholder while it loads.
import img0245 from "@/public/works/photos/20260803-20260803-IMG_0245.jpg";
import img1215 from "@/public/works/photos/20260803-IMG_1215.jpg";
import img1337 from "@/public/works/photos/20260803-IMG_1337.jpg";
import img1363 from "@/public/works/photos/20260803-IMG_1363.jpg";
import img1377 from "@/public/works/photos/20260803-IMG_1377.jpg";
import img1487 from "@/public/works/photos/20260804-IMG_1487.jpg";
import img0338 from "@/public/works/photos/20260310-IMG_0338-2.jpg";
import img0233 from "@/public/works/photos/20260803-IMG_0233.jpg";
import img0247 from "@/public/works/photos/20260803-IMG_0247.jpg";
import img2844 from "@/public/works/photos/20260902-IMG_2844.jpg";
import img2942 from "@/public/works/photos/20261004-IMG_2942.jpg";
import img3003 from "@/public/works/photos/20261004-IMG_3003.jpg";

// Photos live in public/works/photos, films in public/works/movies. A film is
// { title, video: "/works/movies/name.mp4", poster: "/works/movies/name.jpg" },
// plus `ratio` (width / height) when it is not 16:9.
const works: Work[] = [
  { title: "Retouch 01", image: img0245 },
  { title: "Retouch 02", image: img1215 },
  { title: "Retouch 03", image: img1337 },
  { title: "Retouch 04", image: img1363 },
  { title: "Retouch 05", image: img1377 },
  { title: "Retouch 06", image: img1487 },
  { title: "Retouch 07", image: img0338 },
  { title: "Retouch 08", image: img0233 },
  { title: "Retouch 09", image: img0247 },
  { title: "Retouch 10", image: img2844 },
  { title: "Retouch 11", image: img2942 },
  { title: "Retouch 12", image: img3003 },
];

export default function Works() {
  return (
    <Sheet title="Works" className="paper flex-1 p-3 sm:p-4">
      <WorksGallery works={works} />
    </Sheet>
  );
}
