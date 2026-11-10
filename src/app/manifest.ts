import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ediyrex Studio",
    short_name: "Ediyrex",
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
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
