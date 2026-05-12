"use client";

import { useEffect } from "react";

export function ScrollResetOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const resetScroll = () => window.scrollTo(0, 0);
    window.addEventListener("pageshow", resetScroll);

    return () => window.removeEventListener("pageshow", resetScroll);
  }, []);

  return null;
}
