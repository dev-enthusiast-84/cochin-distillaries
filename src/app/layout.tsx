import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
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
  title: {
    default: "Cochin Distillaries",
    template: "%s · Cochin Distillaries",
  },
  description: "Members portal for Cochin Distillaries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted">
          Please enjoy responsibly. For adults of legal drinking age only.
        </footer>
      </body>
    </html>
  );
}
