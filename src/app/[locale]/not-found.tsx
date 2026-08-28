import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto grid min-h-[70svh] max-w-xl place-items-center px-6 text-center">
      <div>
        <p className="text-7xl font-extrabold tracking-tight text-accent">404</p>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">{t("description")}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-7 py-3 font-semibold text-white transition-colors hover:bg-accent-text hover:text-bg"
        >
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
