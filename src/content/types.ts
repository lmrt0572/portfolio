import type { Locale } from "@/i18n/routing";

/** Chaîne disponible dans les deux langues du site. */
export type Localized = Record<Locale, string>;

/** Liste disponible dans les deux langues du site. */
export type LocalizedList = Record<Locale, string[]>;

export function pick(value: Localized, locale: Locale): string {
  return value[locale];
}

export function pickList(value: LocalizedList, locale: Locale): string[] {
  return value[locale];
}

/** Nom propre identique dans les deux langues, ou intitulé descriptif traduit. */
export type Title = string | Localized;

export function pickTitle(value: Title, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

export type ProjectStatus = "shipped" | "ongoing";

/** Domaine du projet. */
export type ProjectDomain =
  | "computer-vision"
  | "web"
  | "software"
  | "data"
  | "embedded"
  | "algorithms";

export type ProjectSection = {
  id: string;
  title: Localized;
  body?: Localized;
  bullets?: LocalizedList;
};

/** Étape d'une chaîne de traitement, rendue comme une suite numérotée. */
export type PipelineStep = {
  id: string;
  title: Localized;
  body: Localized;
};

/** Métadonnée courte affichée en bandeau sous l'en-tête (rôle, équipe…). */
export type ProjectFact = {
  label: Localized;
  value: Localized;
};

export type ProjectImage = {
  src: string;
  alt: Localized;
  /** Dimensions réelles du fichier, pour afficher les captures à leur rapport
   *  d'origine. */
  width?: number;
  height?: number;
};

/**
 * Vidéo de démonstration. Rien n'est téléchargé avant un clic (seule l'affiche
 * l'est). Servie ensuite par requêtes de plage HTTP ; index du MP4 en tête
 * requis (`-movflags +faststart`).
 */
export type ProjectVideo = {
  /** Source principale : H.264/AAC en MP4, index en tête. */
  mp4: string;
  /** Variante WebM (VP9 ou AV1), proposée en premier quand elle est comprise. */
  webm?: string;
  /** Affiche : la seule ressource chargée avant un clic. */
  poster: string;
  /** Rapport largeur/hauteur, pour réserver la place et éviter tout décalage. */
  aspect?: string;
  caption: Localized;
  /** Sous-titres WebVTT. Une démo commentée reste inaccessible sans eux. */
  captions?: { src: string; srcLang: string; label: Localized };
};

export type Project = {
  slug: string;
  /** Les trois projets phares ouvrent la page d'accueil. */
  featured: boolean;
  status: ProjectStatus;
  /** Affiché tel quel, ex. « 2025, en cours ». */
  period: Localized;
  /** Nom propre (chaîne unique) ou intitulé descriptif traduit. */
  title: Title;
  tagline: Localized;
  /** Cadre du projet, ex. « Thales · Alternance ». */
  context: Localized;
  domain: ProjectDomain;
  stack: string[];
  repo?: string;
  cover?: ProjectImage;
  gallery?: ProjectImage[];
  /** Résultats clés, mis en avant en haut de la page projet. */
  highlights: LocalizedList;
  /** Bandeau de métadonnées : rôle tenu, taille d'équipe, environnement… */
  facts?: ProjectFact[];
  /** Chaîne de traitement, présentée en étapes numérotées. */
  pipeline?: PipelineStep[];
  /** Démonstration interactive à insérer. Registre sérialisable, rendu géré
   *  par la page projet. */
  demo?: "tsp";
  /** Vidéo de démonstration, insérée avant les sections rédigées. */
  video?: ProjectVideo;
  sections: ProjectSection[];
  /** Documents téléchargeables (livrables, rapports). */
  documents?: { href: string; label: Localized }[];
  /** Signalé dans l'UI quand le contenu doit rester non sensible. */
  confidential?: boolean;
};

export type ExperienceItem = {
  period: Localized;
  role: Localized;
  org: string;
  location: string;
  bullets: LocalizedList;
  current?: boolean;
};

export type EducationItem = {
  period: Localized;
  degree: Localized;
  org: string;
  detail: Localized;
};

export type SkillGroup = {
  id: string;
  label: Localized;
  items: string[];
};
