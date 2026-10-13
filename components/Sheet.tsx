import { ViewTransition } from "react";
import SkyNote from "./SkyNote";

/**
 * An inner page: a quiet title on the sky, the content on a piece of paper
 * below it. Both are top-level <ViewTransition>s (the <main> around them is in
 * the layout), which is what lets them enter and leave on their own.
 */
export default function Sheet({
  title,
  className = "paper flex-1 px-6 py-10 sm:px-12 sm:py-14",
  children,
}: {
  title: string;
  /** The paper itself; pages that need another shape (works, contact) pass their own. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Between pages the old title lifts away and the new one rises in. */}
      <ViewTransition enter="title-in" exit="title-out" default="none">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 px-6 pt-10 pb-6 sm:px-10 sm:pt-16 sm:pb-8">
          <h1 className="sheet-title sky-text text-[clamp(2.25rem,5.5vw,4rem)] leading-none tracking-[-0.02em]">
            {title}
          </h1>
          <SkyNote className="sky-note-held sm:text-right" />
        </div>
      </ViewTransition>
      {/* One piece of paper for the whole site: it slides up from under the sky,
          reshapes between inner pages while its content changes, and slides away. */}
      <ViewTransition name="sheet" share="sheet" enter="sheet-in" exit="sheet-out" default="none">
        <div className={`sheet-paper ${className}`}>{children}</div>
      </ViewTransition>
    </>
  );
}
