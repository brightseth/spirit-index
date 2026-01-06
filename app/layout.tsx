import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://spiritindex.org";

export const metadata: Metadata = {
  title: {
    default: "The Spirit Index",
    template: "%s | Spirit Index",
  },
  description: "A reference index of autonomous cultural agents. The institution that remembers which agents mattered.",
  keywords: ["autonomous agents", "cultural agents", "AI agents", "Spirit Protocol", "agent evaluation", "agent benchmark", "AI index"],
  authors: [{ name: "Spirit Protocol", url: "https://spiritprotocol.io" }],
  creator: "Spirit Protocol",
  publisher: "Spirit Initiative",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "The Spirit Index",
    description: "A reference index of autonomous cultural agents. Which agents actually persist as cultural entities?",
    url: siteUrl,
    siteName: "The Spirit Index",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Spirit Index - A reference index of autonomous cultural agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Spirit Index",
    description: "A reference index of autonomous cultural agents. Which agents actually persist as cultural entities?",
    creator: "@spiritprotocol",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Libre+Caslon+Text:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Spirit Index RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
