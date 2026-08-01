import { PiggyBank } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { rentenlueckeAffiliate } from "./affiliate";
import Component from "./Component";

const about: string[] = [
  "Die gesetzliche Rente ersetzt bei den meisten Menschen nicht annähernd das letzte Nettoeinkommen. Das Rentenniveau – das Verhältnis einer Standardrente nach 45 Beitragsjahren zum Durchschnittseinkommen – liegt gesetzlich bei mindestens 48 Prozent, und die individuelle Nettoersatzquote fällt für die meisten Erwerbsbiografien mit Lücken, Teilzeit oder unterdurchschnittlichem Einkommen noch niedriger aus. Wer sein bisheriges Lebensniveau halten will, muss die Differenz aus eigenem Vermögen decken – diese Differenz ist die Rentenlücke, und dieser Rechner macht aus der vagen Sorge eine konkrete Zahl in Euro pro Monat und in Euro Kapitalbedarf.",
  "Die erwartete gesetzliche Rente trägst du am besten direkt aus deiner jährlichen Renteninformation ein, die die Deutsche Rentenversicherung ab 27 Jahren und fünf Beitragsjahren automatisch verschickt. Dort stehen zwei Werte: die Rente bei Fortzahlung des heutigen Einkommens und eine Hochrechnung bis zum Renteneintritt unter der Annahme einer ein- oder zweiprozentigen jährlichen Rentenanpassung. Beide sind bereits Näherungen in heutiger Kaufkraft – kein Betrag, den du in dreißig Jahren tatsächlich auf dem Konto siehst, sondern ein Betrag mit derselben Kaufkraft wie heute. Genau deshalb rechnet auch dieser Rechner konsequent in heutiger Kaufkraft weiter.",
  "Das ist die wichtigste methodische Entscheidung im ganzen Rechner: Statt mit einer nominalen Rendite auf Zukunftseuro zu rechnen, wird jede eingegebene Rendite über die Fisher-Gleichung um die Inflation bereinigt – aus 6 Prozent nominaler Rendite und 2 Prozent Inflation werden rund 3,9 Prozent reale Rendite. Mit dieser realen Rendite wächst sowohl das vorhandene Vermögen als auch die Sparrate bis zum Renteneintritt, monatsgenau simuliert wie beim Sparplan-Rechner. Das Ergebnis ist an jeder Stelle ein Betrag mit heutiger Kaufkraft – direkt vergleichbar mit deinem heutigen Einkommen und mit dem Wert aus deiner Renteninformation.",
  "Für die Auszahlphase gilt dieselbe Logik umgekehrt: Der Rechner ermittelt den Barwert einer Rente, die die monatliche Lücke über die gesamte Rentenbezugsdauer schließt – also das Kapital, das bei Renteneintritt vorhanden sein muss, wenn es bis zur eingetragenen Lebenserwartung reichen soll. Die Rendite in dieser Phase ist bewusst ein eigenes Feld mit niedrigerem Vorgabewert: Wer im Ruhestand entnimmt, kann sich große Kursschwankungen schlechter leisten als in der Ansparphase und legt einen Teil des Kapitals meist sicherer an. Zusätzlich zeigt der Rechner, wie viel Kapital nötig wäre, um die Lücke für immer zu schließen, ohne das Vermögen je anzugreifen – nur aus den laufenden Erträgen.",
  "Alle Angaben sind Näherungen und keine Anlage- oder Steuerberatung. Weder die künftige Rentenanpassung noch eine Rendite über Jahrzehnte lassen sich vorhersagen, nur durchspielen – und die Kapitallücke reagiert empfindlich auf beide Annahmen. Riester- oder Rürup-Zulagen, Steuervorteile auf Sparraten sowie die nachgelagerte Besteuerung der gesetzlichen Rente sind bewusst nicht eingerechnet, weil sie von der persönlichen Situation abhängen. Wer die errechnete Lücke kennt, hat trotzdem die Zahl, um die es bei jedem Beratungsgespräch wirklich geht.",
];

