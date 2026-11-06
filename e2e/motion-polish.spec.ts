import { expect, test } from "@playwright/test";

test("the hero video autoplays, loops, pauses offscreen and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar");
  const video = page.locator(".hero-video");
  await expect(video).toHaveAttribute("data-ready", "true");
  expect(
    await video.evaluate((el) => {
      const player = el as HTMLVideoElement;
      return (
        player.muted && player.loop && player.playsInline && !player.paused
      );
    }),
  ).toBe(true);
  await expect
    .poll(() => video.evaluate((el) => (el as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0.1);
  await video.evaluate((el) => {
    (el as HTMLVideoElement).currentTime = 9.8;
  });
  await expect
    .poll(() => video.evaluate((el) => (el as HTMLVideoElement).currentTime))
    .toBeLessThan(2);
  await page.evaluate(() =>
    window.scrollTo({ top: innerHeight + 100, behavior: "instant" }),
  );
  await expect
    .poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused))
    .toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused))
    .toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toBeHidden();
  await expect
    .poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused))
    .toBe(true);
  await page.reload();
  await expect(video).not.toHaveAttribute("src");
  await expect(page.locator(".hero-art img")).toHaveAttribute(
    "src",
    "/intro-art/hijaz/mecca-motion-poster-v3.webp",
  );
});

test("the dialog stays centered, prevents background scrolling and returns focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar");
  const opener = page.getByRole("button", {
    name: "توأمي الرقمي",
    exact: true,
  });
  const dialog = page.getByRole("dialog");
  await opener.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  const box = (await dialog.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(12);
  await page.screenshot({ path: test.info().outputPath("dialog.png") });
  await page
    .getByRole("button", { name: "إغلاق المحادثة", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  await opener.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("keyboard opening skips motion and Escape keeps its focus target", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const opener = page.getByRole("button", {
    name: "My digital twin",
    exact: true,
  });
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-input-mode",
    "keyboard",
  );
  await expect(page.getByRole("dialog")).toHaveCSS("transition-duration", "0s");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
  const project = page.locator('[data-project="h2o-calm"]');
  await project.scrollIntoViewIfNeeded();
  await expect(project).toBeVisible();
  await project.focus();
  await expect(project).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects\/h2o-calm$/);
  await page.waitForLoadState("load");
  await expect(page.locator("html")).toHaveAttribute(
    "data-input-mode",
    "keyboard",
  );
  await expect(page.locator(".site-header")).toHaveCSS("position", "sticky");
  const back = page.locator(".case-back");
  await expect(back).toBeVisible();
  await back.focus();
  await expect(back).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en#s4$/);
  await expect(page.locator(".hero-title")).toHaveCSS("animation-name", "none");
});

test("the browser chrome follows the chosen theme through reload", async ({
  page,
}) => {
  await page.goto("/ar");
  await page.locator(".theme-switch").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const themeColors = page.locator('meta[name="theme-color"]');
  await expect
    .poll(() =>
      themeColors.evaluateAll((metas) =>
        metas.every((m) => m.getAttribute("content") === "#191b19"),
      ),
    )
    .toBe(true);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      themeColors.evaluateAll((metas) =>
        metas.every((m) => m.getAttribute("content") === "#191b19"),
      ),
    )
    .toBe(true);
});

