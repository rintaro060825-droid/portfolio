"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/works", label: "WORKS" },
  { href: "/contact", label: "CONTACT" },
  { href: "/about", label: "ABOUT ME" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 px-6 py-6 text-xl font-medium">
      <nav className="flex gap-6">
        {NAV.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`hover:opacity-70 ${active ? "text-yellow-300" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      {!isHome && (
        <Link href="/" className="ml-auto text-xl tracking-tight hover:opacity-70">
          Rintaro Toda
        </Link>
      )}
    </header>
  );
}
