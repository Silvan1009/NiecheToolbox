/**
 * Zentrale Konfiguration. Alles, was sich ohne Code-Änderung an den Tools
 * nachjustieren lässt, steht hier: Name, Domain, Werbe-IDs, Affiliate-Links,
 * Analytics.
 *
 * Der Projektname ist ein Platzhalter – hier einmal ändern reicht.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuetzlich.tools";

export const site = {
  name: "Nützlich",
  /** Für <title>-Suffixe und Footer. */
  shortName: "Nützlich",
  tagline: "Kleine Rechner für echte Alltagsfragen.",
  // Bewusst ohne Aufzählung aller Tools: die Liste wächst, der Text nicht mit.
  description:
    "Kostenlose Mini-Rechner ohne Anmeldung für echte Alltagsfragen – Brückentage, Kündigungsfristen, Arbeitstage, Backformen, Umzug, Partymengen und Stromkosten. Alles rechnet direkt im Browser, jedes Ergebnis ist teilbar.",
  lang: "de",
  locale: "de-DE",
  /** Ohne abschließenden Slash. Für canonical-URLs, Sitemap und OG-Bilder. */
  url: rawUrl.replace(/\/+$/, ""),
  contactEmail: "kontakt@nuetzlich.tools",
} as const;

/**
 * Impressumsangaben (§ 5 DDG) und Verantwortlicher i. S. d. DSGVO.
 * ACHTUNG: Platzhalter. Vor dem Launch mit echten Daten füllen und
 * `isPlaceholder` auf false setzen – erst dann verschwindet der Warnhinweis
 * auf den Rechtsseiten.
 */
export const legal = {
  isPlaceholder: true,
  operator: {
    name: "PLATZHALTER Vor- und Nachname",
    company: "",
    street: "PLATZHALTER Straße und Hausnummer",
    zip: "PLATZHALTER PLZ",
    city: "PLATZHALTER Ort",
    country: "Deutschland",
    email: site.contactEmail,
    phone: "",
    vatId: "",
  },
} as const;

/**
 * Google AdSense. `enabled` bleibt false, bis das Konto freigeschaltet ist –
 * ohne echte IDs rendert der AdSlot nur einen erkennbaren Platzhalter.
 * Geladen wird ohnehin erst nach Einwilligung (siehe lib/consent.ts).
 */
export const ads = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  provider: "adsense",
  /** Format: "ca-pub-0000000000000000" */
  clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
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
    | "none"
    | "umami"
    | "plausible",
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
  enabled: true,
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
    elterngeldberatung: "https://example.com/partner/elterngeld?ref=PLATZHALTER",
    umzugskartons: "https://example.com/partner/umzugskartons?ref=PLATZHALTER",
    transporter: "https://example.com/partner/transporter?ref=PLATZHALTER",
    umzugsfirma: "https://example.com/partner/umzugsfirma?ref=PLATZHALTER",
    backformen: "https://example.com/partner/backformen?ref=PLATZHALTER",
    getraenkelieferung: "https://example.com/partner/getraenke?ref=PLATZHALTER",
    grillzubehoer: "https://example.com/partner/grill?ref=PLATZHALTER",
    stromvergleich: "https://example.com/partner/strom?ref=PLATZHALTER",
    strommessgeraet: "https://example.com/partner/messgeraet?ref=PLATZHALTER",
    mietrechtsschutz: "https://example.com/partner/rechtsschutz?ref=PLATZHALTER",
  },
} as const;

export type AffiliateKey = keyof typeof affiliate.links;

/** Auflösen eines Affiliate-Schlüssels zur konfigurierten URL. */
export function affiliateHref(key: AffiliateKey): string {
  return affiliate.links[key];
}
