import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/\/api\/digital-twin/, async (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        reply:
          "Ziyad focuses on mobile engineering, API integration, and clean architecture.",
      }),
    }),
  );
});

test("the twin opens on demand, replies, resets and returns focus on close", async ({
  page,
}) => {
  await page.goto("/en");
  const opener = page.getByRole("button", {
    name: "My digital twin",
    exact: true,
  });
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await Promise.all([
    dialog
      .getByRole("button", {
        name: "What are Ziyad's strongest technical skills?",
      })
      .click(),
    page.waitForResponse(/\/api\/digital-twin/),
  ]);
  await expect(
    dialog.getByText(/Ziyad focuses on mobile engineering/i),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Reset chat" }).click();
  await expect(
    dialog.getByText(/Hi, I am Ziyad's Digital Twin/i),
  ).toBeVisible();
  await dialog
    .getByLabel("Ask about Ziyad's career")
    .fill("What kind of roles is Ziyad looking for?");
  await Promise.all([
    dialog.getByRole("button", { name: "Send message", exact: true }).click(),
    page.waitForResponse(/\/api\/digital-twin/),
  ]);
  await expect(
    dialog.getByText(/Ziyad focuses on mobile engineering/i),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("header controls, all projects and WhatsApp stay reachable at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}`);
    await expect(page.locator("[data-project]")).toHaveCount(4);
    await expect(page.locator("#irtiwa")).toHaveCount(0);
    const header = page.locator(".site-header");
    for (const control of [
      header.locator(".language-switch"),
      header.locator(".theme-switch"),
      header.locator(".contact-button"),
    ]) {
      await expect(control).toBeVisible();
      const box = await control.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }
    await expect(header.locator(".contact-button")).toHaveAttribute(
      "href",
      "https://wa.me/966569264771",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("theme stays consistent through project, language and return navigation", async ({
  page,
}) => {
  await page.goto("/en");
  await page.locator(".theme-switch").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(25, 27, 25)",
  );
  const homeBackground = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.locator('[data-project="h2o-calm"]').click();
  await expect(page).toHaveURL(/\/en\/projects\/h2o-calm$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe(homeBackground);
  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/ar\/projects\/h2o-calm$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator(".case-back").click();
  await expect(page).toHaveURL(/\/ar#s4$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("saved dark theme applies before application scripts load", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("ziyad-spec-theme", "dark"),
  );
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.goto("/ar", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(25, 27, 25)",
  );
  await expect(page.locator(".language-switch")).toHaveText("");
  await expect(page.locator(".language-switch svg")).toBeVisible();
});