const faq: FaqEntry[] = [
  {
    question: "Wo finde ich meine erwartete gesetzliche Rente?",
    answer:
      "In der jährlichen Renteninformation der Deutschen Rentenversicherung, die ab 27 Jahren und fünf Pflichtbeitragsjahren automatisch per Post kommt. Dort steht eine Hochrechnung bis zum Renteneintritt, meist unter zwei Annahmen für die künftige Rentenanpassung. Nimm den mittleren oder vorsichtigeren der beiden Werte. Ohne Post zur Hand liefert der Kontenspiegel unter www.deutsche-rentenversicherung.de dieselbe Zahl online.",
  },
  {
    question: "Warum rechnet der Rechner in heutiger Kaufkraft statt in Euro von morgen?",
    answer:
      "Weil die Renteninformation selbst schon in heutiger Kaufkraft denkt – sie unterstellt eine Rentenanpassung nahe der Lohnentwicklung. Würde der Rechner stattdessen mit einer nominalen Rendite auf Zukunftseuro rechnen, würden zwei unterschiedliche Wertmaßstäbe vermischt und die Lücke verzerrt. Deshalb wird jede eingegebene Rendite über die Fisher-Gleichung um die Inflation bereinigt, bevor sie in die Rechnung geht – das Ergebnis bleibt an jeder Stelle mit deinem heutigen Einkommen vergleichbar.",
  },
  {
    question: "Wie hoch sollte mein Versorgungsniveau im Ruhestand sein?",
    answer:
      "Als Faustregel gelten 70 bis 80 Prozent des letzten Nettoeinkommens, weil im Ruhestand einige Ausgaben wegfallen – Fahrtkosten zur Arbeit, Altersvorsorgebeiträge, oft auch die Miete bei abbezahltem Eigentum. Wer im Ruhestand viel reisen oder größere Anschaffungen tätigen will, sollte höher ansetzen, wer sparsam lebt, kommt mit weniger aus. Über den Umschalter bei „Wunscheinkommen“ lässt sich statt eines Prozentsatzes auch direkt ein fester Betrag eintragen.",
  },
  {
    question: "Was ist der Unterschied zwischen Kapitalverzehr und der ewigen Entnahme?",
    answer:
      "Der Kapitalbedarf mit Verzehr ist das Kapital, das genau bis zur eingetragenen Lebenserwartung reicht und danach null ist – rechnerisch effizient, aber ohne Puffer, falls du älter wirst als angenommen. Das Kapital für die ewige Entnahme ist deutlich höher, wird aber nie selbst angegriffen: Es trägt die monatliche Lücke allein aus seinen Erträgen und bleibt am Lebensende erhalten, etwa zum Vererben. Beide Zahlen stehen im Ergebnis nebeneinander.",
  },
  {
    question: "Sind Riester, Rürup oder Betriebsrente schon eingerechnet?",
    answer:
      "Nur, wenn du sie im Feld „Weitere Renten“ einträgst – dort gehört jede bereits laufende oder fest zugesagte Zusatzrente hinein, addiert zur gesetzlichen Rente. Steuervorteile beim Ansparen, Zulagen oder die abweichende Besteuerung dieser Produkte rechnet der Rechner nicht mit, weil sie stark vom Vertrag und der persönlichen Steuersituation abhängen. Für die reine Frage „wie groß ist die Lücke“ reicht der erwartete Auszahlbetrag.",
  },
  {
    question: "Warum sinkt die nötige Sparrate, wenn ich den Renteneintritt nach hinten schiebe?",
    answer:
      "Weil zwei Effekte gleichzeitig wirken: Das vorhandene Kapital hat mehr Jahre Zeit zum Wachsen, und die Rentenbezugsdauer – und damit der Kapitalbedarf selbst – wird kürzer, wenn die Lebenserwartung gleich bleibt. Ein Jahr länger arbeiten wirkt deshalb überproportional stark auf die Lücke, stärker als ein Jahr länger sparen bei gleichem Renteneintritt.",
  },
  {
    question: "Wie sicher sind die Annahmen zu Rendite und Inflation?",
    answer:
      "Gar nicht – sie sind Annahmen, keine Prognosen. Die Vorgabewerte von 6 Prozent in der Ansparphase, 3 Prozent in der Rentenphase und 2 Prozent Inflation orientieren sich an langfristigen Durchschnitten breiter Aktien- beziehungsweise gemischter Portfolios, aber die tatsächliche Entwicklung über Jahrzehnte kennt niemand im Voraus. Es lohnt sich, die Rechnung einmal mit einer niedrigeren Rendite durchzuspielen: Wenn die Lücke dann noch tragbar aussieht, steht die Planung auf einem robusteren Fundament.",
  },
];

export const rentenluecke: ToolManifest = {
  slug: "rentenluecke",
  name: "Rentenlücken-Rechner",
  tagline:
    "Wunscheinkommen im Ruhestand minus erwarteter Rente – mit Kapitalbedarf und der Sparrate, die die Lücke schließt.",
  category: "geld",
  icon: PiggyBank,
  status: "live",
  keywords: [
    "rentenlücke berechnen",
    "rentenlücke rechner",
    "altersvorsorge rechner",
    "wie hoch ist meine rente",
    "private altersvorsorge berechnen",
    "kapitalbedarf rente berechnen",
    "versorgungslücke rente",
    "wie viel muss ich für die rente sparen",
    "rentenniveau",
  ],

  Component,

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: rentenlueckeAffiliate,
  },
};
