export const THEME_KEY = "ziyad-spec-theme";
export const INPUT_MODE_KEY = "ziyad-input-mode";
export const THEME_COLORS = { light: "#f8f8f5", dark: "#191b19" } as const;

export function syncThemeChrome(theme: "light" | "dark") {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", THEME_COLORS[theme]);
  });
}

/** Uses the existing preference on every document before its first paint. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}")=== "dark"?"dark":"light";document.documentElement.setAttribute("data-theme",t);var i=sessionStorage.getItem("${INPUT_MODE_KEY}");if(i==="keyboard")document.documentElement.setAttribute("data-input-mode",i);document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",t==="dark"?"${THEME_COLORS.dark}":"${THEME_COLORS.light}");});}catch(e){}})();`;
