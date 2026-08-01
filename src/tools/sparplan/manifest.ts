import { TrendingUp } from "lucide-react";
import type { FaqEntry, ToolManifest, ToolVariant } from "@/tools/types";
import { sparplanAffiliate } from "./affiliate";
import Component from "./Component";
import { variantenTexte } from "./varianten";

/* ---------------------------------------------------------------------------
 * Inhalte
 * ------------------------------------------------------------------------- */

const about: string[] = [
  "Ein Sparplan-Rechner mit drei Feldern liefert eine Zahl, die zu hoch ist. Er rechnet die Rendite auf die Einzahlungen und hört dann auf – dabei stehen zwischen dem Bruttowert und dem Geld, über das man am Ende verfügt, drei Posten: die laufenden Kosten des Fonds, die Steuer auf den Gewinn und die Inflation. Dieser Rechner nimmt alle drei mit und weist das Ergebnis deshalb vierfach aus: als Depotwert, nach Steuern, in heutiger Kaufkraft und als monatliche Entnahme, die daraus später möglich ist.",
  "Die laufenden Kosten sind der am meisten unterschätzte Posten, weil sie klein aussehen. Ein Prozent Gebühr klingt nach einem Prozent weniger Rendite – tatsächlich kosten sie über dreißig Jahre rund ein Viertel des Endkapitals. Der Grund ist, dass die Gebühr nicht einmalig auf die Einzahlung wirkt, sondern jedes Jahr auf den gesamten Bestand, und dieser Bestand wächst. Bei 250 Euro im Monat über dreißig Jahre ist der Unterschied zwischen einem ETF mit 0,2 Prozent und einem Fonds mit 1,5 Prozent 60.357 Euro – bei 90.000 Euro Einzahlung.",
  "Steuerlich ist seit 2018 zweierlei zu unterscheiden. Am Ende, beim Verkauf, fallen 25 Prozent Abgeltungsteuer plus Solidaritätszuschlag auf den Gewinn an, bei Aktienfonds gemindert um die Teilfreistellung von 30 Prozent – effektiv also rund 18,5 Prozent. Während der Laufzeit greift zusätzlich die Vorabpauschale: Der Staat besteuert jedes Jahr einen pauschalen Mindestertrag, auch wenn nichts ausgeschüttet wurde. Sie wird im Januar vom Verrechnungskonto eingezogen und am Ende gegen die Verkaufssteuer angerechnet, sodass derselbe Ertrag nicht zweimal besteuert wird. Der Rechner bildet beide Schritte nach.",
  "Die Inflation gehört in jede Rechnung über lange Zeiträume, weil sie sonst systematisch zu optimistisch ausfällt. Hunderttausend Euro in dreißig Jahren sind bei zwei Prozent Geldentwertung so viel wert wie heute 55.000 Euro. Das macht das Sparen nicht sinnlos – im Gegenteil, es ist genau das Argument gegen das Sparbuch. Aber es verschiebt die Zielzahl: Wer im Ruhestand über eine bestimmte Kaufkraft verfügen will, muss nominal deutlich höher zielen.",
  "Ein Sparplan endet nicht mit dem Endkapital, sondern mit der Frage, was sich daraus entnehmen lässt. Der Rechner weist deshalb zwei Beträge aus: die monatliche Entnahme, die das Kapital über einen gewählten Zeitraum vollständig aufbraucht, und die Entnahme, die nur aus den Erträgen kommt und die Substanz unangetastet lässt. Mathematisch ist die erste dieselbe Formel wie eine Kreditrate – ein Kapital abzubauen und eine Schuld abzutragen ist dieselbe Rechnung mit umgekehrtem Vorzeichen.",
  "Alle Ergebnisse unterstellen eine gleichbleibende Rendite, und die gibt es an der Börse nicht. Ein breiter Aktienindex hat langfristig rund sieben Prozent im Jahr gebracht, aber als Mittelwert über Jahrzehnte mit einzelnen Jahren zwischen plus dreißig und minus vierzig Prozent. Für die Planung heißt das: Die Rechnung mit mehreren Renditen durchspielen, nicht mit der optimistischsten planen, und den Anlagehorizont ernst nehmen. Dieser Rechner ist keine Anlageberatung und ersetzt keine.",
];

