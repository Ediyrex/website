import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          backgroundColor: "transparent",
        }}
      >
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="EDYREX"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              color: "#F5F3EE",
              fontSize: 20,
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
