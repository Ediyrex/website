import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

describe("GET /api/v1/link-preview", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 when url parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/link-preview");
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Bad Request");
    expect(data.message).toContain("Missing url parameter");
  });

  it("blocks private/internal IP addresses (SSRF guard)", async () => {
    const maliciousUrls = [
      "http://localhost:8080/admin",
      "http://127.0.0.1:3000/metrics",
      "http://10.0.0.1/private",
      "http://192.168.1.100/",
      "http://172.16.0.5/",
      "http://169.254.169.254/latest/meta-data/",
      "file:///etc/passwd",
      "ftp://example.com/file",
    ];

    for (const url of maliciousUrls) {
      const req = new NextRequest(`http://localhost:3000/api/v1/link-preview?url=${encodeURIComponent(url)}`);
      const res = await GET(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.message).toBe("Invalid or restricted target URL");
    }
  });

  it("successfully parses OpenGraph meta tags from valid remote response", async () => {
    const sampleHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Studio Title</title>
          <meta property="og:title" content="OpenGraph Studio Title" />
          <meta property="og:description" content="Design and engineering excellence" />
          <meta property="og:image" content="https://example.com/cover.jpg" />
          <meta property="og:site_name" content="Design Co" />
          <link rel="icon" href="/favicon.png" />
        </head>
        <body>Hello world</body>
      </html>
    `;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(sampleHtml, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    );

    const req = new NextRequest("http://localhost:3000/api/v1/link-preview?url=https://example.com/showcase");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("OpenGraph Studio Title");
    expect(data.data.description).toBe("Design and engineering excellence");
    expect(data.data.image).toBe("https://example.com/cover.jpg");
    expect(data.data.siteName).toBe("Design Co");
    expect(data.data.favicon).toBe("https://www.google.com/s2/favicons?domain=example.com&sz=64");
  });
});
