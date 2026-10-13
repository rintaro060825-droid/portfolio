import Link from "next/link";
import Sheet from "@/components/Sheet";

export default function NotFound() {
  return (
    <Sheet title="Not found">
      <p className="statement">
        This page doesn&rsquo;t exist. Go to the <Link href="/">home page</Link>{" "}
        or see the <Link href="/works">works</Link>.
      </p>
    </Sheet>
  );
}
