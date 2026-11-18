import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveCalLink, getFullBookingUrl, BOOKING_CONFIG } from "../config/booking.config";

describe("Booking Config & Resolver", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("resolves default username when no env variable is provided", () => {
    delete process.env.NEXT_PUBLIC_CAL_BOOKING_URL;
    delete process.env.NEXT_PUBLIC_CAL_LINK;

    expect(resolveCalLink()).toBe(BOOKING_CONFIG.defaultCalUsername);
    expect(getFullBookingUrl()).toBe(`https://cal.com/${BOOKING_CONFIG.defaultCalUsername}`);
  });

  it("resolves from NEXT_PUBLIC_CAL_BOOKING_URL with full https url", () => {
    process.env.NEXT_PUBLIC_CAL_BOOKING_URL = "https://cal.com/studio-ediyrex/discovery-call";

    expect(resolveCalLink()).toBe("studio-ediyrex/discovery-call");
    expect(getFullBookingUrl()).toBe("https://cal.com/studio-ediyrex/discovery-call");
  });

  it("resolves from NEXT_PUBLIC_CAL_LINK when booking url is unset", () => {
    delete process.env.NEXT_PUBLIC_CAL_BOOKING_URL;
    process.env.NEXT_PUBLIC_CAL_LINK = "ediyrex-pbxgua";

    expect(resolveCalLink()).toBe("ediyrex-pbxgua");
    expect(getFullBookingUrl()).toBe("https://cal.com/ediyrex-pbxgua");
  });
});
