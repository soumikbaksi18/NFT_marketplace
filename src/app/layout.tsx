import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokeXLM Marketplace",
  description: "A cinematic Pokemon NFT marketplace demo built with Next.js and priced in XLM."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
