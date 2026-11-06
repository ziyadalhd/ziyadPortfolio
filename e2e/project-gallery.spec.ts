import { expect, test } from "@playwright/test";

test("the gallery follows ordinary scrolling in both locales", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}#s4`);
    await page.mouse.click(2, 200);
    const panels = page.locator("[data-work-panel]");
    await expect(panels).toHaveCount(4);
    await expect(panels.first()).not.toHaveCSS("position", "sticky");
    await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
    await panels.first().evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 115,
        behavior: "instant",
      }),
    );
    await panels
      .first()
      .locator("img")
      .evaluateAll((images) =>
        Promise.all(
          images
            .filter((el) => el.getClientRects().length)
            .map((el) => (el as HTMLImageElement).decode()),
        ),
      );
    await page.screenshot({
      path: test.info().outputPath(`gallery-${locale}.png`),
    });
    const start = await panels.first().evaluate((el) => ({
      top: el.getBoundingClientRect().top,
      scroll: scrollY,
    }));
    await page.evaluate(() =>
      window.scrollBy({ top: 170, behavior: "instant" }),
    );
    await expect
      .poll(async () =>
        panels
          .first()
          .evaluate(
            (el, before) =>
              Math.abs(
                el.getBoundingClientRect().top -
                  before.top +
                  scrollY -
                  before.scroll,
              ),
            start,
          ),
      )
      .toBeLessThan(2);
    await page.evaluate(() =>
      window.scrollBy({ top: -170, behavior: "instant" }),
    );
    await expect
      .poll(async () => (await panels.first().boundingBox())!.y)
      .toBeCloseTo(start.top, 0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(panels.first().locator("a")).toHaveCSS(
      "animation-name",
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});

test("all projects remain reachable at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar#s4");
  for (const card of await page.locator("[data-project]").all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(".identity-link")).toBeVisible();
    await expect(card.locator("h3")).toBeVisible();
    const logos = card.locator(".identity-tools img");
    expect(await logos.count()).toBeGreaterThan(0);
    await expect
      .poll(() =>
        logos.evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    await expect(card.locator(".identity-tools")).toHaveText("");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("image loops move and join without a visible jump or pause button", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}#s4`);
    const card = page.locator('[data-work-panel="h2o-calm"]');
    await card.scrollIntoViewIfNeeded();
    const track = card.locator(".preview-track");
    await expect(track).toHaveCSS("animation-play-state", "running");
    const time = () =>
      track.evaluate((el) => Number(el.getAnimations()[0].currentTime));
    const start = await time();
    await expect.poll(time).toBeGreaterThan(start + 100);
    await expect(card.locator("button")).toHaveCount(0);
    const seam = await track.evaluate((el) => {
      const animation = el.getAnimations()[0];
      animation.pause();
      animation.currentTime = 0;
      const start = el.children[0].getBoundingClientRect().left;
      animation.currentTime = 28000 - 1;
      const end = el.children[1].getBoundingClientRect().left;
      animation.play();
      return Math.abs(start - end);
    });
    expect(seam).toBeLessThan(1);
    await expect(
      card.locator('.identity-tools img[alt="SwiftUI"]'),
    ).toBeVisible();
    await expect(
      card.locator('.identity-tools img[alt="Xcode"]'),
    ).toBeVisible();
    await expect(card.locator("a button")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(track).toHaveCSS("animation-name", "none");
    await expect(card.locator("button")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});
