import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StudioProvider } from "@/context/StudioContext";
import { DottedSurface } from "@/components/ui/dotted-surface";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kryto Studio | Crafting Digital Excellence",
  description: "High-end Dev & Edit Studio providing Custom Web Development, App Development, and High-End Video Editing.",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#030303] text-foreground relative">
        {/* Global WebGL 3D dynamic ripples dotted background layer */}
        <DottedSurface className="size-full opacity-60" />
        
        <StudioProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full flex flex-col relative z-10">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </StudioProvider>
      </body>
    </html>
  );
}
