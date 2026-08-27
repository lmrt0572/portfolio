import { skillGroups } from "@/content/profile";
import { SkillIcon, skillMarkKind } from "./skill-icon";
import type { Locale } from "@/i18n/routing";

/**
 * Compétences présentées par logos, avec le nom affiché sous chaque icône
 * (accessible au doigt et au lecteur d'écran).
 */
export function SkillsGrid({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-8">
      {skillGroups.map((group) => (
        <section key={group.id}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
            {group.label[locale]}
          </h3>

          <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-3">
            {group.items.map((item) => {
              // Quand la marque est déjà le nom écrit en toutes lettres
              // (C#, SQL…), on ne le répète pas sous la tuile.
              const showName = skillMarkKind(item) !== "text";
              return (
                <li key={item} className="skill">
                  <span className="skill__mark">
                    <SkillIcon name={item} />
                  </span>
                  {showName ? (
                    <span className="skill__name">{item}</span>
                  ) : (
                    <span className="sr-only">{item}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
