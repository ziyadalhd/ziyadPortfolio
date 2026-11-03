import { expect, test } from "@playwright/test";

test("the homepage uses the approved opening and four stacked projects", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}`);
    await expect(page.locator(".intro-study h1 span")).toBeVisible();
    await expect(page.locator(".intro-study-signature")).not.toBeEmpty();
    await expect(page.locator(".intro-study-cta")).toHaveAttribute(
      "href",
      /wa.me/,
    );
    await expect(page.locator(".hero-scroll")).toHaveCount(0);
    await expect(page.locator("#s4 .stack-study-card")).toHaveCount(4);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
});

test("removed diagrams stay absent and reduced-motion logos stay still", async ({
  page,
}) => {
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}`);
    await expect(page.locator(".workflow-preview")).toHaveCount(0);
    await expect(page.locator('a[href*="/diagrams/"]')).toHaveCount(0);
    const rails = page.locator(".logo-rail");
    await expect(rails).toHaveCount(2);
    for (const rail of await rails.all()) {
      await rail.scrollIntoViewIfNeeded();
      await expect(rail.locator(".logo-track")).toHaveCSS(
        "animation-name",
        "none",
      );
      await rail
        .locator(".logo-group")
        .first()
        .locator("img")
        .evaluateAll((images) =>
          Promise.all(
            images.map((el) => {
              const image = el as HTMLImageElement;
              image.loading = "eager";
              return image.decode();
            }),
          ),
        );
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
});

test("logo loops join continuously and pause offscreen", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  if (!isMobile) await page.setViewportSize({ width: 2560, height: 900 });
  await page.goto("/ar");
  for (const rail of await page.locator(".logo-rail").all()) {
    await rail.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const track = rail.locator(".logo-track");
    await expect(track).toHaveCSS("animation-play-state", "running");
    await expect
      .poll(() =>
        rail.evaluate(
          (el) =>
            el.querySelector(".logo-group")!.getBoundingClientRect().width >=
            el.clientWidth,
        ),
      )
      .toBe(true);
    const tile = rail.locator(".logo-tile").first();
    const box = (await tile.boundingBox())!;
    expect(Math.abs(box.width - box.height)).toBeLessThan(1);
    await rail.hover();
    await expect(track).toHaveCSS("animation-play-state", "running");
    expect(
      await tile.evaluate(
        (el) => getComputedStyle(el, "::before").animationPlayState,
      ),
    ).toBe("running");
    const seam = await track.evaluate((el) => {
      const animation = el.getAnimations()[0];
      animation.pause();
      animation.currentTime = 0;
      const start = el.children[0].getBoundingClientRect().left;
      animation.currentTime = 44000 - 1;
      const end = el.children[1].getBoundingClientRect().left;
      animation.play();
      return Math.abs(end - start);
    });
    expect(seam).toBeLessThan(1);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect(track).toHaveCSS("animation-play-state", "paused");
  }
});

test("the intro groups contact and AI actions and the footer has standard navigation", async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}`);
      await expect(
        page.locator(".intro-study-contact-line .twin-launcher"),
      ).toHaveCount(1);
      await expect(
        page.locator(".intro-study-identity .intro-study-availability"),
      ).toHaveCount(1);
      await expect(page.locator(".journey-intro .section-kicker")).toHaveCount(
        0,
      );
      await expect(page.locator(".site-wordmark .wordmark-detail")).toHaveCount(
        0,
      );
      await expect(page.locator(".twin-launcher")).toHaveCSS(
        "position",
        "static",
      );
      const footer = page.locator(".site-footer");
      await footer.scrollIntoViewIfNeeded();
      await expect(footer.locator(".footer-navigation a")).toHaveCount(3);
      await expect(footer.locator(".footer-main")).toHaveCSS("display", "grid");
      await expect(footer).toHaveCSS("border-radius", "0px");
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});
