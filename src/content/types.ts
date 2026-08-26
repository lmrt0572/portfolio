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

/**
 * Un titre est soit un nom propre (« Breezy »), identique dans les deux
 * langues, soit un intitulé descriptif à traduire.
 */
export type Title = string | Localized;

export function pickTitle(value: Title, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

export type ProjectStatus = "shipped" | "ongoing";

/** Domaine du projet — sert de « classe détectée » dans l'UI. */
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
  /**
   * Dimensions réelles du fichier. Renseignées pour les captures présentées en
   * galerie : c'est ce qui permet de les afficher à leur rapport d'origine au
   * lieu de les rogner dans un cadre commun — une capture d'écran large perd
   * l'essentiel de son contenu dans un carré.
   */
  width?: number;
  height?: number;
};

/**
 * Vidéo de démonstration d'un projet.
 *
 * Rien n'est téléchargé tant que le visiteur n'a pas cliqué : seule l'affiche
 * est chargée. Le fichier lui-même est ensuite servi par tranches, via les
 * requêtes de plage HTTP que tout hébergeur statique gère — à condition que
 * l'index du MP4 soit placé en tête (voir `-movflags +faststart`).
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
  /** Affiché tel quel, ex. « 2025 — en cours ». */
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
  /**
   * Démonstration interactive à insérer dans la page. Petit registre plutôt
   * qu'un composant passé directement : le contenu reste sérialisable et la
   * page projet garde la main sur le rendu.
   */
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
