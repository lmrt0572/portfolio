# Portfolio — Léo Martin

Portfolio bilingue (FR/EN) d'un étudiant ingénieur en informatique, orienté
intelligence artificielle et vision par ordinateur.

**Stack** — Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · next-intl

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

| Commande            | Rôle                              |
| ------------------- | --------------------------------- |
| `npm run dev`       | Serveur de développement          |
| `npm run build`     | Build de production               |
| `npm run start`     | Sert le build de production       |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | Vérification TypeScript seule     |

## Organisation

```
messages/            Chaînes d'interface, une par langue (fr.json, en.json)
public/
  documents/         CV et livrables téléchargeables
  images/            Visuels des projets
src/
  app/
    [locale]/        Pages localisées (accueil, /projects/[slug], 404)
    globals.css      Design system : jetons, cadres, animations
    sitemap.ts       Sitemap avec alternances de langue
  components/        Composants d'interface
  content/
    profile.ts       Identité, compétences, expérience, formation
    projects.ts      Tous les projets — source unique de vérité
    types.ts         Types du contenu
  i18n/              Configuration next-intl (routing, navigation, requêtes)
```

### Séparation contenu / interface

Le contenu éditorial (projets, parcours, compétences) vit dans `src/content/`,
en TypeScript, avec les deux langues côte à côte dans le même objet — ce qui
rend une traduction manquante immédiatement visible. Les chaînes d'interface
(libellés de boutons, titres de section) vivent dans `messages/`.

## Ajouter un projet

Une seule chose à faire : ajouter une entrée au tableau `projects` de
`src/content/projects.ts`. La page `/[locale]/projects/[slug]`, l'entrée dans la
grille de l'accueil et le sitemap en découlent automatiquement.

```ts
{
  slug: "mon-projet",          // définit l'URL
  featured: false,             // true = mis en avant en haut de l'accueil
  status: "shipped",           // "shipped" | "ongoing"
  period: { fr: "2026", en: "2026" },
  title: "Mon projet",         // ou { fr: "...", en: "..." } si à traduire
  tagline: { fr: "…", en: "…" },
  context: { fr: "…", en: "…" },
  domain: "web",               // sert d'étiquette de classe dans l'UI
  stack: ["TypeScript", "…"],
  repo: "https://github.com/…", // facultatif
  cover: { src: "/images/…", alt: { fr: "…", en: "…" } }, // facultatif
  highlights: { fr: ["…"], en: ["…"] },
  sections: [{ id: "context", title: { fr: "…", en: "…" }, body: { fr: "…", en: "…" } }],
}
```

Sans `cover`, la carte affiche un visuel généré (`DetectionPlate`) plutôt qu'une
vignette vide.

## Langues

Les routes sont préfixées (`/fr`, `/en`), sans middleware ni négociation côté
serveur. Ajouter une langue : la déclarer dans `src/i18n/routing.ts`, créer
`messages/<code>.json`, et compléter les objets de `src/content/`.

## Accessibilité et robustesse

- Les animations de révélation sont **entièrement en CSS**
  (`animation-timeline: view()`). Aucun contenu ne dépend de JavaScript pour
  être visible : sur un navigateur sans support, tout s'affiche sans animation.
- `prefers-reduced-motion` neutralise toutes les animations.
- Lien d'évitement, cibles focusables visibles, contrastes vérifiés sur fond
  sombre.

## Déploiement

Déployé sur Vercel : chaque push construit une préversion, `main` va en
production.

Le projet n'utilise **aucune fonctionnalité serveur** (pas de route API, pas de
server action, pas d'ISR). Basculer vers un hébergement statique (GitHub Pages)
demande seulement, dans `next.config.ts` :

```ts
output: "export",
basePath: "/portfolio",          // si le dépôt n'est pas <user>.github.io
images: { unoptimized: true },
```

…et de remplacer la redirection de `src/app/page.tsx` par une page contenant une
balise `<meta http-equiv="refresh">`.

Définir `NEXT_PUBLIC_SITE_URL` sur l'URL publique pour que le sitemap, les URL
canoniques et les images Open Graph soient absolus.
