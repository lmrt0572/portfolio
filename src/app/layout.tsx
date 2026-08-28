import type { ReactNode } from "react";

/**
 * Racine minimale : la vraie structure `<html>` / `<body>` vit dans
 * `src/app/[locale]/layout.tsx`, où la langue est connue.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
