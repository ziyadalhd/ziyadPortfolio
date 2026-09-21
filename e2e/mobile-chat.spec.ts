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
    page.getByRole("heading", { level: 1, name: "Ziyad Jaber Alhdriti" }),
  ).toBeVisible();

  // Proves the stylesheet and the locale layout both landed, without
  // pinning a colour that now depends on the visitor's light/dark theme.
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("[data-rail] a[data-rail-link]")).toHaveCount(8);

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

test("the clause index keeps its controls reachable", async ({ page }) => {
  await page.goto("/en");

  // On a phone the index is a horizontally scrolling strip. The language
  // switch and theme toggle used to live inside that scroller, which put
  // them ~550px off-screen and reachable only by dragging the strip.
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("no viewport");

  for (const control of [
    page.locator("[data-rail-controls] a[hreflang]"),
    page.locator("[data-rail-controls] button"),
  ]) {
    const box = await control.boundingBox();
    if (!box) throw new Error("control has no box");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }

  // The title page is hidden under reduced motion, so it must not take the
  // scroll with it.
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});

test("the live demo cancels the clause indent on a phone", async ({ page }) => {
  await page.goto("/en");

  const viewport = page.viewportSize();
  if (!viewport) throw new Error("no viewport");

  const row = page.locator("[data-clauserow]:has([data-demo])");
  const demo = page.locator("[data-demo]");
  const rowBox = await row.boundingBox();
  const demoBox = await demo.boundingBox();
  if (!rowBox || !demoBox) throw new Error("missing box");

  const indent = demoBox.x - rowBox.x;
  if (viewport.width <= 900) {
    // The chat is a full-width figure here. Held at the text indent it left a
    // 151px compose box next to a 96px-tall textarea.
    expect(indent).toBeLessThanOrEqual(1);
    expect(demoBox.width).toBeGreaterThan(rowBox.width * 0.95);
  } else {
    // On desktop it stays aligned with the prose it belongs to.
    expect(indent).toBeGreaterThan(50);
  }
});
