import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Spirit Index",
  description: "A reference index of autonomous cultural agents. The institution that remembers which agents mattered.",
  keywords: ["autonomous agents", "cultural agents", "AI agents", "Spirit Protocol", "agent evaluation"],
  authors: [{ name: "Spirit Protocol" }],
  openGraph: {
    title: "The Spirit Index",
    description: "A reference index of autonomous cultural agents",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Libre+Caslon+Text:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
