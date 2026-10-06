"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="flex flex-col items-start gap-2 px-6 py-6 text-sm font-medium">
      <nav className="flex gap-6">
        <Link href="/works" className="hover:opacity-70">
          WORKS
        </Link>
        <Link href="/contact" className="hover:opacity-70">
          Contact
        </Link>
        <Link href="/about" className="hover:opacity-70">
          About me
        </Link>
      </nav>
      {!isHome && (
        <Link href="/" className="text-lg tracking-tight hover:opacity-70">
          Rintaro Toda
        </Link>
      )}
    </header>
  );
}
