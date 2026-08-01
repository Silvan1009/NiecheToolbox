/**
 * Zentrale Konfiguration. Alles, was sich ohne Code-Änderung an den Tools
 * nachjustieren lässt, steht hier: Name, Domain, Werbe-IDs, Affiliate-Links,
 * Analytics.
 *
 * Der Projektname steht hier einmal – er muss zur Domain passen. Ein Name,
 * der nicht zur Domain passt, ist bei der AdSense-Prüfung ein Negativsignal
 * ("site identity"), und Besucher lesen ihn als Hinweis auf eine geparkte
 * oder verwaiste Seite.
 */

const rawUrl = process.env.SITE_URL ?? "https://rechnerkiste.app";

export const site = {
  name: "Rechnerkiste",
  /** Für <title>-Suffixe und Footer. */
  shortName: "Rechnerkiste",
  tagline: "Kleine Rechner für echte Alltagsfragen.",
  // Bewusst ohne Aufzählung aller Tools: die Liste wächst, der Text nicht mit.
  description:
    "Kostenlose Mini-Rechner ohne Anmeldung für echte Alltagsfragen – Brückentage, Kündigungsfristen, Arbeitstage, Backformen, Umzug, Partymengen und Stromkosten. Alles rechnet direkt im Browser, jedes Ergebnis ist teilbar.",
  lang: "de",
  locale: "de-DE",
  /** Ohne abschließenden Slash. Für canonical-URLs, Sitemap und OG-Bilder. */
  url: rawUrl.replace(/\/+$/, ""),
  contactEmail: "comannsilvan@gmail.com",
} as const;

/**
 * Impressumsangaben (§ 5 DDG) und Verantwortlicher i. S. d. DSGVO.
 * ACHTUNG: Platzhalter. Vor dem Launch mit echten Daten füllen und
 * `isPlaceholder` auf false setzen – erst dann verschwindet der Warnhinweis
 * auf den Rechtsseiten.
 */
export const legal = {
  isPlaceholder: false,
  operator: {
    name: "Silvan Comann",
    company: "",
    street: "Raiffeisenstr. 13",
    zip: "84371",
    city: "Triftern",
    country: "Deutschland",
    email: site.contactEmail,
    phone: "",
    vatId: "",
  },
} as const;

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * Google AdSense samt zertifizierter Einwilligungsverwaltung.
 *
 * `enabled` bleibt false, bis das Konto freigeschaltet ist – ohne echte IDs
 * rendert der AdSlot nur einen erkennbaren Platzhalter und es lädt weder die
 * CMP noch ein Werbe-Skript.
 *
 * Die CMP ist Google Funding Choices. Sie braucht keine eigene Kennung: ihre
 * Publisher-ID ist dieselbe wie die von AdSense, nur ohne `ca-`-Präfix.
 *
 * ACHTUNG: `NEXT_PUBLIC_*` wird zur Buildzeit eingebacken. Das Umlegen von
 * `NEXT_PUBLIC_ADS_ENABLED` verlangt einen Rebuild *und* das Leeren des
 * ISR-Caches – sonst liegt bis zu 24 Stunden altes HTML ohne Bootstrap aus
 * (`revalidate = 86400` auf den Tool-Routen).
 */
export const ads = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  provider: "adsense",
  /** Format: "ca-pub-0000000000000000" */
  clientId: adsenseClient,
  /** Dieselbe Kennung ohne `ca-` – so erwarten CMP und ads.txt sie. */
  publisherId: adsenseClient.replace(/^ca-/, ""),
  /**
   * Testanzeigen auf einer Staging-Domain, ohne echte Auslieferung und ohne
   * Risiko für die Kontofreigabe. Setzt `data-adtest="on"` am Slot.
   */
  testMode: process.env.NEXT_PUBLIC_ADS_TEST === "true",
  cmp: {
    /** Zertifiziert nach IAB TCF v2.2 – Voraussetzung für AdSense im EWR. */
    provider: "google-funding-choices",
  },
  slots: {
    /** Hauptplatzierung: direkt unter dem Ergebnis. */
    belowResult: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_RESULT ?? "",
    /** Zweiter Slot, nur bei adDensity "medium": unter dem Erklärtext. */
    belowContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_CONTENT ?? "",
  },
} as const;

