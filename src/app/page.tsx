import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * `/` renvoie vers la langue par défaut. Pour un export statique, remplacer
 * cette redirection par une page contenant une balise meta refresh.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
