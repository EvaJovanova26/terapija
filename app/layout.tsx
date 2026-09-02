import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/nav/BottomNav";
import Sprites from "@/components/art/Sprites";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-baloo" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Blossom",
  description: "Log the day, grow a garden.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Blossom" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#ffeaf4",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-dvh">
        <Sprites />
        <div className="mx-auto w-full max-w-md px-4 pt-4 pb-32">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
