import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Aucune fonctionnalité serveur n'est utilisée (pas de route API, pas de server
  // action, pas d'ISR) : basculer sur GitHub Pages ne demande que d'ajouter
  // `output: "export"`, `basePath` et `images.unoptimized`.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
