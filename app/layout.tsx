import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "EinveX - Ethical Investment Screening",
  description:
    "EinveX helps investors identify Sharia-compliant investment opportunities starting with the Casablanca Stock Exchange.",
  icons: {
    icon: [
      { url: "/favicon/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo/einvex-icon.png" },
    ],
    apple: "/logo/einvex-icon.png",
  },
  openGraph: {
    title: "EinveX - Ethical Investment Screening",
    description:
      "EinveX helps investors identify Sharia-compliant investment opportunities starting with the Casablanca Stock Exchange.",
    type: "website",
    images: [
      {
        url: "/og/og-dark.png",
        width: 1200,
        height: 630,
        alt: "EinveX Open Graph image",
      },
    ],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="text-slate-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
