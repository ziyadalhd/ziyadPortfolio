import { expect, test } from "@playwright/test";

test("the homepage puts project details above images and technologies below them", async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    for (const locale of ["ar", "en"]) {
      await page.goto(`/${locale}`, {
        waitUntil: "domcontentloaded",
      });
      const cards = page.locator(".stack-study-card");
      await expect(cards).toHaveCount(4);
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded();
        const art = (await card.locator(".stack-study-art").boundingBox())!;
        const summary = (await card
          .locator(".stack-study-summary")
          .boundingBox())!;
        const footer = (await card
          .locator(".stack-study-bottom")
          .boundingBox())!;
        expect(summary.y + summary.height).toBeLessThanOrEqual(art.y + 1);
        expect(art.y + art.height).toBeLessThanOrEqual(footer.y + 1);
        await expect(card.locator("h3")).toBeVisible();
        await expect(card.locator(".stack-study-role p")).not.toBeEmpty();
        const link = card.locator(".stack-study-surface");
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute(
          "href",
          new RegExp(`^/${locale}/projects/`),
        );
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("technology overflow becomes an accurate counter and never a second row", async ({
  page,
}) => {
  await page.goto("/ar", { waitUntil: "domcontentloaded" });
  const card = page.locator('[data-stack-project="bayn"]');
  const strip = card.locator(".stack-study-tools");
  for (const width of [1440, 320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await card.scrollIntoViewIfNeeded();
    if (width === 1440) {
      await expect(strip.locator("img")).toHaveCount(6);
      await expect(strip.locator(".stack-study-more")).toHaveCount(0);
    } else {
      const more = strip.locator(".stack-study-more");
      await expect(more).toBeVisible();
      await expect
        .poll(async () => {
          const hidden = (await more.getAttribute("title"))!.split(", ").length;
          return hidden + (await strip.locator("img").count());
        })
        .toBe(6);
      const hidden = (await more.getAttribute("title"))!.split(", ").length;
      await expect(more).toHaveText(
        `+${hidden.toLocaleString("ar-SA-u-nu-arab")}`,
      );
    }
    await expect(strip).toHaveCSS("flex-wrap", "nowrap");
    expect(await strip.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    const rows = await strip
      .locator("li")
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().top),
      );
    expect(Math.max(...rows) - Math.min(...rows)).toBeLessThan(1);
  }
});

test("the incoming project covers the previous one and reverses with native scroll", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({
    width: isMobile ? 320 : 1440,
    height: isMobile ? 568 : 900,
  });
  await page.goto("/ar");
  const flow = page.locator(".stack-study-flow");
  await expect(flow).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => document.fonts.ready);
  const cards = page.locator(".stack-study-card");
  const positions = await cards.evaluateAll((elements) =>
    elements.map((el) => ({
      start: el.getBoundingClientRect().top + scrollY,
      pin: parseFloat(getComputedStyle(el).top),
      height: (el as HTMLElement).offsetHeight,
    })),
  );
  for (let index = 0; index < positions.length - 1; index++) {
    const first = cards.nth(index);
    const next = cards.nth(index + 1);
    const surface = first.locator(".stack-study-surface");
    const scale = () =>
      surface.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    const firstPosition = positions[index].start - positions[index].pin;
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      firstPosition,
    );
    await expect.poll(scale).toBeGreaterThan(0.97);
    const middle =
      positions[index + 1].start -
      positions[index + 1].pin -
      positions[index].height * 0.4;
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      middle,
    );
    await expect.poll(scale).toBeLessThan(0.98);
    await expect(surface).toHaveCSS("opacity", "1");
    await expect(next.locator(".stack-study-surface")).toHaveCSS(
      "opacity",
      "1",
    );
    expect((await next.boundingBox())!.y).toBeLessThan(
      (await first.boundingBox())!.y + positions[index].height,
    );
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      positions[index + 1].start - positions[index + 1].pin,
    );
    const end = (await next.locator(".stack-study-surface").boundingBox())!;
    expect(end.y + end.height).toBeLessThanOrEqual(
      page.viewportSize()!.height - 16,
    );
    await expect(first).toHaveAttribute("data-covered", "true");
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      firstPosition,
    );
    await expect.poll(scale).toBeGreaterThan(0.97);
    await expect(first).toHaveAttribute("data-covered", "false");
  }
  await expect(page.locator("html")).toHaveCSS("scroll-snap-type", "none");
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

