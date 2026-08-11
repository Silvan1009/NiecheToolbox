import { Gauge } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { energiekostenAffiliate } from "./affiliate";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Eine Energierechnung besteht aus zwei Teilen, und nur einer davon hängt am Verbrauch. Der Arbeitspreis wird je Kilowattstunde abgerechnet, der Grundpreis fällt monatlich an, egal ob der Zähler steht oder läuft. Dieser Rechner weist beides getrennt aus und rechnet daraus den Effektivpreis – den Mischpreis, in dem der Grundpreis auf die verbrauchten Kilowattstunden verteilt ist. Er ist die einzige Zahl, mit der sich zwei Tarife ehrlich vergleichen lassen.",
  "Genau daran scheitern die meisten Tarifvergleiche. Ein Angebot mit niedrigem Arbeitspreis und hohem Grundpreis gewinnt bei großem Verbrauch und verliert bei kleinem. Wer allein auf die Cent je Kilowattstunde schaut, wechselt als Einpersonenhaushalt regelmäßig in den teureren Tarif. Der Rechner zeigt deshalb beide Preise nebeneinander und lässt einen Vergleichstarif direkt gegenrechnen.",
  "Der Abschlag ist keine Rechnung, sondern eine Vorauszahlung auf Schätzbasis. Der richtige Abschlag ist ein Zwölftel der erwarteten Jahreskosten – alles darunter wird am Jahresende zur Nachzahlung, alles darüber zu einem zinslosen Kredit an den Versorger. Beide Richtungen lassen sich jederzeit anpassen. Die Differenz zwischen berechneten Kosten und gezahltem Abschlag ist die Zahl, wegen der die meisten Leute überhaupt rechnen.",
  "Wer seinen Jahresverbrauch nicht kennt, bekommt einen Erwartungswert. Beim Strom wächst er nicht linear mit der Haushaltsgröße: Die erste Person bringt rund 1.500 Kilowattstunden mit, jede weitere etwa 900, weil Kühlschrank, Router und Beleuchtung unabhängig von der Personenzahl laufen. Elektrisches Warmwasser aus einem Durchlauferhitzer schlägt mit weiteren 550 Kilowattstunden je Person zu Buche und ist der Posten, der die Spanne am stärksten verschiebt. Beim Gas zählen Wohnfläche und Dämmzustand, mit 60 bis 200 Kilowattstunden je Quadratmeter zwischen Neubau und unsaniertem Altbau.",
  "Dieser Erwartungswert steht im Ergebnis immer neben dem eingetragenen Verbrauch. Er ist keine Zielgröße, sondern eine Einordnung: Erst wenn klar ist, ob 4.800 Kilowattstunden für diesen Haushalt viel oder wenig sind, lässt sich entscheiden, ob der Tarif das Problem ist oder der Verbrauch. Liegt der eigene Wert mehr als die Hälfte darüber, weist der Rechner ausdrücklich darauf hin.",
  "Der CO₂-Wert ist eine Näherung. Für Strom rechnet er mit 380 Gramm je Kilowattstunde für den deutschen Strommix – ein Wert, der mit dem Ausbau der Erneuerbaren von Jahr zu Jahr sinkt. Für Gas sind es 201 Gramm, und dieser Wert bleibt, weil er aus der Verbrennung folgt und nicht aus einer Statistik. Als Größenordnung taugen beide, als Bilanz nicht.",
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wo finde ich Arbeitspreis, Grundpreis und Verbrauch?",
    answer:
      "Alle drei stehen auf der letzten Jahresabrechnung, meist auf der zweiten Seite unter „Berechnung des Rechnungsbetrags“. Der Arbeitspreis ist in Cent je Kilowattstunde angegeben, der Grundpreis als Betrag pro Monat oder Jahr – bei einer Jahresangabe durch zwölf teilen. Achte darauf, ob die Preise brutto oder netto ausgewiesen sind; für einen Haushalt ist immer der Bruttopreis der richtige.",
  },
  {
    question:
      "Was ist der Unterschied zwischen Arbeitspreis und Effektivpreis?",
    answer:
      "Der Arbeitspreis gilt je Kilowattstunde, der Effektivpreis rechnet den Grundpreis mit ein. Bei 3.000 Kilowattstunden und 144 Euro Grundpreis im Jahr sind das 4,80 Cent Unterschied – aus 35 Cent Arbeitspreis werden 39,80 Cent effektiv. Bei doppeltem Verbrauch halbiert sich dieser Aufschlag. Deshalb ist nur der Effektivpreis zwischen Tarifen vergleichbar.",
  },
  {
    question: "Wie hoch sollte mein Abschlag sein?",
    answer:
      "Ein Zwölftel der erwarteten Jahreskosten. Wichtig ist „erwartet“ und nicht „letztes Jahr“: Nach einer Preiserhöhung deckt der alte Abschlag die neuen Kosten nicht mehr, und genau daraus entstehen die dreistelligen Nachzahlungen. Der Rechner zeigt die Lücke, sobald der aktuelle Abschlag eingetragen ist.",
  },
  {
    question: "Warum weicht das Ergebnis von meiner Rechnung ab?",
    answer:
      "Meist aus einem von drei Gründen. Erstens ein Preiswechsel mitten im Abrechnungszeitraum – dann rechnet der Versorger zwei Zeiträume getrennt, dieser Rechner mit einem einheitlichen Preis. Zweitens ein Abrechnungszeitraum, der keine zwölf Monate umfasst. Drittens Boni oder Neukundenrabatte, die einmalig gegengerechnet werden und in keinem Arbeitspreis stecken.",
  },
  {
    question: "Rechnet der Rechner mit Umlagen, Steuern und Netzgebühren?",
    answer:
      "Sie sind bereits im Arbeitspreis und Grundpreis enthalten, die du eingibst – Netzentgelte, Konzessionsabgabe, Stromsteuer beziehungsweise CO₂-Preis und Mehrwertsteuer sind Teil des Bruttopreises auf der Rechnung. Deshalb braucht es hier keine eigenen Felder dafür.",
  },
  {
    question: "Wie rechne ich Kubikmeter Gas in Kilowattstunden um?",
    answer:
      "Kubikmeter mal Brennwert mal Zustandszahl. Beide Werte stehen auf der Jahresabrechnung; typisch sind ein Brennwert um 11 und eine Zustandszahl um 0,95, zusammen also rund 10,4 Kilowattstunden je Kubikmeter. Als Näherung ohne Rechnung zur Hand: Kubikmeter mal 10.",
  },
  {
    question: "Kann ich Strom und Gas zusammen rechnen?",
    answer:
      "Ja, dafür ist der Modus „Strom & Gas“ da. Beide bleiben aber getrennte Verträge mit eigenem Verbrauch, eigenem Preis und eigenem Abschlag – deshalb hat jede Sparte ihre eigenen Felder und ihre eigene Zwischensumme. Nur die Gesamtsumme und die Differenz zum Abschlag werden addiert.",
  },
  {
    question: "Was unterscheidet diesen Rechner vom Stromkosten-Rechner?",
    answer:
      "Der Stromkosten-Rechner beantwortet „was kostet mein Wäschetrockner im Jahr“ – er rechnet ein einzelnes Gerät aus Watt, Nutzungsdauer und Standby. Dieser Rechner geht vom anderen Ende heran: Er nimmt die Jahresabrechnung des ganzen Haushalts und prüft Preis, Abschlag und Verbrauch. Beide ergänzen sich, wenn eine hohe Rechnung erklärt werden soll.",
  },
];

export const energiekosten: ToolManifest = {
  slug: "energiekosten",
  name: "Energiekosten-Rechner",
  tagline:
    "Was die Jahresrechnung für Strom und Gas wirklich kostet – mit Grundpreis, Effektivpreis und der Nachzahlung, die aus dem Abschlag folgt.",
  // Bewusst "wohnen" und nicht "geld": der Stromkosten-Rechner steht schon in
  // "geld", und zwei Karten mit derselben Kategorie lesen sich wie Duplikate.
  category: "wohnen",
  icon: Gauge,
  status: "live",
  keywords: [
    "energiekosten berechnen",
    "stromkosten haushalt",
    "gaskosten berechnen",
    "abschlag berechnen",
    "nachzahlung strom",
    "effektivpreis kwh",
    "stromverbrauch haushalt",
    "gasverbrauch einfamilienhaus",
    "energiekosten pro monat",
    "tarifwechsel ersparnis",
  ],

  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: energiekostenAffiliate,
  },
};
