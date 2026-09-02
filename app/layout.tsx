import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/nav/BottomNav";

export const metadata: Metadata = {
  title: "Blossom",
  description: "Log the day, grow a garden.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Blossom" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <div className="mx-auto w-full max-w-md px-4 pt-4 pb-28">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
