import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KapışKapış — Açık Artırma",
  description: "Türkiye için güvenli ikinci el açık artırma pazaryeri",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/kapiskapis-icon.svg", apple: "/kapiskapis-icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
