import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/digital-twin", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "Ziyad focuses on mobile engineering, API integration, and clean architecture.",
    });
  });
});

test("loads styled and interactive on iPhone Safari/WebKit", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Building resilient software with startup-level speed/i,
    }),
  ).toBeVisible();

  await expect(page.locator("main")).toHaveCSS(
    "background-color",
    "rgb(7, 11, 20)",
  );

  const prompt = page.getByRole("button", {
    name: "What are Ziyad's strongest technical skills?",
  });
  await expect(prompt).toBeVisible();
  await prompt.click();
  await expect(
    page.getByText(/Ziyad focuses on mobile engineering/i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Reset chat/i }).click();
  await expect(page.getByText(/Hi, I am Ziyad's Digital Twin/i)).toBeVisible();

  await page
    .getByLabel(/Ask about Ziyad's career/i)
    .fill("What kind of roles is Ziyad looking for?");
  await page.getByRole("button", { name: /Ask Digital Twin/i }).click();

  await expect(
    page.getByText(/Ziyad focuses on mobile engineering/i),
  ).toBeVisible();
});
