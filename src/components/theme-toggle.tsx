"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const EVENT = "themechange";

/**
 * Script exécuté avant le premier rendu, injecté dans le `<head>`.
 *
 * Sans lui la page s'afficherait en sombre puis basculerait en clair une fois
 * React monté — un clignotement très visible. Il lit la préférence enregistrée
 * et pose l'attribut avant que le navigateur ne peigne quoi que ce soit.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

/**
 * Le thème vit dans le DOM (attribut sur `<html>`), pas dans un état React :
 * c'est le script ci-dessus qui le pose en premier. `useSyncExternalStore` est
 * fait pour s'abonner à une source extérieure comme celle-ci, et évite un
 * `setState` dans un effet.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/** Le rendu serveur ne connaît pas la préférence : il part du défaut. */
function getServerSnapshot(): Theme {
  return "dark";
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="10" cy="10" r="3.6" />
      <path d="M10 1.6v2M10 16.4v2M18.4 10h-2M3.6 10h-2M15.9 4.1l-1.4 1.4M5.5 14.5l-1.4 1.4M15.9 15.9l-1.4-1.4M5.5 5.5L4.1 4.1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = useTranslations("theme");

  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Navigation privée ou stockage refusé : la bascule vaut pour la session.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t(next === "light" ? "toLight" : "toDark")}
      title={t(next === "light" ? "toLight" : "toDark")}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-line text-muted transition-colors hover:border-accent hover:text-accent-text"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
