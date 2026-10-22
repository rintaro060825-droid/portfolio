import WorksGallery from "../WorksGallery";
import { works } from "../works";

export default function Movies() {
  const movies = works.filter((work) => work.category === "video");

  if (movies.length === 0) {
    return <p className="mt-10 text-white/75">Coming soon.</p>;
  }

  return <WorksGallery works={movies} />;
}
