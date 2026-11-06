import { expect, test } from "@playwright/test";

test("mobile header gives the name and controls room and removes the scene caption", async ({
  page,
}) => {
  for (const width of [320, 390, 412]) {
    for (const locale of ["ar", "en"]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${locale}`);
      await expect(page.locator(".stack-study-flow")).toHaveAttribute(
        "data-ready",
        "true",
      );
      await page.evaluate(() => document.fonts.ready);
      const header = (await page.locator(".site-header").boundingBox())!;
      expect(header.x).toBeGreaterThanOrEqual(16);
      expect(width - header.x - header.width).toBeGreaterThanOrEqual(16);
      for (const control of [
        ".site-wordmark",
        ".site-tools .contact-button",
        ".theme-switch",
        ".language-switch",
      ]) {
        const rect = (await page.locator(control).boundingBox())!;
        expect(rect.y - header.y).toBeGreaterThanOrEqual(10);
        expect(
          header.y + header.height - rect.y - rect.height,
        ).toBeGreaterThanOrEqual(10);
        expect(rect.x - header.x).toBeGreaterThanOrEqual(10);
        expect(
          header.x + header.width - rect.x - rect.width,
        ).toBeGreaterThanOrEqual(10);
      }
      const name = page.locator(".wordmark-name");
      expect((await name.textContent())!.replace(/ـ/g, "").trim()).toBe(
        locale === "ar" ? "زياد" : "Ziyad",
      );
      expect(
        await name.evaluate(
          (el) =>
            parseFloat(getComputedStyle(el).lineHeight) /
            parseFloat(getComputedStyle(el).fontSize),
        ),
      ).toBeGreaterThanOrEqual(1.5);
      await expect(page.locator(".hero-caption")).toHaveCount(0);
      await expect(
        page.getByRole("button", {
          name: locale === "ar" ? "توأمي الرقمي" : "My digital twin",
          exact: true,
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("the card title, image, technologies and blank padding all open the project", async ({
  page,
}) => {
  for (const selector of [
    "h3",
    ".stack-study-art",
    ".stack-study-tools",
    ".stack-study-summary",
  ]) {
    await page.goto("/ar");
    const card = page.locator('[data-stack-project="h2o-calm"]');
    await expect(card).toHaveAttribute("href", "/ar/projects/h2o-calm");
    await expect(card.locator("a")).toHaveCount(0);
    await card.locator(selector).click({ position: { x: 12, y: 12 } });
    await expect(page).toHaveURL(/\/ar\/projects\/h2o-calm$/);
  }
});
