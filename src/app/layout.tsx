import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { getBusiness } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const business = getBusiness();

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: { default: business.name, template: `%s | ${business.shortName}` },
  description: business.description,
  openGraph: {
    siteName: business.name,
    type: "website",
    images: [{ url: "/images/hero-loaves.jpg", width: 1536, height: 1020, alt: "Sourdough loaves cooling on a wooden board" }],
  },
  // A fictional demo business should not be indexed as if it were real.
  robots: business.fictional ? { index: false, follow: true } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f6f0e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-crust focus:px-4 focus:py-2 focus:text-flour">
          Skip to content
        </a>
        <Header business={business} />
        <main id="main">{children}</main>
        <Footer business={business} />
        <LocalBusinessJsonLd business={business} />
      </body>
    </html>
  );
}
