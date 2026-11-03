import { expect, test } from "@playwright/test";

test("the Thmanyah family loads and the contact actions share one design", async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".site-wordmark svg")).toHaveCount(0);
      const styles = await page
        .locator(".contact-button")
        .evaluateAll((elements) =>
          elements.map((el) => {
            const style = getComputedStyle(el);
            return [
              style.borderRadius,
              style.fontFamily,
              style.fontSize,
              style.fontWeight,
              style.minHeight,
              style.padding,
              style.gap,
            ];
          }),
        );
      expect(styles).toHaveLength(4);
      expect(styles[0][0]).toBe("999px");
      expect(styles[0]).toEqual(styles[1]);
      expect(styles[1]).toEqual(styles[2]);
      expect(styles[2]).toEqual(styles[3]);
      if (locale === "ar") {
        await expect(
          page.getByRole("heading", {
            name: "أفهم الأفكار وأبني تجربتها",
            exact: true,
          }),
        ).toBeVisible();
        const families = await page.evaluate(() => ({
          body: getComputedStyle(document.body).fontFamily,
          display: getComputedStyle(document.querySelector("h1")!).fontFamily,
        }));
        expect(families.body).toContain("arabic");
        expect(families.display).toContain("arabicDisplay");
        expect(families.display).not.toBe(families.body);
      }
      for (const theme of ["light", "dark"]) {
        await page.evaluate(
          (value) => (document.documentElement.dataset.theme = value),
          theme,
        );
        const footer = page.locator(".site-footer");
        await footer.scrollIntoViewIfNeeded();
        await expect(footer.locator(".footer-invitation h2")).toBeVisible();
        await expect(footer.locator(".contact-button")).toHaveAttribute(
          "href",
          /wa.me/,
        );
        for (const link of await footer.locator("a").all()) {
          const box = (await link.boundingBox())!;
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(width);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
    }
  }
});

test("the résumé preview and download use the same real PDF", async ({
  page,
}) => {
  await page.goto("/ar");
  const section = page.locator("#resume");
  await section.scrollIntoViewIfNeeded();
  const image = section.locator("img");
  await image.evaluate((el) => (el as HTMLImageElement).decode());
  expect(
    await image.evaluate((el) => {
      const preview = el as HTMLImageElement;
      return preview.naturalWidth >= preview.width;
    }),
  ).toBe(true);
  const download = section.locator("a[download]");
  const pdf = await download.getAttribute("href");
  await expect(section.locator(".resume-paper")).toHaveAttribute("href", pdf!);
  const response = await page.request.get(pdf!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(section.locator(".resume-view")).toHaveAttribute("href", pdf!);
  const popupEvent = page.waitForEvent("popup");
  await section.locator(".resume-view").click();
  const popup = await popupEvent;
  // Native PDF rendering is unavailable in these headless browser builds.
  await popup.close();
  const event = page.waitForEvent("download");
  await download.click();
  const file = await event;
  expect(file.suggestedFilename()).toMatch(/ziyad.*alhdriti.*\.pdf$/i);
  expect(await file.failure()).toBeNull();
});
