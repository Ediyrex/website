import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/config/site";

export const alt =
  "EDYREX Studio — Creative Technology, Commercial Media, Digital & AI Systems";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px",
          backgroundColor: "#08090B",
          backgroundImage:
            "radial-gradient(ellipse at 80% 25%, #29241B 0%, #08090B 68%)",
          color: "#F5F3EE",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "#12151A",
                border: "2px solid #D6B77A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 900,
                color: "#F5F3EE",
                position: "relative",
              }}
            >
              E
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#F06419",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#F5F3EE",
              }}
            >
              EDYREX
            </span>
          </div>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#F06419",
              letterSpacing: "0.18em",
            }}
          >
            MEDIA · DIGITAL · AI
          </span>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: "960px",
              color: "#F5F3EE",
              letterSpacing: "-0.03em",
            }}
          >
            We turn ideas into experiences that move businesses forward.
          </div>
          <div
            style={{
              fontSize: "23px",
              color: "#B2B4BA",
              maxWidth: "840px",
              lineHeight: 1.45,
            }}
          >
            Independent creative technology studio uniting commercial media, full-stack digital experiences, and autonomous AI systems.
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #252A32",
            paddingTop: "24px",
            fontSize: "17px",
            color: "#898D94",
          }}
        >
          <span>{SITE_CONFIG.contact.email}</span>
          <span style={{ color: "#D6B77A", fontWeight: 600 }}>
            {SITE_CONFIG.contact.location}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