test("reduced motion keeps project covers still and mobile controls reachable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ar");
  const project = page.locator('[data-project="h2o-calm"]');
  const track = project.locator(".preview-track");
  await project.hover();
  await expect(track).toHaveCSS("animation-name", "none");
  await page.setViewportSize({ width: 320, height: 568 });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}`);
    const theme = (await page.locator(".theme-switch").boundingBox())!;
    expect(theme.width).toBeGreaterThanOrEqual(44);
    expect(theme.height).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const bounds = await page
      .locator(".hero-title > span, .hero-title > strong")
      .evaluateAll((lines) =>
        lines.map((line) => {
          const range = document.createRange();
          range.selectNodeContents(line);
          const rect = range.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        }),
      );
    for (const rect of bounds) {
      expect(rect.left).toBeGreaterThanOrEqual(-1);
      expect(rect.right).toBeLessThanOrEqual(321);
    }
    const sceneClearTitle = await page.evaluate(() => {
      const scene = document
        .querySelector(".hero-art")!
        .getBoundingClientRect();
      const title = document
        .querySelector(".hero-title")!
        .getBoundingClientRect();
      return (
        scene.top <= title.top &&
        scene.bottom >= title.bottom &&
        scene.left >= -1 &&
        scene.right <= innerWidth + 1
      );
    });
    expect(sceneClearTitle).toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`home-${locale}-320.png`),
    });
  }
});

test("the introduction adapts between desktop bands and the mobile overlay", async ({
  page,
  isMobile,
}) => {
  const screens = isMobile
    ? [
        [320, 568],
        [390, 844],
      ]
    : [
        [1280, 720],
        [1710, 886],
        [1920, 1080],
        [1920, 900],
      ];
  for (const [width, height] of screens) {
    await page.setViewportSize({ width, height });
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await expect(page.locator(".hero-art")).toBeVisible();
      await expect(page.locator(".site-header")).toHaveCSS(
        "position",
        "sticky",
      );
      const scene = (await page.locator(".hero-art").boundingBox())!;
      const header = (await page.locator(".site-header").boundingBox())!;
      const hero = (await page.locator(".home-hero").boundingBox())!;
      const gallery = (await page.locator(".work-exhibition").boundingBox())!;
      if (width > 900) {
        expect(scene.y).toBeGreaterThanOrEqual(header.y + header.height);
        expect(scene.height).toBeGreaterThanOrEqual(260);
      } else {
        expect(scene.y).toBe(0);
        expect(scene.height).toBeGreaterThanOrEqual(height - 1);
      }
      expect(header.y).toBeGreaterThan(0);
      expect(hero.height).toBeGreaterThanOrEqual(height - 1);
      expect(hero.height).toBeLessThanOrEqual(height + 1);
      expect(gallery.y).toBeGreaterThanOrEqual(hero.y + hero.height - 1);
      const content = (await page.locator(".hero-content").boundingBox())!;
      expect(Math.abs(content.x + content.width / 2 - width / 2)).toBeLessThan(
        1,
      );
      expect(content.y).toBeGreaterThanOrEqual(scene.y);
      if (width > 900)
        expect(content.y).toBeGreaterThanOrEqual(scene.y + scene.height);
      else
        expect(content.y + content.height).toBeLessThanOrEqual(
          scene.y + scene.height,
        );
      await expect(page.locator(".hero-art img")).toHaveCSS(
        "object-fit",
        "cover",
      );
      for (const action of await page.locator(".hero-actions a").all()) {
        const box = (await action.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        expect(box.y + box.height).toBeLessThanOrEqual(hero.y + hero.height);
      }
      const facts = (await page.locator(".hero-bottom").boundingBox())!;
      expect(facts.y + facts.height).toBeLessThanOrEqual(hero.y + hero.height);
      await expect(page.locator(".hero-greeting .availability")).toBeVisible();
      const caption = page.locator(".hero-caption");
      await expect(caption).not.toBeEmpty();
      await expect(caption).toHaveCSS("z-index", "1");
      const captionBox = (await caption.boundingBox())!;
      const launcher = (await page.locator(".twin-launcher").boundingBox())!;
      expect(facts.y + facts.height).toBeLessThanOrEqual(launcher.y);
      if (width > 900) {
        expect(captionBox.y).toBeGreaterThan(scene.y);
        expect(captionBox.y + captionBox.height).toBeLessThan(
          scene.y + scene.height,
        );
      } else
        expect(captionBox.y).toBeGreaterThanOrEqual(facts.y + facts.height);
      const captionOverlapsLauncher =
        captionBox.x < launcher.x + launcher.width &&
        captionBox.x + captionBox.width > launcher.x &&
        captionBox.y < launcher.y + launcher.height &&
        captionBox.y + captionBox.height > launcher.y;
      expect(captionOverlapsLauncher).toBe(false);
      await page.screenshot({
        path: test.info().outputPath(`intro-${locale}-${width}-${height}.png`),
      });
    }
  }
});
