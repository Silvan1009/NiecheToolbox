import type { NextConfig } from "next";

/**
 * Statischer Export fürs IONOS-Shared-Webhosting: kein Node.js-Server, nur
 * Apache/FTP. Security-Header laufen deshalb nicht mehr hier (headers() wird
 * bei output: "export" nicht unterstützt), sondern als .htaccess-Direktiven,
 * erzeugt von scripts/generate-htaccess.ts.
 */
/*
 * Kein `experimental.inlineCss`. Es stand hier einmal mit der Begründung, das
 * Stylesheet sei „klein (~8 KB)“ – das war die gzip-Größe. Auf Platte sind es
 * 37 KB, und IONOS rechnet die Quota unkomprimiert. Das Flag dupliziert das
 * Stylesheet laut Next-Doku „once within <style> tags for SSR and once in the
 * RSC payload“; bei 121 vorgerenderten Seiten landete es 963-mal im Export und
 * blähte ihn um 34 MiB auf – über die 47,7-MiB-Grenze von Deploy Now.
 *
 * Die Doku nennt genau diesen Fall als Argument gegen Inlining: „Many pages
 * sharing styles – external stylesheets cached on one page speed up navigation
 * to other pages.“ Als <link> wird das Stylesheet einmal geladen und gilt dann
 * für alle Tool-Seiten.
 */
const nextConfig: NextConfig = {
  output: "export",
  /*
   * Pflicht auf Apache, nicht Geschmackssache.
   *
   * Ohne diese Zeile exportiert Next die Tool-Seite als `tools/foo.html` und
   * legt *daneben* ein gleichnamiges Verzeichnis `tools/foo/` mit den
   * RSC-Payloads ab. Apache löst `/tools/foo` dann auf das Verzeichnis auf,
   * mod_dir schickt einen 301 auf `/tools/foo/`, dort liegt kein Index – und
   * jede Unterseite antwortet mit 403. Genau daran ist die erste
   * AdSense-Prüfung gescheitert: erreichbar war nur die Startseite.
   *
   * Per .htaccess ist das nicht zuverlässig zu reparieren: mod_rewrite-Regeln
   * aus dem Wurzel-Verzeichnis gelten nicht in Unterverzeichnissen (auch nicht
   * mit `RewriteOptions InheritDown`), und `DirectorySlash Off` verlangt ein
   * `AllowOverride Indexes`, das Shared Hosting nicht garantiert – fehlt es,
   * antwortet Apache auf *jede* Anfrage mit 500. Beides in Docker gegen
   * httpd:2.4 nachgestellt.
   *
   * Mit `trailingSlash` schreibt Next `tools/foo/index.html`. Damit gibt es
   * keine Kollision mehr, und Apache liefert die Seite über DirectoryIndex
   * ganz von selbst aus – ohne eine einzige Rewrite-Regel.
   */
  trailingSlash: true,
};

export default nextConfig;
