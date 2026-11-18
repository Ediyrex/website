import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "7px",
          border: "1.5px solid #D6B77A",
          position: "relative",
        }}
      >
        <span
          style={{
            color: "#F5F3EE",
            fontSize: 20,
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
            top: "5px",
            right: "5px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#F06419",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
