import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abdulrhman Ashraf Portfolio",
    short_name: "AS Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icons/android/android-launchericon-192-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android/android-launchericon-512-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
