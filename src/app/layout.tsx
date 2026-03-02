import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViteRun - The Marathoner's Mission Control",
  description: "A high-performance web dashboard designed by a marathoner, for marathoners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased bg-brand-midnight text-white min-h-screen flex`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
          <Header />
          <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
