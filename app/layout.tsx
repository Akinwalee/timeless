import type { Metadata } from "next";
import localFont from "next/font/local";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { Measurement } from "@/components/site/Measurement";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageTransition } from "@/components/motion/PageTransition";
import { BagProvider } from "@/components/bag/BagProvider";
import { getGlobalSettings } from "@/sanity/lib/fetch";
import "./globals.css";

const host = localFont({
  src: [
    { path: "../public/fonts/host-grotesk-regular.ttf", weight: "400" },
    { path: "../public/fonts/host-grotesk-medium.ttf", weight: "500" },
  ],
  variable: "--font-host",
  display: "swap",
});

export const metadata: Metadata = {
  ...pageMetadata("Timeless — Style Without Limit", "Timeless is an independent Nigerian fashion label built around identity, movement and unrestricted expression.", "/"),
  metadataBase: new URL(getSiteUrl()),
  title: { default: "Timeless — Style Without Limit", template: "%s — Timeless" },
  description:
    "Timeless is an independent Nigerian fashion label built around identity, movement and unrestricted expression.",
  robots: process.env.VERCEL_ENV === "preview" || process.env.SITE_INDEXABLE === "false" ? { index: false, follow: false } : undefined,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getGlobalSettings();
  const whatsappNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <html lang="en" className={host.variable} suppressHydrationWarning>
      <body>
        <Measurement />
        <BagProvider whatsappNumber={whatsappNumber}>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader links={settings.navigation} socialLinks={settings.socialLinks} contactEmail={settings.contactEmail} />
          <PageTransition />
          {children}
          <SiteFooter settings={settings} />
        </BagProvider>
      </body>
    </html>
  );
}
