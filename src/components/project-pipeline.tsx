import type { PipelineStep } from "@/content/types";
import type { Locale } from "@/i18n/routing";

/**
 * Chaîne de traitement en étapes numérotées, reliées par un filet vertical.
 * La numérotation encode ici une vraie séquence — chaque étape consomme la
 * sortie de la précédente — et n'est donc pas décorative.
 */
export function ProjectPipeline({
  steps,
  locale,
}: {
  steps: PipelineStep[];
  locale: Locale;
}) {
  return (
    <ol className="relative grid gap-6">
      {steps.map((step, i) => (
        <li key={step.id} className="relative flex gap-5 sm:gap-7">
          <div className="flex flex-col items-center">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-accent bg-surface-2 text-lg font-extrabold text-accent-text">
              {i + 1}
            </span>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="mt-2 w-0.5 flex-1 rounded-full bg-line"
              />
            ) : null}
          </div>

          <div className="pb-2">
            <h3 className="text-xl font-bold leading-snug sm:text-2xl">
              {step.title[locale]}
            </h3>
            <p className="mt-2 leading-relaxed text-muted">
              {step.body[locale]}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
