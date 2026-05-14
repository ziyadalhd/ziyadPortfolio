import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";

import { ScrollResetOnLoad } from "@/components/ScrollResetOnLoad";

import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

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
  themeColor: "#06080f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable}`}>
      <body>
        <ScrollResetOnLoad />
        {children}
      </body>
    </html>
  );
}
