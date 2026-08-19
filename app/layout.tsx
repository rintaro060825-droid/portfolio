import type { Metadata } from "next";
import Header from "./Header";
import SiteBackground from "@/components/SiteBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rintaro Toda",
  description: "Photo · Retouch · Logo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteBackground />
        <div className="relative z-0 flex min-h-full flex-1 flex-col">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
