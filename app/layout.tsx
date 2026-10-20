import type { Metadata } from "next";
import Header from "./Header";
import BackgroundVideo from "@/components/BackgroundVideo";
import { ADOBE_KIT_ID, ADOBE_FONT_FAMILY, adobeFontEnabled } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rintaro Toda",
  description: "Photo · Retouch · Logo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={
        adobeFontEnabled
          ? ({ "--font-adobe": `"${ADOBE_FONT_FAMILY}"` } as React.CSSProperties)
          : undefined
      }
    >
      {adobeFontEnabled && (
        <head>
          <link
            rel="stylesheet"
            href={`https://use.typekit.net/${ADOBE_KIT_ID}.css`}
          />
        </head>
      )}
      <body className="min-h-full flex flex-col">
        <BackgroundVideo />
        <Header />
        {children}
      </body>
    </html>
  );
}
