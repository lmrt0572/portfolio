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
 * L'élément `<video>` n'est monté qu'après un clic : avant, seule l'affiche
 * (une image) est chargée. La vidéo est ensuite servie par requêtes de plage
 * HTTP (`Range`), ce qui exige que l'index du MP4 soit en tête de fichier
 * (`-movflags +faststart`).
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
