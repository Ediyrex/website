import { describe, expect, it } from "vitest";
import { sanitizePlainText } from "../sanitize";

describe("sanitizePlainText", () => {
  it("strips HTML tags and script elements while preserving inner text", () => {
    const dirty = '  <script>alert("xss")</script>Hello <b>Ediyrex</b>!  ';
    expect(sanitizePlainText(dirty)).toBe('alert("xss")Hello Ediyrex!');
  });

  it("removes control bytes while preserving newlines and tabs", () => {
    const dirty = "Line 1\u0000\u0007\nLine 2\tTabbed";
    expect(sanitizePlainText(dirty)).toBe("Line 1\nLine 2\tTabbed");
  });

  it("handles empty or whitespace-only input", () => {
    expect(sanitizePlainText("   \n  ")).toBe("");
  });
});

