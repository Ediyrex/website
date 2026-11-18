import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08090B",
          borderRadius: "40px",
          border: "5px solid #D6B77A",
          position: "relative",
        }}
      >
        <span
          style={{
            color: "#F5F2EC",
            fontSize: 104,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          E
        </span>
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: "28px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#F06419",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
