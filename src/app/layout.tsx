import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RadioProvider } from "@/context/RadioContext";
import TopNav from "@/components/TopNav";
import MiniPlayer from "@/components/MiniPlayer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radio Nostalgia Digital | La Sintonía del Recuerdo",
  description:
    "Radio Nostalgia Digital - Sintonía del recuerdo. Transmitiendo los mejores éxitos de décadas pasadas desde Mendoza, Argentina.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Radio Nostalgia",
  },
};

export const viewport: Viewport = {
  themeColor: "#06709F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-zinc-100">
        <RadioProvider>
          <TopNav />
          <div className="flex-1 flex flex-col">{children}</div>
          <MiniPlayer />
        </RadioProvider>
      </body>
    </html>
  );
}
