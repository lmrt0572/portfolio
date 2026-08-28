import type { ReactNode } from "react";

/**
 * Titre de section centré, en deux tons : le second mot passe en accent.
 * C'est la signature typographique de l'ancien site (« Mes **Projets** »).
 */
export function SectionTitle({
  lead,
  accent,
  children,
  as: Tag = "h1",
}: {
  lead: string;
  accent: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <header className="mx-auto mb-14 max-w-3xl text-center">
      <Tag className="text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.1] tracking-tight text-balance">
        {lead} <span className="text-accent-text">{accent}</span>
      </Tag>
      {children ? (
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {children}
        </p>
      ) : null}
    </header>
  );
}
