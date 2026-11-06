import localFont from "next/font/local";

export const arabic = localFont({
  src: [
    {
      path: "./thmanyah/ThmanyahSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./thmanyah/ThmanyahSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./thmanyah/ThmanyahSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
});

export const arabicDisplay = localFont({
  src: "./thmanyah/ThmanyahSerifDisplay-Bold.woff2",
  weight: "700",
  variable: "--font-arabic-display",
  display: "swap",
});

export const arabicText = localFont({
  src: [
    {
      path: "./thmanyah/ThmanyahSerifText-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./thmanyah/ThmanyahSerifText-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-arabic-text",
  display: "swap",
  preload: false,
});
