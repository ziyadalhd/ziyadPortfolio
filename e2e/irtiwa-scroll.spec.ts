import { expect, test } from "@playwright/test";

test("Irtiwa pours with scrolling and reverses when scrolling back", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ar/projects/h2o-calm");
  const scene = page.locator("#irtiwa");
  const water = scene.locator("[data-cup-water]");
  const stream = scene.locator("[data-pour-stream]");
  await expect(scene).toHaveAttribute("data-pour-progress", "0");

  const scrollToProgress = async (progress: number) => {
    await scene.evaluate((element, value) => {
      const stage = element.querySelector<HTMLElement>(".irtiwa-stage")!;
      const top = element.getBoundingClientRect().top + scrollY;
      scrollTo({
        top:
          top -
          parseFloat(getComputedStyle(stage).top) +
          value * (element.clientHeight - stage.clientHeight),
        behavior: "instant",
      });
    }, progress);
    await expect
      .poll(async () => Number(await scene.getAttribute("data-pour-progress")))
      .toBeCloseTo(progress, 2);
  };
  await scrollToProgress(0);
  await expect(water).toHaveAttribute("data-level", "27");
  await expect(stream).toHaveCSS("opacity", "0");
  await scrollToProgress(0.5);
  await expect(stream).toHaveCSS("opacity", "1");
  expect(Number(await water.getAttribute("data-level"))).toBeLessThan(27);
  await scrollToProgress(1);
  await expect(water).toHaveAttribute("data-level", "7");
  await expect(stream).toHaveCSS("opacity", "0");
  expect(
    await scene
      .locator(".irtiwa-phone")
      .evaluate((element) => Number(getComputedStyle(element).opacity)),
  ).toBeGreaterThan(0.99);
  expect(
    await scene
      .locator(".irtiwa-phone img")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  await scrollToProgress(0);
  await expect(water).toHaveAttribute("data-level", "27");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("reduced motion shows a complete compact scene and returns to all projects", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/projects/h2o-calm`);
    const scene = page.locator("#irtiwa");
    await expect(scene.locator("[data-cup-water]")).toHaveAttribute(
      "data-level",
      "7",
    );
    await expect(scene.locator(".irtiwa-scroll-hint")).toBeHidden();
    expect(
      await scene.evaluate((element) => element.clientHeight <= innerHeight),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator(".case-back").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}#s4$`));
    await expect(page.locator("[data-project]")).toHaveCount(4);
    await expect(page.locator("#irtiwa")).toHaveCount(0);
  }
});
