import type { Metadata } from "next";
import { Shippori_Mincho_B1 } from "next/font/google";
import Header from "./Header";
import SiteBackground from "@/components/SiteBackground";
import "./globals.css";

// One family, one weight: hierarchy on this site comes from size alone.
const mincho = Shippori_Mincho_B1({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-mincho",
});

export const metadata: Metadata = {
  title: "Rintaro Toda",
  description: "Photo · Retouch · Logo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mincho.variable} h-full antialiased`}>
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
