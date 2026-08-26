/**
 * URL publique du site. Vercel fournit VERCEL_PROJECT_PRODUCTION_URL en
 * production ; en local on retombe sur le serveur de développement.
 * À remplacer par le domaine définitif le jour où il est branché.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
