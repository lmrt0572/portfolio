# Portfolio de Léo Martin

Portfolio bilingue (FR/EN) d'un étudiant ingénieur en informatique, orienté
intelligence artificielle et vision par ordinateur.

**Next.js 16** (App Router) · **TypeScript** · **Tailwind CSS v4** · **next-intl**

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

| Commande            | Rôle                      |
| ------------------- | ------------------------- |
| `npm run dev`       | Serveur de développement  |
| `npm run build`     | Build de production       |
| `npm run start`     | Sert le build             |
| `npm run lint`      | ESLint                    |
| `npm run typecheck` | Vérification TypeScript   |

## Organisation

```
messages/        Chaînes d'interface, une par langue
public/          Visuels, documents, vidéos
src/
  app/[locale]/  Pages localisées
  components/    Composants d'interface
  content/       Profil, parcours et projets
  i18n/          Configuration next-intl
```

Le contenu éditorial vit dans `src/content/`, en TypeScript, les deux langues
côte à côte dans le même objet : une traduction manquante devient une erreur de
compilation. Ajouter un projet consiste à ajouter une entrée au tableau
`projects` ; la page, la vignette et le sitemap en découlent.

Les routes sont préfixées (`/fr`, `/en`), sans middleware ni négociation côté
serveur.

## Déploiement

Aucune fonctionnalité serveur n'est utilisée : ni route API, ni server action,
ni ISR. Le site tourne donc aussi bien sur une plateforme Node que sur un
hébergement statique.

Sur un domaine personnalisé ou hors Vercel, définir `NEXT_PUBLIC_SITE_URL` :
sans elle, le sitemap et les URL canoniques pointent vers `localhost`.
