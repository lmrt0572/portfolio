import Image from "next/image";
import { profile } from "@/content/profile";

/**
 * Portrait circulaire cerclé d'un dégradé conique rotatif. La rotation est
 * définie dans `.portrait` (globals.css) et respecte prefers-reduced-motion.
 *
 * Trois régimes de taille : sur téléphone le portrait occupe près de la moitié
 * de la largeur, comme sur l'ancien site ; dès la tablette il se calme, sinon
 * la page d'accueil ne tient plus dans l'écran ; en deux colonnes il suit la
 * proportion d'origine (~32vw).
 */
export function Portrait({ alt }: { alt: string }) {
  return (
    <div className="portrait size-[clamp(11rem,46vw,26rem)] md:size-[clamp(13rem,28vw,26rem)] lg:size-[clamp(14rem,32vw,36rem)]">
      <div className="portrait__inner">
        <div className="portrait__photo">
          <Image
            src={profile.portrait}
            alt={alt}
            width={550}
            height={550}
            priority
            sizes="(min-width: 1024px) 24rem, 62vw"
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
