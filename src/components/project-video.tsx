"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { ProjectVideo } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { PlayIcon } from "./icons";

/**
 * Lecteur de démonstration.
 *
 * Le point important n'est pas le lecteur mais ce qu'il ne fait pas. Un
 * `<video>` posé dans la page déclenche, selon le navigateur, le téléchargement
 * de l'en-tête et souvent des premières secondes — pour une démo que la plupart
 * des visiteurs ne lanceront jamais. Ici l'élément `<video>` n'existe pas tant
 * qu'on n'a pas cliqué : avant, la page ne charge que l'affiche, une image.
 *
 * Une fois monté, le navigateur télécharge la vidéo par tranches au moyen des
 * requêtes de plage HTTP (`Range`), gérées aussi bien par Vercel que par
 * GitHub Pages. C'est ce qui permet de lire immédiatement, de sauter en avant
 * sans attendre la fin, et de ne jamais rapatrier ce qui n'est pas regardé —
 * à une condition : que l'index du MP4 soit en tête de fichier. Sinon le
 * navigateur doit tout parcourir avant la première image.
 *
 * Encodage attendu :
 *   ffmpeg -i source.mkv -vf "scale=1280:-2" -c:v libx264 -crf 23 \
 *     -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k \
 *     -movflags +faststart demo.mp4
 *   ffmpeg -i source.mkv -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 34 \
 *     -b:v 0 -row-mt 1 -c:a libopus -b:a 96k demo.webm
 */
export function ProjectVideoPlayer({
  video,
  locale,
}: {
  video: ProjectVideo;
  locale: Locale;
}) {
  const t = useTranslations("project");
  const [playing, setPlaying] = useState(false);

  const aspect = video.aspect ?? "16 / 9";

  return (
    <figure>
      {/* La place est réservée par le rapport d'aspect : l'affiche et la vidéo
          occupent exactement la même surface, donc rien ne saute au moment du
          remplacement. */}
      <div
        className="relative overflow-hidden rounded-2xl bg-surface-2"
        style={{ aspectRatio: aspect }}
      >
        {playing ? (
          <video
            className="size-full"
            controls
            autoPlay
            playsInline
            preload="auto"
            poster={video.poster}
            aria-label={video.caption[locale]}
          >
            {/* WebM en premier : à qualité égale le fichier est plus léger, et
                les navigateurs qui ne le comprennent pas passent au MP4. */}
            {video.webm ? <source src={video.webm} type="video/webm" /> : null}
            <source src={video.mp4} type="video/mp4" />
            {video.captions ? (
              <track
                kind="captions"
                src={video.captions.src}
                srcLang={video.captions.srcLang}
                label={video.captions.label[locale]}
                default
              />
            ) : null}
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 size-full cursor-pointer"
            aria-label={t("playDemo")}
          >
            <Image
              src={video.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 52rem, 92vw"
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10 transition-colors group-hover:from-black/65"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            >
              <PlayIcon className="ml-1 size-8" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted-dim">
        {video.caption[locale]}
      </figcaption>
    </figure>
  );
}
