import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/nav/BottomNav";
import Sprites from "@/components/art/Sprites";
import ThemeClock from "@/components/theme/ThemeClock";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-fraunces" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "grow",
  description: "Small daily things, a life you can see.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "grow" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f6efe4",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeClock />
        <Sprites />
        <div className="mx-auto w-full max-w-md px-4 pt-4 pb-32">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
