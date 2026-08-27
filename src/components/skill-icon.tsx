import {
  siAngular,
  siC,
  siCplusplus,
  siDocker,
  siDotnet,
  siExpress,
  siGit,
  siGithub,
  siGitlab,
  siJavascript,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNvidia,
  siOpencv,
  siPhp,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siTypescript,
} from "simple-icons";

type Icon = { path: string; hex: string; title: string };

/**
 * Logos officiels des technologies (paquet simple-icons).
 *
 * Tout n'a pas de logo : les notions (SQL, détection d'objets, suivi
 * multi-cibles) et C#, dont le logo a été retiré de la bibliothèque.
 * Ceux-là reçoivent un monogramme.
 */
const ICONS: Record<string, Icon> = {
  Python: siPython,
  "C++": siCplusplus,
  C: siC,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  PHP: siPhp,
  PyTorch: siPytorch,
  TensorRT: siNvidia,
  OpenCV: siOpencv,
  React: siReact,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Express: siExpress,
  Angular: siAngular,
  ".NET": siDotnet,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  MySQL: siMysql,
  Docker: siDocker,
  Linux: siLinux,
  Git: siGit,
  GitHub: siGithub,
  GitLab: siGitlab,
};

/** Luminance relative approchée, pour écarter les logos trop sombres. */
function isTooDark(hex: string): boolean {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.28;
}

/**
 * Repli pour les entrées sans logo officiel.
 *
 * Les noms courts (C#, SQL) se suffisent à eux-mêmes et sont affichés tels
 * quels. Les libellés plus longs recevraient un sigle tronqué illisible
 * (« Suivi multi-cibles » donnerait « SMC ») : ils prennent une marque neutre,
 * et c'est le nom sous la tuile qui porte le sens.
 */
function Fallback({ label }: { label: string }) {
  if (label.length <= 5) {
    return (
      <span className="text-xl font-extrabold tracking-tight" aria-hidden>
        {label}
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2.6 20.5 7v10L12 21.4 3.5 17V7z" />
      <path d="M12 12v9.4M12 12 3.5 7M12 12l8.5-5" />
    </svg>
  );
}

/**
 * Nature de la marque affichée sur la tuile. La grille s'en sert pour ne pas
 * répéter le nom sous une marque qui est déjà ce nom.
 */
export function skillMarkKind(name: string): "logo" | "text" | "glyph" {
  if (ICONS[name]) return "logo";
  return name.length <= 5 ? "text" : "glyph";
}

export function SkillIcon({ name }: { name: string }) {
  const icon = ICONS[name];
  if (!icon) return <Fallback label={name} />;

  // Sur fond sombre, un logo noir (Express, Next.js…) serait invisible :
  // on garde alors la couleur du texte.
  const brand = isTooDark(icon.hex) ? "currentColor" : `#${icon.hex}`;

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-9"
      fill="currentColor"
      aria-hidden
      style={{ "--brand": brand } as React.CSSProperties}
    >
      <path d={icon.path} />
    </svg>
  );
}
