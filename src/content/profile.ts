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
    fr: "Alternant ingénieur en IA & vision par ordinateur",
    en: "Apprentice engineer in AI & computer vision",
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

/** Début fixe de la phrase d'accueil. */
export const typerLead: Localized = {
  fr: "Élève ingénieur, je travaille sur",
  en: "Engineering student, I work on",
};

/** Segments affichés en machine à écrire sous le nom. */
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

/** Paragraphes de présentation. */
export const bio: LocalizedList = {
  fr: [
    "Ce qui me motive, c'est de transformer un problème que je ne sais pas encore résoudre en quelque chose qui fonctionne vraiment. En alternance chez Thales, je le vis sur des sujets de vision par ordinateur ; mais l'essentiel pour moi, c'est cette façon de travailler, plus que le domaine lui-même : comprendre vite, tester, itérer.",
    "Mon cursus me fait changer de terrain chaque semestre : IA, optimisation, développement web, systèmes distribués. Loin de m'éparpiller, ça m'a appris à devenir utile rapidement sur un sujet inconnu, et à y prendre goût. Ce que je cherche maintenant, c'est aller plus loin : un environnement exigeant, à l'international, où je progresse au contact d'équipes qui en savent plus que moi.",
    "En dehors du code : football, musculation et basketball, un peu de piano, et des voyages (États-Unis, Martinique, Italie, Espagne) qui m'ont donné envie de faire mon prochain stage à l'étranger.",
  ],
  en: [
    "What drives me is turning a problem I don't yet know how to solve into something that actually works. I get to live that in my apprenticeship at Thales, on computer vision projects; but what matters most to me is the way of working, more than the field itself: understand fast, test, iterate.",
    "My programme moves me to a new area every semester: AI, optimisation, web development, distributed systems. Far from spreading me thin, it has taught me to become useful quickly on an unfamiliar subject, and to enjoy it. What I'm looking for now is to go further: a demanding, international environment where I keep growing alongside people who know more than I do.",
    "Outside code: football, weight training and basketball, some piano, and travel (the USA, Martinique, Italy, Spain) that makes me want my next internship to be abroad.",
  ],
};

/** Qualités de travail. */
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

/** Données de la fiche « À propos ». */
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
      fr: "Permis B, véhiculé, mobile à l'international",
      en: "Full driving licence, open to relocation",
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
      "Détection d'objets",
      "Suivi multi-cibles",
      "Annotation de données",
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
    items: ["React", "Next.js", "Express", ".NET"],
  },
  {
    id: "data",
    label: { fr: "Données", en: "Data" },
    items: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    id: "ops",
    label: { fr: "DevOps & Outils", en: "DevOps & Tools" },
    items: ["Docker", "Linux", "Git", "GitHub"],
  },
];

export const experience: ExperienceItem[] = [
  {
    period: { fr: "Oct. 2025 – Sept. 2028", en: "Oct. 2025 – Sept. 2028" },
    role: {
      fr: "Alternant ingénieur en développement IA & analyse de données",
      en: "Apprentice engineer in AI development & data analysis",
    },
    org: "Thales LAS",
    location: "Ymare, France",
    current: true,
    bullets: {
      fr: [
        "Détection et suivi automatique de cibles maritimes en temps réel, avec asservissement d'une caméra PTZ pour maintenir la cible dans le champ.",
        "Constitution et annotation d'un jeu de données maritime, puis entraînement et comparaison de plusieurs détecteurs récents.",
        "Optimisation de l'inférence pour le temps réel et déploiement sur serveur isolé.",
        "Boucle d'apprentissage actif : les corrections de l'opérateur en direct alimentent le ré-entraînement.",
      ],
      en: [
        "Real-time detection and tracking of maritime targets, with closed-loop PTZ camera control to keep the target in frame.",
        "Built and annotated a maritime dataset, then trained and benchmarked several recent detectors.",
        "Optimised inference for real-time operation and deployed on an air-gapped server.",
        "Built an active learning loop: live operator corrections feed model retraining.",
      ],
    },
  },
  {
    period: { fr: "Avril – Juillet 2025", en: "April – July 2025" },
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

/** Jobs étudiants et expériences non techniques, affichés en liste secondaire. */
export const otherExperience: {
  period: Localized;
  role: Localized;
  org: string;
  detail: Localized;
}[] = [
  {
    period: { fr: "Août 2024", en: "Aug. 2024" },
    role: { fr: "Emploi saisonnier", en: "Seasonal worker" },
    org: "Déchèterie de Bolbec",
    detail: {
      fr: "Gestion des déchets et accueil des usagers, dans le respect des normes environnementales.",
      en: "Waste management and user assistance, in line with environmental standards.",
    },
  },
  {
    period: { fr: "Juillet 2024", en: "July 2024" },
    role: { fr: "Manutentionnaire (intérim)", en: "Warehouse operative (temp)" },
    org: "Récré-Action, Pont-Audemer",
    detail: {
      fr: "Aménagement d'aires de jeux pour enfants, travail en équipe et coordination.",
      en: "Assembling children's playgrounds, teamwork and coordination.",
    },
  },
  {
    period: { fr: "2023", en: "2023" },
    role: { fr: "Emploi saisonnier", en: "Seasonal worker" },
    org: "Mairie de Port-Jérôme-sur-Seine",
    detail: {
      fr: "Surveillance et maintenance des infrastructures locales.",
      en: "Monitoring and upkeep of local facilities.",
    },
  },
  {
    period: { fr: "2019", en: "2019" },
    role: { fr: "Stage d'observation", en: "Observation placement" },
    org: "Cabinet de kinésithérapie",
    detail: {
      fr: "Première découverte d'un environnement médical, sens de l'observation.",
      en: "First exposure to a medical environment, observation skills.",
    },
  },
];

export const education: EducationItem[] = [
  {
    period: { fr: "2025 – 2028", en: "2025 – 2028" },
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
    period: { fr: "2023 – 2025", en: "2023 – 2025" },
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

/** `score` : niveau CECRL, de 1 (A1) à 6 (C2). */
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
    level: { fr: "B2, courant", en: "B2, fluent" },
    score: 4,
  },
  {
    label: { fr: "Espagnol", en: "Spanish" },
    level: { fr: "B1, intermédiaire", en: "B1, intermediate" },
    score: 3,
  },
];
