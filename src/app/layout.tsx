import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ziyad Alhdriti | Software Engineer",
  description:
    "Professional portfolio website for Ziyad Alhdriti, Software Engineering student and mobile application engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script id="scroll-start-top" strategy="beforeInteractive">
          {`
            if ("scrollRestoration" in history) {
              history.scrollRestoration = "manual";
            }
            if (location.hash) {
              history.replaceState(null, "", location.pathname + location.search);
            }
            window.scrollTo(0, 0);
            window.addEventListener("pageshow", function () {
              window.scrollTo(0, 0);
            });
            window.addEventListener("DOMContentLoaded", function () {
              window.scrollTo(0, 0);
            }, { once: true });
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
