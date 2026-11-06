import { expect, test } from "@playwright/test";

test("the taller sky sits behind the header and the content remains below the scene", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1440, 900],
    [1710, 886],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}`);
      await expect(page.locator(".stack-study-flow")).toHaveAttribute(
        "data-ready",
        "true",
      );
      await page.evaluate(() => document.fonts.ready);
      const art = page.locator(".hero-art");
      await expect(art).toBeVisible();
      const poster = art.locator("img");
      await poster.evaluate((el) => (el as HTMLImageElement).decode());
      await expect(poster).toHaveAttribute(
        "src",
        "/intro-art/hijaz/mecca-motion-poster-v3.webp",
      );
      const scene = (await art.boundingBox())!;
      const header = (await page.locator(".site-header").boundingBox())!;
      const content = (await page
        .locator(".intro-study-details")
        .boundingBox())!;
      expect(scene.y).toBe(0);
      expect(scene.width).toBe(width);
      expect(scene.height).toBeGreaterThanOrEqual(
        width <= 900 ? 300 : height - 281,
      );
      expect(header.y + header.height).toBeLessThan(scene.y + scene.height);
      expect(content.y).toBeGreaterThanOrEqual(scene.y + scene.height - 1);
      await expect(art.locator("video")).toBeHidden();
      expect(content.height).toBeLessThan(401);
      for (const action of await page
        .locator(".intro-study-contact-line > *")
        .all()) {
        const box = (await action.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      await expect(art.locator("video")).not.toHaveAttribute("src");
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("the new video selects the right source and matches the sky poster proportions", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar");
  const video = page.locator(".hero-video");
  await expect(video).toHaveAttribute("data-ready", "true");
  expect(await video.boundingBox()).toEqual(
    await page.locator(".hero-art img").boundingBox(),
  );
  await expect(video).toHaveAttribute(
    "src",
    isMobile ? /v3-mobile.mp4$/ : /motion-v3.mp4$/,
  );
  const ratio = await video.evaluate((el) => {
    const v = el as HTMLVideoElement;
    return v.videoWidth / v.videoHeight;
  });
  expect(Math.abs(ratio - 3962 / 1588)).toBeLessThan(0.02);
});
