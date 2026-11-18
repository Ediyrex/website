import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/server/errors";

interface LinkMetadata {
  url: string;
  hostname: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
}

// In-memory cache for fast repeated previews
const previewCache = new Map<string, { data: LinkMetadata; cachedAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function isSafeUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    // Block localhost and private IP addresses (SSRF protection)
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      /^169\.254\./.test(host)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function extractMeta(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match && match[1] ? match[1].trim() : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url")?.trim();

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing url parameter" },
        { status: 400 }
      );
    }

    if (!isSafeUrl(targetUrl)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid or restricted target URL" },
        { status: 400 }
      );
    }

    // Check cache
    const cached = previewCache.get(targetUrl);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, data: cached.data });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    let html = "";
    const parsedUrl = new URL(targetUrl);

    try {
      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; EdiyrexStudioBot/1.0; +https://ediyrex.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // Read at most first 80KB to quickly extract <head>
      const reader = res.body?.getReader();
      if (reader) {
        const chunks: Uint8Array[] = [];
        let bytesReceived = 0;
        const maxBytes = 80 * 1024;

        while (true) {
          const { done, value } = await reader.read();
          if (done || !value) break;
          chunks.push(value);
          bytesReceived += value.length;
          if (bytesReceived >= maxBytes) {
            reader.cancel();
            break;
          }
        }

        const decoder = new TextDecoder("utf-8");
        html = decoder.decode(Buffer.concat(chunks));
      }
    } catch {
      // Return basic fallback metadata based on hostname
      const fallback: LinkMetadata = {
        url: targetUrl,
        hostname: parsedUrl.hostname,
        title: parsedUrl.hostname,
        description: null,
        image: null,
        siteName: parsedUrl.hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
      };
      return NextResponse.json({ success: true, data: fallback });
    } finally {
      clearTimeout(timeout);
    }

    // Extract OpenGraph, Twitter, and standard HTML meta
    const title =
      extractMeta(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<title[^>]*>([^<]+)<\/title>/i) ||
      parsedUrl.hostname;

    const description =
      extractMeta(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
      null;

    let image =
      extractMeta(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) ||
      null;

    if (image && !image.startsWith("http://") && !image.startsWith("https://")) {
      try {
        image = new URL(image, targetUrl).toString();
      } catch {
        image = null;
      }
    }

    const siteName =
      extractMeta(html, /<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i) ||
      parsedUrl.hostname;

    const favicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;

    const metadata: LinkMetadata = {
      url: targetUrl,
      hostname: parsedUrl.hostname,
      title: title ? title.replace(/&amp;/g, "&").replace(/&quot;/g, '"') : parsedUrl.hostname,
      description: description ? description.replace(/&amp;/g, "&").replace(/&quot;/g, '"') : null,
      image,
      siteName,
      favicon,
    };

    previewCache.set(targetUrl, { data: metadata, cachedAt: Date.now() });

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    return handleApiError(error, "GET /api/v1/link-preview");
  }
}
