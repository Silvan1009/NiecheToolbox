"use client";

/**
 * Favoriten, vorerst rein im Browser gespeichert – kein Konto, kein Server.
 *
 * Gleiches Muster wie components/consent/useConsent.ts: ein modulglobaler
 * Zustand, den useSyncExternalStore an React anschließt. So bleiben alle
 * ToolCards auf der Seite sofort synchron, ganz ohne Context-Provider.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "rechnerkiste:favorites";

type Listener = () => void;
const listeners = new Set<Listener>();

/** Stabile Referenz nötig, sonst hält useSyncExternalStore sie für "immer neu". */
let current: string[] = [];
let loaded = false;

function readFromStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * Lädt einmalig aus localStorage und hört auf Änderungen aus anderen Tabs.
 *
 * Erst beim ersten Abonnenten (nach dem Mount) – im SSR-HTML gibt es nie
 * Favoriten, sonst würde die erste Client-Fassung vom Server-HTML abweichen.
 */
function ensureLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  current = readFromStorage();

  window.addEventListener("storage", (event) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    current = readFromStorage();
    notify();
  });
}

function persist(next: string[]): void {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Privater Modus oder voller Speicher: Favorit gilt nur für diese Sitzung.
  }
  notify();
}

export function toggleFavorite(slug: string): void {
  ensureLoaded();
  const next = current.includes(slug)
    ? current.filter((entry) => entry !== slug)
    : [...current, slug];
  persist(next);
}

function subscribe(listener: Listener): () => void {
  ensureLoaded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): string[] {
  return current;
}

/** Immer leer: Favoriten sind Browser-Zustand, nie Teil des SSR-HTML. */
function getServerSnapshot(): string[] {
  return [];
}

export function useFavorites(): {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
} {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { favorites, toggleFavorite };
}
