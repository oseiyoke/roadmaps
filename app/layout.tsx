import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Roadmap Visualizer - Transform Notion Roadmaps into Beautiful Visualizations",
  description: "Connect your Notion databases and watch your project roadmaps come to life with interactive, real-time visualizations that keep everyone aligned.",
  keywords: "roadmap, visualization, notion, project management, timeline, milestone tracker",
  authors: [{ name: "Roadmap Visualizer Team" }],
  openGraph: {
    title: "Roadmap Visualizer",
    description: "Transform your Notion roadmaps into beautiful visualizations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
