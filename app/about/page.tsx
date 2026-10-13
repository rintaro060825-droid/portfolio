import Image from "next/image";
import Link from "next/link";
import Sheet from "@/components/Sheet";
import crowd from "@/public/works/photos/20260803-IMG_1215.jpg";

const CRAFTS = [
  { ja: "写真", en: "Photo" },
  { ja: "レタッチ", en: "Retouch" },
  { ja: "ロゴ", en: "Logo" },
];

export default function About() {
  return (
    <Sheet title="About me" className="paper about flex-1">
      <Image
        src={crowd}
        alt="A crowd seen from behind, in black and white"
        placeholder="blur"
        preload
        sizes="(min-width: 48rem) 40vw, 100vw"
        className="about-photo"
      />
      <div className="about-text">
        <p className="statement">
          Rintaro Toda photographs, retouches and designs logos.
        </p>
        <ul className="about-crafts">
          {CRAFTS.map(({ ja, en }) => (
            <li key={en}>
              <span lang="ja">{ja}</span>
              <span>{en}</span>
            </li>
          ))}
        </ul>
        <div className="about-foot">
          <p>
            The sky behind this page is the sky over Tsujido right now. It
            changes with the weather and the hour.
          </p>
          <p className="about-links">
            <Link href="/works">See the works</Link>
            <Link href="/contact">Get in touch</Link>
          </p>
        </div>
      </div>
    </Sheet>
  );
}
