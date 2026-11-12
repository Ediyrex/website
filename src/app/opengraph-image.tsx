import { ImageResponse } from "next/og";

export const alt =
  "Ediyrex Studio — Creative Technology, Media, Digital & AI";

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
          padding: "64px",
          backgroundColor: "#08090B",
          backgroundImage:
            "radial-gradient(circle at 75% 25%, #29241B 0%, #08090B 65%)",
          color: "#F5F3EE",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "#12151A",
                border: "2px solid #D6B77A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              E
            </div>
            <span style={{ fontSize: "26px", fontWeight: 700 }}>Ediyrex</span>
          </div>
          <span
            style={{
              fontSize: "16px",
              color: "#D6B77A",
              letterSpacing: "0.14em",
            }}
          >
            MEDIA · DIGITAL · AI
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: "920px",
            }}
          >
            We turn ideas into experiences that move businesses forward.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#B2B4BA",
              maxWidth: "780px",
              lineHeight: 1.4,
            }}
          >
            One integrated partner for visual storytelling, full-stack software, and intelligent automation.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #252A32",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#777D87",
          }}
        >
          <span>ediyrex@gmail.com</span>
          <span style={{ color: "#D6B77A" }}>India &amp; Global</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

