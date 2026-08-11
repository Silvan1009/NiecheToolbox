/**
 * Thematische Gruppierung für /rechner/ – zusätzlich zur `ToolCategory` aus
 * types.ts, nicht als Ersatz.
 *
 * `category` ist eine Zuordnung (jedes Tool genau eine), diese Gruppen sind
 * eine Sicht: ein Rechner darf in mehreren stehen, wenn er thematisch dort
 * hingehört – der Immobilienrechner ist Geldfrage und Wohnfrage zugleich.
 * Reine Daten, kein Icon-Import: die Seite braucht kein Gruppen-Icon über
 * einem Raster aus bereits icon-bestückten Karten.
 */

export interface ToolGroup {
  slug: string;
  label: string;
  /** Ein echter Satz, keine Wiederholung des Labels. */
  hint: string;
  /** Tool-Slugs aus der Registry, in Anzeigereihenfolge. */
  tools: string[];
}

export const toolGroups: ToolGroup[] = [
  {
    slug: "geld",
    label: "Geld & Finanzen",
    hint: "Was etwas kostet, was es bringt und was es wirklich wert ist.",
    tools: [
      "bruttonetto",
      "sparplan",
      "rentenluecke",
      "rentenabschlag",
      "kreditrechner",
      "aktienkennzahlen",
      "immobilienrechner",
      "energiekosten",
      "stromkosten",
      "autokosten",
      "versicherungsvergleich",
      "erbschaftsteuer",
      "abfindung",
      "urlaubsbudget",
      "trinkgeld",
    ],
  },
  {
    slug: "familie",
    label: "Familie & Kinder",
    hint: "Was Kinder kosten, was der Staat dazugibt und wie sich beides planen lässt.",
    tools: [
      "geburtstermin",
      "kindergeld",
      "elterngeld",
      "elternzeit",
      "bruttonetto",
      "urlaubsbudget",
    ],
  },
  {
    slug: "gesundheit",
    label: "Gesundheit & Körper",
    hint: "BMI, Kalorienbedarf und der errechnete Geburtstermin – handfeste Zahlen zum eigenen Körper.",
    tools: ["bmi", "kalorienbedarf", "geburtstermin"],
  },
  {
    slug: "wohnen",
    label: "Wohnen & Verträge",
    hint: "Umziehen, kündigen und den Kauf einer eigenen Immobilie durchrechnen.",
    tools: [
      "umzug",
      "kuendigungsfrist",
      "immobilienrechner",
      "energiekosten",
      "stromkosten",
    ],
  },
  {
    slug: "arbeit",
    label: "Arbeit, Urlaub & Zeit",
    hint: "Urlaub planen, Fristen einhalten und Zeit realistisch einschätzen.",
    tools: [
      "arbeitstage",
      "brueckentage",
      "elternzeit",
      "kuendigungsfrist",
      "lesezeit",
    ],
  },
  {
    slug: "essen",
    label: "Essen & Feiern",
    hint: "Mengen, Rezepte und die Rechnung am Ende des Abends.",
    tools: ["backform", "partymengen", "trinkgeld"],
  },
];

/**
 * Tools, deren Unterseiten einzeln verlinkt und durchsuchbar sind.
 *
 * Nicht jede Variante gehört in die Suche. Bei Brückentagen und Arbeitstagen
 * sind es sechzehn Bundesländer mal drei Jahre – achtundvierzig Treffer, die
 * sich nur im Landesnamen unterscheiden und jede Suche unbrauchbar machen
 * würden. Bei diesen Tools hier ist jede Unterseite dagegen ein eigenes Thema
 * mit eigener Suchanfrage ("KGV berechnen", "Vorabpauschale", "Steuerklasse
 * 3"), und genau deshalb stehen sie einzeln im Index und unter der Karte
 * auf /rechner/.
 *
 * Wer hier ein Tool einträgt, muss dessen Varianten in lib/searchIndex.ts
 * ergänzen – searchIndex.test.ts prüft beide Richtungen.
 */
export const toolsWithIndexedVariants: string[] = [
  "aktienkennzahlen",
  "sparplan",
  "kreditrechner",
  "bruttonetto",
  "energiekosten",
  "urlaubsbudget",
  "kindergeld",
];
