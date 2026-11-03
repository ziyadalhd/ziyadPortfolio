import { describe, expect, it } from "vitest";

import { getPourFrame } from "./irtiwa-scroll";

describe("Irtiwa scroll sequence", () => {
  it("starts upright and empty, pours over the cup, then settles full", () => {
    const start = getPourFrame(0);
    const pour = getPourFrame(0.5);
    const end = getPourFrame(1);
    expect(start.angle).toBe(0);
    expect(start.fill).toBe(0);
    expect(start.stream).toBe(0);
    expect(pour.angle).toBe(122);
    expect(pour.spoutX).toBe(365);
    expect(pour.stream).toBe(1);
    expect(pour.waterY).toBeLessThan(start.waterY);
    expect(end.fill).toBe(1);
    expect(end.stream).toBe(0);
    expect(end.angle).toBe(0);
    expect(end.reveal).toBe(1);
  });

  it("stays at its end states outside the scene and reverses without history", () => {
    expect(getPourFrame(-1)).toEqual(getPourFrame(0));
    expect(getPourFrame(2)).toEqual(getPourFrame(1));
    const midpoint = getPourFrame(0.5);
    getPourFrame(1);
    expect(getPourFrame(0.5)).toEqual(midpoint);
  });
});