const allgemeineFaq: FaqEntry[] = [
  {
    question: "Mit welcher Rendite sollte ich rechnen?",
    answer:
      "Für einen breit gestreuten Aktien-ETF sind 5 bis 7 Prozent pro Jahr eine gängige Annahme, abgeleitet aus der langfristigen Entwicklung von Indizes wie dem MSCI World. Für Tages- und Festgeld liegt die realistische Erwartung bei 2 bis 3 Prozent, für Anleihen dazwischen. Wichtig ist, die Rechnung zusätzlich mit einer pessimistischen Annahme zu prüfen: Trägt der Plan auch bei 4 Prozent, ist er belastbar. Trägt er nur bei 8 Prozent, ist er eine Hoffnung.",
  },
  {
    question: "Warum ist das Ergebnis niedriger als bei anderen Rechnern?",
    answer:
      "Weil hier Kosten, Steuern und Inflation mitgerechnet werden. Viele Rechner zeigen den reinen Bruttowert, also die Verzinsung der Einzahlungen ohne Abzüge – das ist rechnerisch richtig, aber es ist nicht der Betrag, über den man am Ende verfügt. Wer die Werte vergleichen will, kann die Steuern im Rechner ausschalten und die Kosten auf null setzen; dann stimmt das Ergebnis mit den einfacheren Rechnern überein.",
  },
  {
    question: "Wann wird die Sparrate eingezahlt – am Anfang oder am Ende des Monats?",
    answer:
      "Am Monatsanfang, so wie es Sparpläne in der Praxis ausführen. Das klingt nach einer Kleinigkeit, macht über lange Laufzeiten aber einen sichtbaren Unterschied: Jede Rate verzinst sich einen Monat länger. Bei 100 Euro im Monat über ein Jahr zu 12 Prozent sind es 1.276,64 statt 1.264,64 Euro – über dreißig Jahre summiert sich dieser Vorsprung auf mehrere Tausend Euro.",
  },
  {
    question: "Wie rechnet der Rechner die Rendite auf einen Monat um?",
    answer:
      "Über die zwölfte Wurzel, nicht über eine Division durch zwölf. Die eingegebene Rendite ist die effektive Jahresrendite: Aus 10.000 Euro zu 7 Prozent werden nach einem Jahr 10.700 Euro. Wer stattdessen 7 durch 12 teilt, verzinst effektiv mit 7,229 Prozent und weist über dreißig Jahre gut vier Prozent zu viel aus. Beim Kreditrechner ist die Division durch zwölf dagegen richtig, weil der deutsche Sollzins ein nominaler Jahreszins ist – genau daher stammt dort der Abstand zum effektiven Jahreszins.",
  },
  {
    question: "Was ist die Teilfreistellung?",
    answer:
      "Ein pauschaler Ausgleich dafür, dass Fonds bereits auf ihrer eigenen Ebene Steuern zahlen. Bei Fonds mit mindestens 51 Prozent Aktienanteil bleiben 30 Prozent des Ertrags beim Anleger steuerfrei, bei Mischfonds mit mindestens 25 Prozent Aktien sind es 15 Prozent, bei Immobilienfonds 60 Prozent. Aus den 26,375 Prozent Abgeltungsteuer werden dadurch bei einem Aktien-ETF effektiv rund 18,5 Prozent auf den Gewinn. Für Zinsanlagen wie Tages- oder Festgeld gibt es keine Teilfreistellung.",
  },
  {
    question: "Sollte ich alles auf einmal anlegen oder monatlich einzahlen?",
    answer:
      "Rein rechnerisch ist die Einmalanlage im Schnitt besser, weil das Geld länger investiert ist und Märkte häufiger steigen als fallen. Der Sparplan hat zwei andere Vorteile: Er passt zum tatsächlichen Zahlungsfluss – die meisten haben ein monatliches Einkommen und kein Vermögen zum Anlegen – und er nimmt die Entscheidung über den Einstiegszeitpunkt aus dem Spiel. Wer eine größere Summe hat und nachts schlecht schläft, kann sie über sechs bis zwölf Monate verteilt einzahlen; das kostet im Mittel etwas Rendite und senkt das Risiko eines schlechten Einstiegstags.",
  },
  {
    question: "Was passiert bei einem Börsencrash während der Laufzeit?",
    answer:
      "In der Ansparphase ist ein Crash rechnerisch günstig, solange weiter eingezahlt wird: Die laufenden Raten kaufen zu niedrigeren Kursen. Gefährlich wird er am Ende der Laufzeit, wenn das Geld gebraucht wird und keine Zeit zur Erholung bleibt. Deshalb ist es üblich, den Aktienanteil in den letzten fünf bis zehn Jahren vor dem Ziel schrittweise zu senken. Dieser Rechner unterstellt eine gleichbleibende Rendite und kann solche Verläufe nicht abbilden – er zeigt den Durchschnittsfall, nicht den schlechtesten.",
  },
  {
    question: "Wie viel sollte ich überhaupt sparen?",
    answer:
      "Vor dem Sparplan kommen zwei Dinge: ein Notgroschen von drei bis sechs Monatsausgaben auf dem Tagesgeldkonto und die Tilgung teurer Schulden. Ein Dispo zu 11 Prozent kostet sicher mehr, als ein Sparplan erwartbar bringt. Danach ist jede Rate sinnvoll, die dauerhaft durchgehalten werden kann – Durchhalten schlägt bei dieser Rechnung die Höhe, weil die Zeit der wirksamste Faktor ist.",
  },
  {
    question: "Ersetzt der Rechner eine Beratung?",
    answer:
      "Nein. Er rechnet ein Szenario durch, das du selbst vorgibst, und macht die Annahmen sichtbar, die sonst im Ergebnis verschwinden. Er kennt weder deine Steuersituation im Detail noch deine sonstigen Anlagen, deinen Anlagehorizont oder deine Risikotragfähigkeit. Für die Auswahl konkreter Produkte und für Fragen der Altersvorsorge ist eine unabhängige, auf Honorarbasis arbeitende Beratung der richtige Ort. Dieser Rechner ist keine Anlageberatung.",
  },
];

