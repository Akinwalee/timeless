import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageTransition } from "@/components/motion/PageTransition";
import "./globals.css";

const host = localFont({
  src: [
    { path: "../public/fonts/host-grotesk-regular.ttf", weight: "400" },
    { path: "../public/fonts/host-grotesk-medium.ttf", weight: "500" },
  ],
  variable: "--font-host",
  display: "swap",
});

const greatVibes = localFont({
  src: "../public/fonts/great-vibes.ttf",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Timeless — Style Without Limit", template: "%s — Timeless" },
  description:
    "Timeless is an independent Nigerian fashion label built around identity, movement and unrestricted expression.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${host.variable} ${greatVibes.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <PageTransition />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
