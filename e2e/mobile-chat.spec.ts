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

test("the masthead offers a fast path to the twin", async ({ page }) => {
  await page.goto("/en");

  const cta = page.locator("[data-ask-twin]");
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "#s6");

  // Clause 6 sits ~13 screens down; the index is on screen throughout, so it
  // carries the same live marker.
  await expect(page.locator("[data-rail-live]")).toHaveCount(1);
  await expect(
    page.locator('[data-rail-link][href="#s6"] [data-rail-live]'),
  ).toBeAttached();

  await cta.click();
  await expect(page).toHaveURL(/#s6$/);

  const input = page.getByLabel(/Ask about Ziyad's career/i);
  const focused = await input.evaluate((el) => el === document.activeElement);

  if (page.viewportSize()!.width <= 900) {
    // Focusing here would open the keyboard over the panel just jumped to.
    expect(focused).toBe(false);
  } else {
    expect(focused).toBe(true);
  }
});

test("the masthead CTA stays readable while hovered", async ({ page }) => {
  await page.goto("/en");

  const cta = page.locator("[data-ask-twin]");
  await cta.hover();
  // The fill transitions over 160ms. Reading before it lands compares the
  // label against a background that is still transparent, which passes for
  // the wrong reason.
  await page.waitForTimeout(400);

  // The hover rule fills the button with the accent and repaints the label.
  // A colour set inline outranks that rule, which left the label the same
  // accent as its new background: a solid, unreadable block.
  const paint = await cta.evaluate((el) => {
    const s = getComputedStyle(el);
    const dot = el.querySelector("[data-ask-dot]");
    return {
      color: s.color,
      background: s.backgroundColor,
      dot: dot ? getComputedStyle(dot).backgroundColor : null,
    };
  });

  expect(paint.color).not.toBe(paint.background);
  expect(paint.dot).not.toBe(paint.background);
});
