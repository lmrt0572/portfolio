import { profile, skillGroups, languages } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

/**
 * Donnée structurée Schema.org de type `Person`, injectée en JSON-LD (métier,
 * école, employeur, compétences, langues, comptes). Reprise de `profile.ts`.
 */
function personSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role[locale],
    description: profile.pitch[locale],
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}${profile.portrait}`,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rouen",
      addressCountry: "FR",
    },
    worksFor: { "@type": "Organization", name: profile.company },
    alumniOf: { "@type": "CollegeOrUniversity", name: "CESI Rouen" },
    knowsAbout: skillGroups.flatMap((group) => group.items),
    knowsLanguage: languages.map((language) => ({
      "@type": "Language",
      name: language.label.en,
    })),
    sameAs: [profile.github, profile.linkedin],
  };
}

export function StructuredData({ locale }: { locale: Locale }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify échappe déjà les caractères dangereux ; on neutralise en
      // plus le `<` pour qu'aucune séquence `</script>` ne puisse fermer la
      // balise prématurément.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema(locale)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
