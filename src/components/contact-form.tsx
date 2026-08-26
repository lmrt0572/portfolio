import { getTranslations } from "next-intl/server";

/**
 * Formulaire de contact, repris de l'ancien site : il postait déjà vers
 * Formspree, ce qui évite tout code serveur et garde le site exportable en
 * statique. Le `_subject` et le champ anti-robot sont ajoutés.
 */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbljzkzz";

export async function ContactForm() {
  const t = await getTranslations("form");

  const fields = [
    { name: "name", label: t("name"), type: "text", autoComplete: "name", required: true },
    { name: "email", label: t("email"), type: "email", autoComplete: "email", required: true },
    { name: "phone", label: t("phone"), type: "tel", autoComplete: "tel", required: false },
    { name: "subject", label: t("subject"), type: "text", autoComplete: "off", required: true },
  ] as const;

  return (
    <form
      action={FORMSPREE_ENDPOINT}
      method="POST"
      className="rounded-2xl bg-surface-2 p-6 sm:p-9"
    >
      <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
        {t("heading")} <span className="text-accent-text">{t("headingAccent")}</span>
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="grid gap-2">
            <label
              htmlFor={`contact-${field.name}`}
              className="text-sm font-semibold text-muted"
            >
              {field.label}
              {field.required ? (
                <span className="ml-1 text-accent-text" aria-hidden>
                  *
                </span>
              ) : null}
            </label>
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              className="rounded-lg border-2 border-bg bg-bg px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted-dim focus:border-accent"
            />
          </div>
        ))}

        <div className="grid gap-2 sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="text-sm font-semibold text-muted"
          >
            {t("message")}
            <span className="ml-1 text-accent-text" aria-hidden>
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={7}
            className="resize-none rounded-lg border-2 border-bg bg-bg px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted-dim focus:border-accent"
          />
        </div>
      </div>

      {/* Sujet de l'e-mail reçu, et piège à robots (invisible, jamais rempli
          par un humain — Formspree ignore l'envoi s'il l'est). */}
      <input type="hidden" name="_subject" value="Portfolio — nouveau message" />
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="mt-8 text-center">
        <button type="submit" className="btn cursor-pointer">
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
