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
};

export default nextConfig;
