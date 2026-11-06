import { expect, test } from "@playwright/test";

for (const locale of ["ar", "en"] as const) {
  test(`project overview opens a separate case study in ${locale}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}`);
    const overview = page.locator("#s4");
    await expect(overview.locator("[data-project]")).toHaveCount(4);
    const cards = await overview
      .locator("[data-project]")
      .evaluateAll((items) =>
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom, left: rect.left };
        }),
      );
    for (let index = 1; index < cards.length; index++) {
      expect(cards[index].top).toBeGreaterThan(cards[index - 1].bottom);
    }
    await expect(overview.locator(".case-engineering")).toHaveCount(0);
    await expect(overview.locator(".identity-tools")).toHaveCount(4);
    await overview.screenshot({ path: test.info().outputPath("gallery.png") });
    await overview.locator('a[href$="/projects/bayn"]').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects/bayn$`));
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr",
    );
    await page.locator(".case-engineering > summary").click();
    await expect(page.locator("#process")).toBeVisible();
    await expect(page.locator("main")).toContainText("pgTAP");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/${locale}/projects/bayn$`),
    );
    const otherLocale = locale === "ar" ? "en" : "ar";
    await page.locator(`.language-switch[hreflang="${otherLocale}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${otherLocale}/projects/bayn$`));
    await page.locator(".case-back").click();
    await expect(page).toHaveURL(new RegExp(`/${otherLocale}#s4$`));
    expect(errors).toEqual([]);
  });

  test(`all case studies load directly without horizontal overflow in ${locale}`, async ({
    page,
  }) => {
    for (const slug of ["bayn", "wedding-greetings", "wasl", "h2o-calm"]) {
      const response = await page.goto(`/${locale}/projects/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    const response = await page.goto(`/${locale}/projects/does-not-exist`);
    expect(response?.status()).toBe(404);
  });
}

test("the homepage stays within a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("the original project cover connects the gallery and project at slow motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    window.addEventListener("pagereveal", async (event) => {
      const transition = (
        event as Event & { viewTransition?: { ready: Promise<void> } }
      ).viewTransition;
      if (!transition) return;
      await transition.ready;
      const animations = document.getAnimations();
      document.documentElement.dataset.transitionParts = animations
        .map(
          (animation) =>
            (animation.effect as KeyframeEffect | null)?.pseudoElement ?? "",
        )
        .join("|");
      animations.forEach((animation) => animation.updatePlaybackRate(0.1));
    });
  });
  await page.goto("/en");
  test.skip(
    !(await page.evaluate(
      () =>
        "onpagereveal" in window &&
        CSS.supports("view-transition-name", "cover-h2o-calm"),
    )),
    "Native cross-document transitions are not supported in this browser.",
  );
  const project = page.locator('[data-project="h2o-calm"]');
  await expect(project.locator(".project-cover")).toHaveCSS(
    "view-transition-name",
    "cover-h2o-calm",
  );
  await project.click();
  await expect(page).toHaveURL(/\/en\/projects\/h2o-calm$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-transition-parts",
    /cover-h2o-calm/,
  );
  await page.screenshot({
    path: test.info().outputPath("transition-slow-motion.png"),
  });
  await page.evaluate(() =>
    document.getAnimations().forEach((animation) => animation.finish()),
  );
  await expect(
    page.getByRole("heading", { name: "Irtiwa", exact: true, level: 1 }),
  ).toBeVisible();
});

for (const locale of ["ar", "en"] as const) {
  test(`Wasl shows original screens and its completed date in ${locale}`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(`/${locale}#s4`);
    const card = page.locator('[data-work-panel="wasl"]');
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(".preview-track img")).toHaveCount(12);
    await expect(card).toContainText("2025 - 2026");
    await card.locator("a").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/projects/wasl$`));
    await expect(page.locator(".case-nav")).toContainText(
      locale === "ar" ? "مكتمل" : "Completed",
    );
    await expect(page.locator(".case-kind")).toContainText("2025 - 2026");
    await expect(page.locator(".wasl-route")).toHaveCount(0);
    const screens = page.locator(".wasl-screen-gallery img");
    await expect(screens).toHaveCount(6);
    const rows = await screens.evaluateAll((images) =>
      images.map((image) => image.getBoundingClientRect().top),
    );
    if (isMobile) expect(rows[2]).toBeGreaterThan(rows[0] + 20);
    else expect(Math.abs(rows[2] - rows[0])).toBeLessThan(2);
    await expect(
      page.locator(".case-hero-cover .wasl-cover-screens"),
    ).toHaveCSS("display", "flex");
    for (const screen of await screens.all()) {
      await screen.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          screen.evaluate(
            (el) =>
              (el as HTMLImageElement).complete &&
              (el as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.locator(".wasl-screen-gallery").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: test.info().outputPath(`wasl-screens-${locale}.png`),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

for (const locale of ["ar", "en"] as const) {
  test(`wedding greetings uses real local captures in ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}#s4`);
    const card = page.locator('[data-work-panel="wedding-greetings"]');
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(".preview-track img")).toHaveCount(8);
    await card.locator("a").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/projects/wedding-greetings$`),
    );
    await expect(page.locator(".greeting-sheets")).toHaveCount(0);
    await expect(
      page.locator(".case-hero-cover .greeting-cover-screens"),
    ).toHaveCSS("display", "flex");
    const screens = page.locator(".wedding-screen-gallery img");
    await expect(screens).toHaveCount(6);
    for (const image of await screens.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (el) =>
              (el as HTMLImageElement).complete &&
              (el as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto(`/${locale}/projects/wasl`);
    const logo = page.locator(".case-icon");
    await expect(logo).toBeVisible();
    await expect
      .poll(() =>
        logo.evaluate(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  });
}
