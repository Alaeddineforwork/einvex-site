import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import OnboardingModal from "./onboarding-modal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "EinveX — Sharia-conscious investing on the Casablanca Stock Exchange",
  description:
    "EinveX is a trading-style portfolio + screener for the Casablanca Stock Exchange, with built-in Sharia compliance, dividend purification and Zakat tracking.",
  icons: {
    icon: [
      { url: "/favicon/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo/einvex-icon.png" },
    ],
    apple: "/logo/einvex-icon.png",
  },
  openGraph: {
    title: "EinveX — Sharia-conscious investing",
    description:
      "Trading-style screener and portfolio for the Casablanca Stock Exchange, with Sharia compliance, purification and Zakat built in.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#22c55e",
          colorBackground: "#12181f",
          colorInputBackground: "#0d1218",
          colorInputText: "#e6e8eb",
          colorText: "#e6e8eb",
          colorTextSecondary: "#9ba3ad",
          colorNeutral: "#9ba3ad",
          colorDanger: "#ef4444",
          colorSuccess: "#22c55e",
          fontFamily: "var(--font-inter), sans-serif",
          borderRadius: "8px",
        },
        elements: {
          card: {
            background: "#12181f",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "none",
          },
          headerTitle: {
            color: "#e6e8eb",
            fontFamily: "var(--font-space-grotesk), sans-serif",
          },
          formButtonPrimary: {
            background: "#22c55e",
            color: "#04130a",
            "&:hover": { background: "#16a34a" },
          },
        },
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased`}
      >
        <body>
          <SiteHeader />
          {children}
          <OnboardingModal />
          <SiteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
