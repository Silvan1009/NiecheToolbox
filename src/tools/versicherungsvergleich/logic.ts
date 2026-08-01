/**
 * Versicherungs-Vergleichsrechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Anders als die übrigen Rechner dieser Seite gibt es hier keine Formel, die
 * ein exaktes Ergebnis liefert – eine Versicherungsprämie legt jeder
 * Versicherer selbst fest, nach eigenen, nicht veröffentlichten Tarifwerken.
 * Was es gibt, sind Marktdurchschnitte und gut dokumentierte Richtungen: eine
 * hohe Schadenfreiheitsklasse senkt die Kfz-Prämie immer, ein riskanterer Beruf
 * erhöht die BU-Prämie immer. Dieser Rechner bildet genau das ab – einen
 * Marktdurchschnitt als Ausgangspunkt (Quellen: Verivox-Kfz-Versicherungsreport
 * und Finanztip-Tarifvergleiche, Stand Juli 2026) und darauf angewandte
 * Richtungsfaktoren, deren Größenordnung an veröffentlichten Beispielrechnungen
 * kalibriert ist. Das Ergebnis ist eine Spanne zur Einordnung, keine Offerte.
 *
 * Gerechnet wird in ganzen Cent, damit sich über mehrere multiplizierte
 * Faktoren kein Rundungsfehler einschleicht.
 */

import { cents, clamp, nn, toEuro } from "@/lib/finanzmath";

export type VersicherungsArt = "kfz" | "haftpflicht" | "bu";

export type Einordnung = "guenstig" | "im-rahmen" | "erhoeht" | "deutlich-erhoeht";

export interface Faktor {
  label: string;
  wert: string;
  /** z. B. "+30 %" oder "−45 %" – Wirkung auf die Schätzung gegenüber dem Durchschnittsprofil. */
  effekt: string;
}

