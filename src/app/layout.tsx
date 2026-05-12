import type { Metadata, Viewport } from "next";

import { ScrollResetOnLoad } from "@/components/ScrollResetOnLoad";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ziyad Alhdriti | Software Engineer",
  description:
    "Professional portfolio website for Ziyad Alhdriti, Software Engineering student and mobile application engineer.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ziyad Alhdriti | Software Engineer",
    description:
      "Mobile-focused software engineering portfolio with a digital twin chat experience.",
    url: "/",
    siteName: "Ziyad Alhdriti Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ziyad Alhdriti | Software Engineer",
    description:
      "Mobile-focused software engineering portfolio with a digital twin chat experience.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ScrollResetOnLoad />
        {children}
      </body>
    </html>
  );
}
