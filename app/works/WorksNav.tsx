"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BRANCHES = [
  { href: "/works", label: "ALL" },
  { href: "/works/retouch", label: "RETOUCH" },
  { href: "/works/movies", label: "MOVIES" },
];

export default function WorksNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 text-xl">
      {BRANCHES.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "underline underline-offset-4"
                : "text-white/60 hover:text-foreground"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
