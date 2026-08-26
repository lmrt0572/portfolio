"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { ProjectImage } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

/**
 * Galerie en carrousel.
 *
 * Hauteur commune, largeur adaptée au rapport de chaque fichier (pas de
 * recadrage 4/3 qui couperait les bords des captures larges).
 *
 * Le défilement reste un défilement natif avec accrochage : la molette, le
 * pavé tactile, le glissement du doigt et la tabulation continuent de
 * fonctionner sans code. Les boutons ne font que le piloter.
 */

/** Hauteur visée sur grand écran. Sert à calculer la largeur des diapositives. */
const TRACK_HEIGHT = 420;

export function ProjectGallery({
  images,
  locale,
}: {
  images: ProjectImage[];
  locale: Locale;
}) {
  const t = useTranslations("project");
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return;
    // `scrollIntoView` ferait aussi défiler la page verticalement sur certains
    // navigateurs ; on ne touche qu'au défilement horizontal de la piste.
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  /** Diapositive la plus proche du bord gauche, recalculée pendant le défilement. */
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    let closest = 0;
    let best = Infinity;
    for (let i = 0; i < track.children.length; i++) {
      const slide = track.children[i] as HTMLElement;
      const delta = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (delta < best) {
        best = delta;
        closest = i;
      }
    }
    setIndex(closest);
  }, []);

  const go = (delta: number) =>
    scrollTo(Math.min(images.length - 1, Math.max(0, index + delta)));

  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={0}
        className="hide-scrollbar flex snap-x snap-mandatory items-center gap-5 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollBehavior: reduced ? "auto" : undefined }}
        aria-label={t("gallery")}
      >
        {images.map((image, i) => {
          // Sans dimensions déclarées on retombe sur un rapport 16/10, qui est
          // celui d'une capture d'écran ordinaire.
          const ratio = image.width && image.height ? image.width / image.height : 1.6;
          return (
            <li
              key={image.src}
              className="shrink-0 snap-start overflow-hidden rounded-xl bg-surface-2"
              // La largeur vise la hauteur de référence, mais ne dépasse jamais
              // l'écran ; la hauteur suit ensuite le rapport de l'image. Fixer
              // la hauteur d'abord reviendrait à border de vide les captures
              // larges dès que la fenêtre devient étroite.
              style={{
                width: `min(${Math.round(TRACK_HEIGHT * ratio)}px, 88vw)`,
                aspectRatio: String(ratio),
              }}
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                width={image.width ?? 1600}
                height={image.height ?? 1000}
                sizes="(min-width: 1024px) 52rem, 88vw"
                className="size-full object-cover"
                priority={i === 0}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label={t("previousImage")}
            className="btn-round cursor-pointer disabled:cursor-default disabled:opacity-35"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= images.length - 1}
            aria-label={t("nextImage")}
            className="btn-round cursor-pointer disabled:cursor-default disabled:opacity-35"
          >
            <ArrowRightIcon />
          </button>
        </div>

        {/* La légende de la vue courante : une seule à l'écran, donc lisible,
            là où six légendes empilées sous une grille se lisaient mal. */}
        <p aria-live="polite" className="min-w-0 flex-1 text-sm text-muted-dim">
          <span className="tabular-nums">
            {index + 1}/{images.length}
          </span>
          {" · "}
          {images[index]?.alt[locale]}
        </p>
      </div>
    </div>
  );
}

/**
 * `useSyncExternalStore` plutôt qu'un effet : la valeur vient du navigateur,
 * pas d'un état React, et évite un rendu supplémentaire au montage.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
