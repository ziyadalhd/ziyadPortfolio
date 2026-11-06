import type { Locale } from "@/i18n/config";

import { waslScreens } from "./wasl-artwork";
import { weddingScreens } from "./wedding-artwork";

/** Original images available for each project's looping homepage preview. */
export function getProjectPreviews(slug: string, locale: Locale) {
  switch (slug) {
    case "h2o-calm":
      return ["01-today", "02-bottle", "03-history", "04-reminders"].map(
        (screen) => ({
          src: `/projects/irtiwa/${screen}-${locale}.png`,
          width: 1320,
          height: 2868,
        }),
      );
    case "bayn":
      return [
        { src: "/projects/bayn-desktop.png", width: 1440, height: 1000 },
        { src: "/projects/bayn-mobile.png", width: 390, height: 844 },
      ];
    case "wasl":
      return waslScreens;
    case "wedding-greetings":
      return [
        weddingScreens[0],
        weddingScreens[1],
        weddingScreens[2],
        weddingScreens[4],
      ];
    default:
      return [];
  }
}
