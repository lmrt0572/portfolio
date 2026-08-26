import { getTranslations } from "next-intl/server";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "./icons";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    /*
      Masqué sous 768px : sur téléphone la page d'accueil tient en un écran et
      le pied de page venait s'y coller, ce qui alourdissait l'ensemble.
      Les liens GitHub et LinkedIn restent accessibles dans le hero et sur la
      page Contact, donc rien d'utile n'est perdu.
    */
    <footer className="hidden border-t border-line-soft md:block">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-dim">
          © {year} {profile.name} · {t("rights")}
        </p>

        <div className="flex items-center gap-5">
          <span className="hidden text-sm text-muted-dim sm:inline">
            {t("built")}
          </span>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            className="btn-round"
          >
            <GithubIcon />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            className="btn-round"
          >
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