export interface SchaetzungResult {
  art: VersicherungsArt;
  /** "jahr" für Kfz und Haftpflicht, "monat" für die BU-Rente. */
  zeitraum: "jahr" | "monat";
  richtwert: number;
  spanneMin: number;
  spanneMax: number;
  eigenerBeitrag: number | null;
  einordnung: Einordnung | null;
  faktoren: Faktor[];
  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Gemeinsame Hilfsfunktionen
 * ------------------------------------------------------------------------- */

function rundeEuro(betragC: number): number {
  return toEuro(Math.round(betragC / 100) * 100);
}

function einordnen(
  eigenerBeitragC: number | null,
  minC: number,
  maxC: number,
): Einordnung | null {
  if (eigenerBeitragC === null || eigenerBeitragC <= 0) return null;
  if (eigenerBeitragC < minC) return "guenstig";
  if (eigenerBeitragC <= maxC) return "im-rahmen";
  if (eigenerBeitragC <= maxC * 1.3) return "erhoeht";
  return "deutlich-erhoeht";
}

/* ---------------------------------------------------------------------------
 * Kfz-Versicherung
 * ------------------------------------------------------------------------- */

export type KfzDeckung = "haftpflicht" | "teilkasko" | "vollkasko";
export type KfzSfKlasse = "einsteiger" | "wenig" | "mittel" | "erfahren" | "maximal";
export type KfzRegion = "guenstig" | "mittel" | "teuer";
export type KfzFahrzeug = "klein" | "mittel" | "ober" | "sport";
export type KfzAlter = "unter23" | "23bis30" | "30bis60" | "ueber60";
export type KfzFahrleistung = "wenig" | "mittel" | "viel";

export interface KfzInput {
  deckung: KfzDeckung;
  sfKlasse: KfzSfKlasse;
  region: KfzRegion;
  fahrzeug: KfzFahrzeug;
  fahrerAlter: KfzAlter;
  kmProJahr: KfzFahrleistung;
  eigenerBeitragJahr: number;
}

/** Marktdurchschnitt in Euro/Jahr – Verivox-Kfz-Versicherungsreport 2026: Haftpflicht Ø 260 €, + Teilkasko Ø 190 €, + Vollkasko Ø 330 €. */
const KFZ_BASIS_EURO: Record<KfzDeckung, number> = {
  haftpflicht: 260,
  teilkasko: 260 + 190,
  vollkasko: 260 + 330,
};

export const kfzDeckungLabels: Record<KfzDeckung, string> = {
  haftpflicht: "Haftpflicht",
  teilkasko: "Haftpflicht + Teilkasko",
  vollkasko: "Haftpflicht + Vollkasko",
};

/**
 * Schadenfreiheitsrabatte unterscheiden sich je Versicherer teils deutlich –
 * diese Bänder bilden nur die Größenordnung ab, nicht die Tabelle eines
 * bestimmten Anbieters. "mittel" ist die Basis (Faktor 1), weil der
 * recherchierte Marktdurchschnitt selbst schon überwiegend erfahrene Fahrer
 * mit gemischter Einstufung enthält.
 */
const KFZ_SF_FAKTOR: Record<KfzSfKlasse, number> = {
  einsteiger: 2.2,
  wenig: 1.3,
  mittel: 1,
  erfahren: 0.75,
  maximal: 0.55,
};

export const kfzSfLabels: Record<KfzSfKlasse, string> = {
  einsteiger: "Einsteiger (SF 0)",
  wenig: "Wenige Jahre unfallfrei (SF 1–8)",
  mittel: "Durchschnittlich erfahren (SF 9–19)",
  erfahren: "Sehr erfahren (SF 20–29)",
  maximal: "Maximal eingestuft (SF 30+)",
};

const KFZ_REGION_FAKTOR: Record<KfzRegion, number> = {
  guenstig: 0.85,
  mittel: 1,
  teuer: 1.3,
};

export const kfzRegionLabels: Record<KfzRegion, string> = {
  guenstig: "Günstige Region",
  mittel: "Durchschnittliche Region",
  teuer: "Teure Region (Großstadt)",
};

const KFZ_FAHRZEUG_FAKTOR: Record<KfzFahrzeug, number> = {
  klein: 0.85,
  mittel: 1,
  ober: 1.25,
  sport: 1.6,
};

export const kfzFahrzeugLabels: Record<KfzFahrzeug, string> = {
  klein: "Kleinwagen",
  mittel: "Kompakt- / Mittelklasse",
  ober: "Oberklasse / SUV",
  sport: "Sportwagen",
};

const KFZ_ALTER_FAKTOR: Record<KfzAlter, number> = {
  unter23: 1.6,
  "23bis30": 1.15,
  "30bis60": 1,
  ueber60: 0.95,
};

export const kfzAlterLabels: Record<KfzAlter, string> = {
  unter23: "unter 23 Jahre",
  "23bis30": "23 bis 30 Jahre",
  "30bis60": "30 bis 60 Jahre",
  ueber60: "über 60 Jahre",
};

const KFZ_KM_FAKTOR: Record<KfzFahrleistung, number> = {
  wenig: 0.9,
  mittel: 1,
  viel: 1.15,
};

export const kfzKmLabels: Record<KfzFahrleistung, string> = {
  wenig: "unter 8.000 km/Jahr",
  mittel: "8.000–15.000 km/Jahr",
  viel: "über 15.000 km/Jahr",
};

function effektText(faktor: number): string {
  const prozent = Math.round((faktor - 1) * 100);
  if (prozent === 0) return "Basis";
  return prozent > 0 ? `+${prozent} %` : `${prozent} %`;
}

export function calculateKfz(input: KfzInput): SchaetzungResult {
  const sfFaktor = KFZ_SF_FAKTOR[input.sfKlasse];
  const regionFaktor = KFZ_REGION_FAKTOR[input.region];
  const fahrzeugFaktor = KFZ_FAHRZEUG_FAKTOR[input.fahrzeug];
  const alterFaktor = KFZ_ALTER_FAKTOR[input.fahrerAlter];
  const kmFaktor = KFZ_KM_FAKTOR[input.kmProJahr];

  const basisC = cents(KFZ_BASIS_EURO[input.deckung]);
  const gesamtFaktor = sfFaktor * regionFaktor * fahrzeugFaktor * alterFaktor * kmFaktor;
  const richtwertC = basisC * gesamtFaktor;

  const spanneMinC = richtwertC * 0.8;
  const spanneMaxC = richtwertC * 1.2;

  const eigenerC = input.eigenerBeitragJahr > 0 ? cents(nn(input.eigenerBeitragJahr)) : null;

  const warnings: string[] = [];
  if (input.sfKlasse === "einsteiger") {
    warnings.push(
      "Als Einsteiger lohnt sich vor dem ersten eigenen Vertrag ein Blick auf die Mitversicherung als Zweitfahrer bei einem Elternteil oder Partner – das vermeidet die teure Startklasse SF 0 und ist bei vielen Versicherern möglich.",
    );
  }
  if (eigenerC !== null && eigenerC > spanneMaxC * 1.3) {
    warnings.push(
      "Die eigene Prämie liegt deutlich über der geschätzten Spanne für dieses Profil. Das ist ein guter Anlass für einen Tarifvergleich – bei gleicher Deckung unterscheiden sich Kfz-Versicherer teils um mehrere Hundert Euro im Jahr.",
    );
  }

  return {
    art: "kfz",
    zeitraum: "jahr",
    richtwert: rundeEuro(richtwertC),
    spanneMin: rundeEuro(spanneMinC),
    spanneMax: rundeEuro(spanneMaxC),
    eigenerBeitrag: eigenerC === null ? null : toEuro(eigenerC),
    einordnung: einordnen(eigenerC, spanneMinC, spanneMaxC),
    faktoren: [
      { label: "Deckung", wert: kfzDeckungLabels[input.deckung], effekt: "Basis" },
      {
        label: "Schadenfreiheitsklasse",
        wert: kfzSfLabels[input.sfKlasse],
        effekt: effektText(sfFaktor),
      },
      { label: "Region", wert: kfzRegionLabels[input.region], effekt: effektText(regionFaktor) },
      {
        label: "Fahrzeug",
        wert: kfzFahrzeugLabels[input.fahrzeug],
        effekt: effektText(fahrzeugFaktor),
      },
      {
        label: "Alter der fahrenden Person",
        wert: kfzAlterLabels[input.fahrerAlter],
        effekt: effektText(alterFaktor),
      },
      {
        label: "Fahrleistung",
        wert: kfzKmLabels[input.kmProJahr],
        effekt: effektText(kmFaktor),
      },
    ],
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Privathaftpflichtversicherung
 * ------------------------------------------------------------------------- */

export type HaftpflichtPersonenkreis = "single" | "paar" | "familie";

export interface HaftpflichtInput {
  personenkreis: HaftpflichtPersonenkreis;
  mitSelbstbeteiligung: boolean;
  eigenerBeitragJahr: number;
}

/** Typischer Jahresbeitrag und Marktspanne – Finanztip-Tarifvergleich, Stand Juli 2026. */
const HAFTPFLICHT_BASIS: Record<
  HaftpflichtPersonenkreis,
  { typisch: number; min: number; max: number }
> = {
  single: { typisch: 35, min: 20, max: 70 },
  paar: { typisch: 45, min: 25, max: 90 },
  familie: { typisch: 60, min: 35, max: 120 },
};

export const haftpflichtPersonenkreisLabels: Record<HaftpflichtPersonenkreis, string> = {
  single: "Single",
  paar: "Paar",
  familie: "Familie",
};

export function calculateHaftpflicht(input: HaftpflichtInput): SchaetzungResult {
  const basis = HAFTPFLICHT_BASIS[input.personenkreis];
  const sbFaktor = input.mitSelbstbeteiligung ? 0.9 : 1;

  const richtwertC = cents(basis.typisch) * sbFaktor;
  const spanneMinC = cents(basis.min) * sbFaktor;
  const spanneMaxC = cents(basis.max) * sbFaktor;

  const eigenerC = input.eigenerBeitragJahr > 0 ? cents(nn(input.eigenerBeitragJahr)) : null;

  const warnings: string[] = [];
  if (!input.mitSelbstbeteiligung) {
    warnings.push(
      "Eine Selbstbeteiligung von 150 bis 250 Euro senkt die Prämie meist um 10 Prozent oder mehr, weil Kleinschäden ohnehin selten über die Versicherung laufen. Bei einer so günstigen Versicherung lohnt sich das fast immer.",
    );
  }

  return {
    art: "haftpflicht",
    zeitraum: "jahr",
    richtwert: rundeEuro(richtwertC),
    spanneMin: rundeEuro(spanneMinC),
    spanneMax: rundeEuro(spanneMaxC),
    eigenerBeitrag: eigenerC === null ? null : toEuro(eigenerC),
    einordnung: einordnen(eigenerC, spanneMinC, spanneMaxC),
    faktoren: [
      {
        label: "Personenkreis",
        wert: haftpflichtPersonenkreisLabels[input.personenkreis],
        effekt: "Basis",
      },
      {
        label: "Selbstbeteiligung",
        wert: input.mitSelbstbeteiligung ? "vereinbart" : "keine",
        effekt: effektText(sbFaktor),
      },
    ],
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Berufsunfähigkeitsversicherung
 * ------------------------------------------------------------------------- */

export type BuRisikogruppe = "niedrig" | "mittel" | "hoch";
export type BuAltersband = "unter30" | "30bis39" | "40bis49" | "ab50";

export interface BuInput {
  alterBeiEintritt: number;
  buRenteMonat: number;
  risikogruppe: BuRisikogruppe;
  eigenerBeitragMonat: number;
}

/** Monatsbeitrag je 1.000 € BU-Rente, Risikogruppe niedrig, Eintritt mit 30 – kalibriert an veröffentlichten Beispielrechnungen (u. a. Finanztip, Allianz). */
const BU_BASIS_PRO_1000 = 30;

const BU_RISIKO_FAKTOR: Record<BuRisikogruppe, number> = {
  niedrig: 1,
  mittel: 1.7,
  hoch: 3.3,
};

export const buRisikogruppeLabels: Record<BuRisikogruppe, string> = {
  niedrig: "Niedrig – Büro, akademischer Beruf",
  mittel: "Mittel – kaufmännisch, leichte körperliche Tätigkeit",
  hoch: "Hoch – Handwerk, körperlich fordernder Beruf",
};

function buAltersband(alter: number): BuAltersband {
  if (alter < 30) return "unter30";
  if (alter < 40) return "30bis39";
  if (alter < 50) return "40bis49";
  return "ab50";
}

const BU_ALTER_FAKTOR: Record<BuAltersband, number> = {
  unter30: 0.8,
  "30bis39": 1,
  "40bis49": 1.7,
  ab50: 2.8,
};

const BU_ALTER_LABEL: Record<BuAltersband, string> = {
  unter30: "unter 30 Jahre",
  "30bis39": "30 bis 39 Jahre",
  "40bis49": "40 bis 49 Jahre",
  ab50: "50 Jahre oder älter",
};

export function calculateBu(input: BuInput): SchaetzungResult {
  const alter = Math.round(clamp(input.alterBeiEintritt, 18, 60));
  const buRenteMonat = clamp(input.buRenteMonat, 500, 5000);

  const altersband = buAltersband(alter);
  const alterFaktor = BU_ALTER_FAKTOR[altersband];
  const risikoFaktor = BU_RISIKO_FAKTOR[input.risikogruppe];

  const richtwertC = cents((buRenteMonat / 1000) * BU_BASIS_PRO_1000) * risikoFaktor * alterFaktor;
  const spanneMinC = richtwertC * 0.7;
  const spanneMaxC = richtwertC * 1.4;

  const eigenerC = input.eigenerBeitragMonat > 0 ? cents(nn(input.eigenerBeitragMonat)) : null;

  const warnings: string[] = [
    "Die tatsächliche Prämie hängt bei einer Berufsunfähigkeitsversicherung stärker als bei jeder anderen Versicherung von individuellen Faktoren ab – vor allem Gesundheitsfragen, Rauchstatus und dem genauen, nicht nur grob eingeordneten Beruf. Diese Schätzung ersetzt keine Risikoprüfung durch einen Versicherer.",
  ];

  if (input.risikogruppe === "hoch") {
    warnings.push(
      "Bei körperlich fordernden Berufen lohnt sich ein Vergleich mehrerer Versicherer besonders: Die Einstufung in Berufsgruppen unterscheidet sich zwischen Anbietern teils erheblich, und schon eine Gruppe Unterschied kann den Beitrag deutlich verändern.",
    );
  }

  return {
    art: "bu",
    zeitraum: "monat",
    richtwert: rundeEuro(richtwertC),
    spanneMin: rundeEuro(spanneMinC),
    spanneMax: rundeEuro(spanneMaxC),
    eigenerBeitrag: eigenerC === null ? null : toEuro(eigenerC),
    einordnung: einordnen(eigenerC, spanneMinC, spanneMaxC),
    faktoren: [
      { label: "BU-Rente", wert: `${Math.round(buRenteMonat)} €/Monat`, effekt: "Basis" },
      {
        label: "Risikogruppe",
        wert: buRisikogruppeLabels[input.risikogruppe],
        effekt: effektText(risikoFaktor),
      },
      {
        label: "Alter bei Eintritt",
        wert: BU_ALTER_LABEL[altersband],
        effekt: effektText(alterFaktor),
      },
    ],
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Voreinstellungen
 * ------------------------------------------------------------------------- */

export function defaultKfzInput(): KfzInput {
  return {
    deckung: "teilkasko",
    sfKlasse: "mittel",
    region: "mittel",
    fahrzeug: "mittel",
    fahrerAlter: "30bis60",
    kmProJahr: "mittel",
    eigenerBeitragJahr: 0,
  };
}

export function defaultHaftpflichtInput(): HaftpflichtInput {
  return {
    personenkreis: "familie",
    mitSelbstbeteiligung: false,
    eigenerBeitragJahr: 0,
  };
}

export function defaultBuInput(): BuInput {
  return {
    alterBeiEintritt: 30,
    buRenteMonat: 1500,
    risikogruppe: "mittel",
    eigenerBeitragMonat: 0,
  };
}
