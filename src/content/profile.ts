import type {
  EducationItem,
  ExperienceItem,
  Localized,
  LocalizedList,
  SkillGroup,
} from "./types";

export const profile = {
  name: "Léo Martin",
  initials: "LM",
  email: "leo.martin1@viacesi.fr",
  phone: "+33 6 26 60 54 11",
  phoneHref: "tel:+33626605411",
  location: "Rouen, France",
  github: "https://github.com/lmrt0572",
  githubHandle: "lmrt0572",
  linkedin: "https://www.linkedin.com/in/l%C3%A9o-martin-1a939b338/",
  linkedinHandle: "léo-martin",
  cv: {
    fr: "/documents/CV_MARTIN_Leo_FR.pdf",
    en: "/documents/CV_MARTIN_Leo_EN.pdf",
  },
  role: {
    fr: "Alternant ingénieur — IA & vision par ordinateur",
    en: "Apprentice engineer — AI & computer vision",
  } satisfies Localized,
  company: "Thales LAS",
  availability: {
    fr: "Stage international · juin – septembre 2027",
    en: "International internship · June – September 2027",
  } satisfies Localized,
  pitch: {
    fr: "J'entraîne et déploie des modèles de détection et de suivi d'objets en temps réel chez Thales, sur des systèmes de surveillance maritime. Je cherche un stage à l'international de 4 mois en intelligence artificielle, vision par ordinateur ou data.",
    en: "I train and deploy real-time object detection and tracking models at Thales, on maritime surveillance systems. I am looking for a 4-month international internship in artificial intelligence, computer vision or data.",
  } satisfies Localized,
  portrait: "/images/portrait.png",
} as const;

/** Amorce fixe de la phrase d'accueil, avant la partie qui se réécrit. */
export const typerLead: Localized = {
  fr: "Élève ingénieur, je travaille sur",
  en: "Engineering student, I work on",
};

/**
 * Segments qui défilent en machine à écrire sous le nom.
 *
 * L'amorce reste neutre à dessein : avec « Alternant chez Thales », la phrase
 * attribuerait à l'alternance le web et l'optimisation, qui viennent des
 * projets d'école. Thales est mentionné dans le paragraphe juste en dessous.
 *
 * L'ordre n'est pas indifférent — le deuxième segment est celui qu'on voit le
 * plus souvent en arrivant sur la page, d'où l'IA en tête et le web en fin,
 * dans l'ordre des postes visés.
 */
export const typerPhrases: LocalizedList = {
  fr: [
    "des modèles d'intelligence artificielle",
    "des systèmes temps réel",
    "des problèmes d'optimisation",
    "des applications web et logicielles",
  ],
  en: [
    "artificial intelligence models",
    "real-time systems",
    "optimisation problems",
    "web and software applications",
  ],
};

/** Texte de présentation, à la première personne. Un paragraphe par entrée. */
export const bio: LocalizedList = {
  fr: [
    "Je suis en cycle ingénieur informatique à CESI Rouen, en alternance chez Thales LAS  depuis octobre 2025. J'y travaille sur la détection et le suivi automatique de cibles en temps réel pour des systèmes de surveillance maritime — de la constitution du jeu de données jusqu'au déploiement sur un serveur isolé du réseau.",
    "À côté de l'alternance, mes projets d'école m'emmènent ailleurs : optimisation de tournées de livraison sous contraintes, réseau social en microservices, logiciel de sauvegarde en C#. Changer de domaine chaque semestre m'a appris à devenir utile vite sur un sujet que je ne connais pas encore.",
    "En dehors du code : football, musculation et basketball, un peu de piano, et des voyages — États-Unis, Martinique, Italie, Espagne — qui m'ont donné envie de faire mon prochain stage à l'étranger.",
  ],
  en: [
    "I'm a computer science engineering student at CESI Rouen, working at Thales LAS  as an apprentice engineer since October 2025. I work there on real-time detection and tracking of maritime targets — from building the dataset through to deployment on an air-gapped server.",
    "Alongside the apprenticeship, my school projects take me elsewhere: constrained delivery-route optimisation, a microservices social network, a backup tool written in C#. Switching field every semester has taught me to become useful quickly on a subject I don't know yet.",
    "Outside code: football, weight training and basketball, some piano, and travel — the USA, Martinique, Italy, Spain — which is what makes me want my next internship to be abroad.",
  ],
};

/** Qualités de travail, reprises des soft skills du CV. */
export const softSkills: LocalizedList = {
  fr: [
    "Autonomie en environnement R&D",
    "Esprit critique",
    "Adaptation et collaboration",
    "Souci du détail et rigueur",
  ],
  en: [
    "Autonomous in an R&D environment",
    "Critical thinking",
    "Adaptable and collaborative",
    "Attention to detail and rigour",
  ],
};

