import type { MetadataRoute } from "next";

import { profile } from "@/content/profile";

/**
 * Manifest d'application web : donne un nom, une couleur de thème et des icônes
 * quand le site est ajouté à l'écran d'accueil sur mobile, et fixe la couleur
 * de la barre d'adresse sur navigateur mobile.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · Portfolio`,
    short_name: profile.name,
    description: profile.role.en,
    start_url: "/",
    display: "standalone",
    background_color: "#1f242d",
    theme_color: "#1f242d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
