import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EDIYREX Studio",
    short_name: "EDIYREX",
    description:
      "Creative technology studio uniting Media, Digital experiences, and Artificial Intelligence.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090B",
    theme_color: "#08090B",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/images/logo/ediyrex-emblem-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo/ediyrex-emblem-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

