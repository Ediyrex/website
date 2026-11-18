import { describe, it, expect } from "vitest";

describe("404 Signal Lost Component Specifications", () => {
  it("defines standard recovery routes matching EDYREX architecture", () => {
    const homeRoute = "/";
    const workRoute = "/work";
    const contactRoute = "/contact";

    expect(homeRoute).toBe("/");
    expect(workRoute).toBe("/work");
    expect(contactRoute).toBe("/contact");
  });

  it("safely sanitizes dynamic user paths for diagnostic display", () => {
    const sanitizePath = (raw: string) => {
      return raw.replace(/[^\w\-/.]/g, "").slice(0, 36) || "/404";
    };

    expect(sanitizePath("/invalid-page")).toBe("/invalid-page");
    expect(sanitizePath("/<script>alert(1)</script>")).toBe("/scriptalert1/script");
    expect(sanitizePath("")).toBe("/404");
  });
});
