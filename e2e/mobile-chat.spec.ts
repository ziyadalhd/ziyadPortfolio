import { expect, test } from "@playwright/test";

// Use JSON (non-streaming) to keep E2E mocks reliable across browsers.
// Streaming behaviour is covered by the component unit tests.
test.beforeEach(async ({ page }) => {
  await page.route(/\/api\/digital-twin/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        reply:
          "Ziyad focuses on mobile engineering, API integration, and clean architecture.",
      }),
    });
  });
});

test("loads styled and interactive on iPhone Safari/WebKit", async ({
  page,
}) => {
  page.on("console", (msg) =>
    console.log(`[PAGE ${msg.type().toUpperCase()}]`, msg.text()),
  );
  page.on("pageerror", (err) => console.error("[PAGE ERROR]", err.message));

  // "/" redirects by Accept-Language; go straight to the English locale.
  await page.goto("/en");

  await expect(
    page.getByRole("heading", {
      name: /Building resilient software with startup-level speed/i,
    }),
  ).toBeVisible();

  await expect(page.locator("main")).toHaveCSS(
    "background-color",
    "rgb(6, 8, 15)",
  );

  const prompt = page.getByRole("button", {
    name: "What are Ziyad's strongest technical skills?",
  });
  await expect(prompt).toBeVisible();
  // Wait for both the click and the API response to complete before asserting.
  await Promise.all([
    prompt.click(),
    page.waitForResponse(/\/api\/digital-twin/),
  ]);
  await expect(
    page.getByText(/Ziyad focuses on mobile engineering/i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Reset chat/i }).click();
  await expect(page.getByText(/Hi, I am Ziyad's Digital Twin/i)).toBeVisible();

  await page
    .getByLabel(/Ask about Ziyad's career/i)
    .fill("What kind of roles is Ziyad looking for?");
  await Promise.all([
    page.getByRole("button", { name: /Send message/i }).click(),
    page.waitForResponse(/\/api\/digital-twin/),
  ]);
  await expect(
    page.getByText(/Ziyad focuses on mobile engineering/i),
  ).toBeVisible();
});
