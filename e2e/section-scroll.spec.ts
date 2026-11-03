import { expect, test } from "@playwright/test";

test("scrolling at the top does not repeatedly rewrite the document state", async ({
  page,
}) => {
  await page.goto("/ar");
  await page.evaluate(() =>
    document.dispatchEvent(
      new WheelEvent("wheel", { deltaY: -100, bubbles: true }),
    ),
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-input-mode",
    "pointer",
  );
  await page.evaluate(() => {
    const root = document.documentElement;
    root.dataset.inputWrites = "0";
    new MutationObserver((records) => {
      root.dataset.inputWrites = String(
        Number(root.dataset.inputWrites) + records.length,
      );
    }).observe(root, {
      attributes: true,
      attributeFilter: ["data-input-mode"],
    });
  });
  for (let n = 0; n < 8; n++)
    await page.evaluate(() =>
      document.dispatchEvent(
        new WheelEvent("wheel", { deltaY: -120, bubbles: true }),
      ),
    );
  await expect(page.locator("html")).toHaveAttribute("data-input-writes", "0");
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("the glass header floats from the first frame and stays steady on scroll", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of isMobile ? [320, 390] : [320, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}`);
      const header = page.locator(".site-header");
      await expect(page.locator(".hero-art")).toBeVisible();
      const before = (await header.boundingBox())!;
      expect(before.x).toBeGreaterThan(0);
      expect(before.y).toBeGreaterThan(0);
      expect(before.x + before.width).toBeLessThan(width);
      const scene = (await page.locator(".hero-art").boundingBox())!;
      if (width > 900)
        expect(scene.y).toBeGreaterThanOrEqual(before.y + before.height);
      else expect(scene.y).toBe(0);
      expect(scene.x).toBe(0);
      expect(scene.width).toBe(width);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      expect(
        await header.evaluate(
          (el) => getComputedStyle(el, "::after").backdropFilter,
        ),
      ).toContain("blur");
      await page.evaluate(() =>
        window.scrollTo({ top: 360, behavior: "instant" }),
      );
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(360);
      expect(await header.boundingBox()).toEqual(before);
      if (locale === "ar" && width === (isMobile ? 390 : 1440))
        await page.screenshot({
          path: test.info().outputPath("floating-header.png"),
        });
    }
  }
  await page.goto("/ar/projects/h2o-calm");
  await expect(page.locator(".case-nav")).toBeVisible();
  const header = (await page.locator(".site-header").boundingBox())!;
  const navigation = (await page.locator(".case-nav").boundingBox())!;
  expect(navigation.y).toBeGreaterThan(header.y + header.height);
});

test("the scroll cue reaches the project journey without capturing scroll", async ({
  page,
  isMobile,
}) => {
  const scrollBy = async (distance: number) => {
    if (isMobile)
      await page.evaluate(
        (top) => window.scrollBy({ top, behavior: "smooth" }),
        distance,
      );
    else await page.mouse.wheel(0, distance);
  };
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
  if (isMobile)
    await page.locator(".hero-art").tap({ position: { x: 8, y: 8 } });
  else await page.locator(".hero-art").click({ position: { x: 8, y: 8 } });
  await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
  const padding = await page
    .locator("html")
    .evaluate((root) => parseFloat(getComputedStyle(root).scrollPaddingTop));
  const gallery = page.locator("#s4");
  await page
    .getByRole("link", { name: "استكشف المشاريع", exact: true })
    .click();
  await expect
    .poll(async () => Math.abs((await gallery.boundingBox())!.y - padding))
    .toBeLessThan(2);
  const firstCard = page.locator("[data-work-panel]").first();
  await expect(firstCard).toHaveCSS("scroll-snap-align", "none");
  const box = (await gallery.boundingBox())!;
  if (box.height > page.viewportSize()!.height - padding + 100) {
    await scrollBy(100);
    await expect
      .poll(async () => (await gallery.boundingBox())!.y)
      .toBeLessThan(padding - 20);
  }
  await page.keyboard.press("Tab");
  await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
});