/** Fiche « À propos », reprise de l'ancien site et actualisée. */
export const aboutFacts: { label: Localized; value: Localized }[] = [
  {
    label: { fr: "Localisation", en: "Location" },
    value: { fr: "Rouen, France", en: "Rouen, France" },
  },
  {
    label: { fr: "École", en: "School" },
    value: { fr: "CESI Rouen", en: "CESI Rouen" },
  },
  {
    label: { fr: "Cursus", en: "Programme" },
    value: {
      fr: "Cycle ingénieur informatique, en alternance",
      en: "Computer science engineering, apprenticeship",
    },
  },
  {
    label: { fr: "Entreprise", en: "Company" },
    value: { fr: "Thales LAS, Ymare", en: "Thales LAS, Ymare" },
  },
  {
    label: { fr: "Recherche", en: "Looking for" },
    value: {
      fr: "Stage international, 4 mois, juin – septembre 2027",
      en: "International internship, 4 months, June – September 2027",
    },
  },
  {
    label: { fr: "Mobilité", en: "Mobility" },
    value: {
      fr: "Permis B, véhiculé — mobile à l'international",
      en: "Full driving licence — open to relocation",
    },
  },
  {
    label: { fr: "Centres d'intérêt", en: "Interests" },
    value: {
      fr: "Football, musculation, basketball, piano, voyage, lecture",
      en: "Football, weight training, basketball, piano, travel, reading",
    },
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    label: { fr: "IA & Vision", en: "AI & Vision" },
    items: [
      "PyTorch",
      "TensorRT",
      "OpenCV",
      "RF-DETR",
      "RT-DETR",
      "CVAT",
      "Object tracking",
    ],
  },
  {
    id: "languages",
    label: { fr: "Langages", en: "Languages" },
    items: ["Python", "C++", "C#", "C", "TypeScript", "JavaScript", "PHP"],
  },
  {
    id: "web",
    label: { fr: "Web & Frameworks", en: "Web & Frameworks" },
    items: ["React", "Next.js", "Node.js", "Express", "Angular", ".NET"],
  },
  {
    id: "data",
    label: { fr: "Données", en: "Data" },
    items: ["PostgreSQL", "MongoDB", "SQL", "MySQL"],
  },
  {
    id: "ops",
    label: { fr: "DevOps & Outils", en: "DevOps & Tools" },
    items: ["Docker", "Linux", "Git", "GitHub", "GitLab", "CI/CD"],
  },
];

export const experience: ExperienceItem[] = [
  {
    period: { fr: "Oct. 2025 — Sept. 2028", en: "Oct. 2025 — Sept. 2028" },
    role: {
      fr: "Alternant ingénieur — Développement IA & analyse de données",
      en: "Apprentice engineer — AI development & data analysis",
    },
    org: "Thales LAS",
    location: "Ymare, France",
    current: true,
    bullets: {
      fr: [
        "Détection et suivi automatique de cibles maritimes en temps réel, avec asservissement d'une caméra PTZ pour maintenir la cible dans le champ.",
        "Entraînement et comparaison de deux détecteurs récents (RF-DETR, RT-DETR) sur un jeu de données maritime constitué et annoté en interne.",
        "Optimisation de l'inférence pour le temps réel et déploiement sur serveur isolé.",
        "Boucle d'apprentissage actif : les corrections de l'opérateur en direct alimentent le ré-entraînement.",
      ],
      en: [
        "Real-time detection and tracking of maritime targets, with closed-loop PTZ camera control to keep the target in frame.",
        "Trained and benchmarked two recent detectors (RF-DETR, RT-DETR) on an in-house annotated maritime dataset.",
        "Optimised inference for real-time operation and deployed on an air-gapped server.",
        "Built an active learning loop: live operator corrections feed model retraining.",
      ],
    },
  },
  {
    period: { fr: "Avril — Juillet 2025", en: "April — July 2025" },
    role: { fr: "Stagiaire Data Analyst", en: "Data Analyst intern" },
    org: "Thales LAS",
    location: "Ymare, France",
    bullets: {
      fr: [
        "Manipulation et restructuration d'une base de données des radars de surveillance aérienne.",
        "Maintenance d'outils Excel de suivi et développement d'outils de validation des données.",
        "Optimisation du processus de collecte et d'intégration des données provenant de différentes sources.",
      ],
      en: [
        "Managed and restructured the surveillance radar database.",
        "Maintained Excel tracking tools and developed data validation tooling.",
        "Streamlined the collection and integration of data from multiple sources.",
      ],
    },
  },
];

export const education: EducationItem[] = [
  {
    period: { fr: "2025 — 2028", en: "2025 — 2028" },
    degree: {
      fr: "Cycle ingénieur informatique (FISA, alternance)",
      en: "Engineering degree, Computer Science (apprenticeship)",
    },
    org: "CESI Rouen",
    detail: {
      fr: "Pédagogie par projets : systèmes d'information & sécurité, génie logiciel, recherche opérationnelle, applications distribuées.",
      en: "Project-based curriculum: information systems & security, software engineering, operations research, distributed applications.",
    },
  },
  {
    period: { fr: "2023 — 2025", en: "2023 — 2025" },
    degree: {
      fr: "Cycle préparatoire intégré",
      en: "Integrated preparatory cycle",
    },
    org: "CESI Rouen",
    detail: {
      fr: "Systèmes embarqués, programmation orientée objet, réseaux, bases de données, développement web.",
      en: "Embedded systems, object-oriented programming, networks, databases, web development.",
    },
  },
  {
    period: { fr: "2021", en: "2021" },
    degree: {
      fr: "Baccalauréat général, mention Bien",
      en: "French Baccalauréat, science track (with honours)",
    },
    org: "Lycée Guillaume Le Conquérant, Lillebonne",
    detail: {
      fr: "Spécialités mathématiques et sciences de la vie et de la Terre.",
      en: "Majors in mathematics and life sciences.",
    },
  },
];

/** `score` positionne le niveau sur l'échelle CECRL (A1 → C2, soit 6 crans). */
export const languages: {
  label: Localized;
  level: Localized;
  score: number;
}[] = [
  {
    label: { fr: "Français", en: "French" },
    level: { fr: "Langue maternelle", en: "Native" },
    score: 6,
  },
  {
    label: { fr: "Anglais", en: "English" },
    level: { fr: "B2 — courant", en: "B2 — fluent" },
    score: 4,
  },
  {
    label: { fr: "Espagnol", en: "Spanish" },
    level: { fr: "B1 — intermédiaire", en: "B1 — intermediate" },
    score: 3,
  },
];
