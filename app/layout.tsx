import type { Metadata } from "next";
import Header from "./Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rintaro Toda",
  description: "Photo · Retouch · Logo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