/* ---------------------------------------------------------------------------
 * Varianten
 * ------------------------------------------------------------------------- */

function buildVariants(): ToolVariant[] {
  return variantenTexte.map((text) => ({
    slug: text.slug,
    title: text.titel,
    description: text.beschreibung,
    heading: text.heading,
    params: text.params,
    about: [...text.absaetze, ...about.slice(1)],
    faq: [...text.faq, ...allgemeineFaq.slice(0, 4)],
  }));
}

/* ---------------------------------------------------------------------------
 * Manifest
 * ------------------------------------------------------------------------- */

export const sparplan: ToolManifest = {
  slug: "sparplan",
  name: "Sparplan-Rechner",
  tagline:
    "Was aus einer Sparrate wirklich wird: mit Zinseszins, Fondskosten, Abgeltungsteuer, Vorabpauschale und Inflation – plus der Entnahme am Ende.",
  category: "geld",
  icon: TrendingUp,
  status: "live",
  keywords: [
    "sparplan rechner",
    "zinseszinsrechner",
    "etf sparplan rechner",
    "sparrate berechnen",
    "vorabpauschale berechnen",
    "abgeltungssteuer berechnen",
    "entnahmeplan rechner",
    "monatlich sparen rechner",
    "kapital berechnen zinseszins",
    "millionär werden sparplan",
  ],

  Component,
  getVariants: buildVariants,

  about,
  faq: allgemeineFaq,

  monetization: {
    adDensity: "medium",
    affiliate: sparplanAffiliate,
  },
};
