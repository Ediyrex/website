import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  const filePath = path.join(
    process.cwd(),
    "public/images/logo/ediyrex-emblem.png"
  );
  let dataUrl = "";
  try {
    const file = fs.readFileSync(filePath);
    dataUrl = `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    // Graceful fallback
  }

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
          borderRadius: "36px",
          border: "2px solid rgba(255, 255, 255, 0.12)",
          padding: "24px",
        }}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="EDYREX"
            style={{ width: "132px", height: "132px", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              color: "#F5F2EC",
              fontSize: 96,
              fontWeight: 900,
              fontFamily: "sans-serif",
            }}
          >
            E
          </span>
        )}
      </div>
    ),
    { ...size }
  );
}
