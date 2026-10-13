"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SkyNote from "@/components/SkyNote";

const LINKS = [
  { href: "/works", label: "WORKS" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About me" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`sky-text z-10 flex justify-between gap-x-4 gap-y-3 px-6 py-6 sm:px-10 ${
        isHome
          ? "fixed inset-x-0 top-0 flex-col-reverse items-end sm:flex-row sm:items-baseline"
          : "items-baseline"
      }`}
    >
      {/* On the home page the name is the page itself, so its place goes to the sky. */}
      {isHome ? (
        <SkyNote className="text-right sm:text-left" />
      ) : (
        <Link
          href="/"
          className="whitespace-nowrap leading-none underline-offset-4 hover:underline sm:text-lg"
        >
          Rintaro Toda
        </Link>
      )}
      <nav className="flex gap-4 whitespace-nowrap text-[0.9375rem] leading-none sm:gap-7">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="relative decoration-1 underline-offset-[6px] hover:underline"
          >
            {label}
            {/* One mark for the whole nav, so it slides to the page you open. */}
            {pathname === href && (
              <span
                aria-hidden
                className="nav-mark absolute inset-x-0 -bottom-1.5 h-px bg-current"
              />
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