/** Datenschutzfreundliche, cookiefreie Analytics – läuft unabhängig vom Werbe-Consent. */
export const analytics = {
  provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none") as
    "none" | "umami" | "plausible",
  umami: {
    scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "",
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
  },
  plausible: {
    scriptUrl:
      process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
      "https://plausible.io/js/script.js",
    domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  },
} as const;

/**
 * Affiliate-Ziele. Die Tools referenzieren nur die Schlüssel, nie die URLs –
 * so lässt sich ein Partnerprogramm tauschen, ohne ein Tool anzufassen.
 * PLATZHALTER: echte Partner-/Tracking-Links eintragen.
 */
export const affiliate = {
  enabled: false,
  /** Pflicht-Kennzeichnung nach § 6 TMG / UWG. Wird an jedem Slot ausgegeben. */
  disclosureLabel: "Werbung",
  disclosureText:
    "Wenn du über diesen Link buchst, erhalten wir eine kleine Provision. Für dich bleibt der Preis gleich.",
  links: {
    kurzreisen: "https://example.com/partner/kurzreisen?ref=PLATZHALTER",
    hotels: "https://example.com/partner/hotels?ref=PLATZHALTER",
    bahn: "https://example.com/partner/bahn?ref=PLATZHALTER",
    mietwagen: "https://example.com/partner/mietwagen?ref=PLATZHALTER",
    haushaltsbuch: "https://example.com/partner/finanzen?ref=PLATZHALTER",
    hoerbuecher: "https://example.com/partner/hoerbuecher?ref=PLATZHALTER",
    elterngeldberatung:
      "https://example.com/partner/elterngeld?ref=PLATZHALTER",
    umzugskartons: "https://example.com/partner/umzugskartons?ref=PLATZHALTER",
    transporter: "https://example.com/partner/transporter?ref=PLATZHALTER",
    umzugsfirma: "https://example.com/partner/umzugsfirma?ref=PLATZHALTER",
    backformen: "https://example.com/partner/backformen?ref=PLATZHALTER",
    getraenkelieferung: "https://example.com/partner/getraenke?ref=PLATZHALTER",
    grillzubehoer: "https://example.com/partner/grill?ref=PLATZHALTER",
    stromvergleich: "https://example.com/partner/strom?ref=PLATZHALTER",
    gasvergleich: "https://example.com/partner/gas?ref=PLATZHALTER",
    strommessgeraet: "https://example.com/partner/messgeraet?ref=PLATZHALTER",
    reiseversicherung:
      "https://example.com/partner/reiseversicherung?ref=PLATZHALTER",
    steuersoftware:
      "https://example.com/partner/steuersoftware?ref=PLATZHALTER",
    mietrechtsschutz:
      "https://example.com/partner/rechtsschutz?ref=PLATZHALTER",
    baufinanzierung:
      "https://example.com/partner/baufinanzierung?ref=PLATZHALTER",
    immobilienbewertung:
      "https://example.com/partner/immobilienbewertung?ref=PLATZHALTER",
    depotvergleich: "https://example.com/partner/depot?ref=PLATZHALTER",
    aktienanalyse: "https://example.com/partner/aktienanalyse?ref=PLATZHALTER",
    kreditvergleich: "https://example.com/partner/kredit?ref=PLATZHALTER",
    umschuldung: "https://example.com/partner/umschuldung?ref=PLATZHALTER",
    kfzversicherung:
      "https://example.com/partner/kfzversicherung?ref=PLATZHALTER",
    haftpflichtversicherung:
      "https://example.com/partner/haftpflicht?ref=PLATZHALTER",
    berufsunfaehigkeitsversicherung:
      "https://example.com/partner/bu?ref=PLATZHALTER",
  },
} as const;

export type AffiliateKey = keyof typeof affiliate.links;

/** Auflösen eines Affiliate-Schlüssels zur konfigurierten URL. */
export function affiliateHref(key: AffiliateKey): string {
  return affiliate.links[key];
}
