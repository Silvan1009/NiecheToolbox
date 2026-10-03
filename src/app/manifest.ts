import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/**
 * Web-App-Manifest: Name, Farben und Symbole für „Zum Startbildschirm
 * hinzufügen“ und für die Tab-Darstellung auf Mobilgeräten.
 *
 * `display: "browser"`: Die Seite ist eine Sammlung von Rechnern, die man über
 * Suchmaschine und Link erreicht – keine App, die Adressleiste und
 * Zurück-Knopf verstecken sollte.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "de",
    start_url: "/",
    display: "browser",
    background_color: "#fbfbfe",
    theme_color: "#fbfbfe",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
