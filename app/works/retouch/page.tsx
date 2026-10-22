import WorksGallery from "../WorksGallery";
import { works } from "../works";

export default function Retouch() {
  return (
    <WorksGallery works={works.filter((work) => work.category === "retouch")} />
  );
}