test("the screen loop stays moving on hover and pauses behind the incoming project", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar");
  await expect(page.locator(".stack-study-flow")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const first = page.locator(".stack-study-card").first();
  await first.scrollIntoViewIfNeeded();
  const track = first.locator(".stack-study-track");
  await expect(track).toHaveCSS("animation-play-state", "running");
  await first.locator(".stack-study-art").hover();
  const time = () =>
    track.evaluate((el) => Number(el.getAnimations()[0].currentTime));
  const before = await time();
  await expect.poll(time).toBeGreaterThan(before + 100);
  const seam = await track.evaluate((el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    const start = el.children[0].getBoundingClientRect().left;
    animation.currentTime = 28000 - 1;
    const finish = el.children[1].getBoundingClientRect().left;
    animation.play();
    return Math.abs(start - finish);
  });
  expect(seam).toBeLessThan(1);
  await page
    .locator(".stack-study-card")
    .last()
    .evaluate((el) =>
      scrollTo({
        top:
          el.getBoundingClientRect().top +
          scrollY -
          parseFloat(getComputedStyle(el).top),
        behavior: "instant",
      }),
    );
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(first).toHaveCSS("position", "relative");
});

test("keyboard navigation reveals the projects and opens their real detail page", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await expect(page.locator(".stack-study-flow")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const links = page.locator(".stack-study-surface");
  await expect(links.first()).toBeVisible();
  await links.first().focus();
  await expect(links.first()).toBeFocused();
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(links.nth(1)).toBeFocused();
  for (const card of await page.locator(".stack-study-card").all())
    await expect(card).toHaveCSS("position", "relative");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects\/bayn$/);
});

test("the project title has room for Arabic descenders and stays unfiltered", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ar");
    await page.evaluate(() => document.fonts.ready);
    const title = page.locator("#stack-study-title");
    await title.scrollIntoViewIfNeeded();
    await expect(title).toHaveCSS("filter", "none");
    await expect(title).toHaveCSS("opacity", "1");
    const metrics = await title.evaluate((el) => {
      const style = getComputedStyle(el);
      const canvas = document.createElement("canvas").getContext("2d")!;
      canvas.font = style.font;
      const ink = canvas.measureText(el.textContent!);
      return {
        padding: parseFloat(style.paddingBottom),
        extra: ink.actualBoundingBoxDescent - ink.fontBoundingBoxDescent,
        overflow: el.scrollWidth > el.clientWidth,
        leading: parseFloat(style.lineHeight),
        size: parseFloat(style.fontSize),
      };
    });
    expect(metrics.padding).toBeGreaterThanOrEqual(metrics.extra);
    expect(metrics.leading).toBeGreaterThanOrEqual(metrics.size * 1.49);
    expect(metrics.overflow).toBe(false);
  }
});

test("the project heading stays on one line and reveals word by word", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar");
  await page.evaluate(() => document.fonts.ready);
  const heading = page.locator(".stack-study-heading");
  const geometry = await heading.evaluate((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    height: el.getBoundingClientRect().height,
  }));
  const lead = heading.locator(".stack-title-word").first();
  const follow = heading.locator(".stack-title-word").last();
  const opacity = (element: typeof lead) =>
    element.evaluate((el) => Number(getComputedStyle(el).opacity));
  const scroll = async (progress: number) =>
    page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      geometry.top - 900 + geometry.height * progress,
    );
  await scroll(0.3);
  await expect.poll(() => opacity(lead)).toBeGreaterThan(0.5);
  await expect.poll(() => opacity(follow)).toBeCloseTo(0.18, 2);
  await scroll(1);
  await expect.poll(() => opacity(follow)).toBeGreaterThan(0.99);
  await scroll(0.3);
  await expect.poll(() => opacity(follow)).toBeCloseTo(0.18, 2);
});

test("the Arabic project title keeps every word on one line on phones", async ({
  page,
}) => {
  await page.goto("/ar");
  await page.evaluate(() => document.fonts.ready);
  await expect(
    page.getByRole("heading", {
      name: "مشاريع بنيتها أو شاركت فيها",
      exact: true,
    }),
  ).toHaveCount(1);
  const words = page.locator(".stack-title-word");
  await expect(words).toHaveCount(5);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const lines = await words.evaluateAll((items) =>
      items.map((el) => el.getBoundingClientRect().top),
    );
    expect(Math.max(...lines) - Math.min(...lines)).toBeLessThan(1);
    expect(
      await page
        .locator("#stack-study-title")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  }
});
