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
        url: "/og-image",
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
    images: ["/og-image"],
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

// Organization and Dataset JSON-LD for search engines
function GlobalJsonLd() {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spirit Index",
    alternateName: "The Spirit Index",
    url: "https://spiritindex.org",
    logo: "https://spiritindex.org/icon.png",
    description: "A reference index of autonomous cultural agents. The institution that remembers which agents mattered.",
    sameAs: [
      "https://spiritprotocol.io",
      "https://twitter.com/spiritprotocol",
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "Spirit Protocol",
      url: "https://spiritprotocol.io",
    },
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "The Spirit Index",
    description: "A curated index of autonomous cultural agents evaluated across 7 dimensions: persistence, autonomy, cultural impact, economic reality, governance, technical distinctiveness, and narrative coherence.",
    url: "https://spiritindex.org",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "Spirit Protocol",
      url: "https://spiritprotocol.io",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://spiritindex.org/index.json",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/rss+xml",
        contentUrl: "https://spiritindex.org/feed.xml",
      },
    ],
    temporalCoverage: "1973/..",
    spatialCoverage: "Global",
    keywords: ["autonomous agents", "AI agents", "cultural agents", "agent evaluation", "agent benchmark"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GlobalJsonLd />
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0a0a14" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
