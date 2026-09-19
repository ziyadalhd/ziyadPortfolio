import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    // The site negotiates locale from Accept-Language; pin it so tests
    // don't depend on the browser default.
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },
    // Skips the SRS cover intro, which otherwise holds a full-screen overlay
    // over the page for ~4s on every load and stalls every first action.
    contextOptions: {
      reducedMotion: "reduce",
    },
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-webkit",
      use: {
        ...devices["iPhone 14"],
        browserName: "webkit",
      },
    },
  ],
});
