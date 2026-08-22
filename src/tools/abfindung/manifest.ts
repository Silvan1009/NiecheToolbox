import { DoorOpen } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { abfindungAffiliate } from "./affiliate";

/**
 * Nachvollziehbares Rechenbeispiel mit denselben Zahlen wie der Rechner
 * selbst (lib/steuerdaten.ts::einkommensteuer), nicht hingeschrieben.
 */
const sections: ContentSection[] = [
  {
    heading: "Die Fünftelregelung Schritt für Schritt",
    blocks: [
      {
        type: "p",
        text: "Ein Beispiel macht das Verfahren greifbar: 40.000 Euro reguläres zu versteuerndes Einkommen, dazu eine Abfindung von 30.000 Euro. Ein Fünftel davon sind 6.000 Euro.",
      },
      {
        type: "table",
        caption: "Beispiel: 40.000 € Einkommen, 30.000 € Abfindung",
        head: ["Schritt", "Wert"],
        rows: [
          ["Steuer auf 40.000 € (ohne Abfindung)", "7.209 €"],
          ["Steuer auf 46.000 € (plus ein Fünftel)", "9.171 €"],
          ["Differenz", "1.962 €"],
          ["Differenz × 5 = Steuer auf die Abfindung", "9.810 €"],
        ],
      },
      {
        type: "note",
        text: "Zum Vergleich: Bei sofortiger voller Versteuerung der Abfindung im selben Jahr fielen 11.055 Euro Steuer an – die Fünftelregelung spart in diesem Beispiel 1.245 Euro. Der Effekt ist bei diesem Einkommen also spürbar, aber kein Wunder: effektiv rund 32,7 Prozent Steuer statt der vollen 36,9 Prozent.",
      },
    ],
  },
];

const about: string[] = [
  "Eine Abfindung ist kein steuerfreies Trostpflaster – sie wird zum übrigen Jahreseinkommen addiert und dort ganz normal besteuert. Ohne Korrektur würde eine große Einmalzahlung den Grenzsteuersatz für dieses Jahr in die Höhe treiben, obwohl sie wirtschaftlich eine Entschädigung für mehrere Jahre entgangenes Gehalt ist. Die Fünftelregelung nach § 34 EStG gleicht genau das aus: Sie besteuert rechnerisch nur ein Fünftel der Abfindung zusätzlich und multipliziert die daraus entstehende Steuer mit fünf – bei einer progressiven Steuerkurve kommt dabei nie mehr heraus als bei sofortiger voller Versteuerung.",
  "Wie stark die Regelung hilft, hängt fast ausschließlich vom regulären Einkommen im Abfindungsjahr ab. Bei einem durchschnittlichen Gehalt spart sie meist einen niedrigen vierstelligen Betrag. Folgt auf die Kündigung dagegen ein Jahr mit wenig oder keinem Einkommen, kann die Ersparnis um ein Vielfaches höher ausfallen – im Extremfall bleibt eine Abfindung von 30.000 Euro sogar komplett steuerfrei, wenn ein Fünftel davon unter dem Grundfreibetrag bleibt. Wer den Auszahlungstermin mitgestalten kann, sollte diesen Effekt kennen, bevor der Aufhebungsvertrag unterschrieben wird.",
  "Wer bereits im Spitzensteuersatz von 42 oder 45 Prozent liegt, für den bringt die Fünftelregelung dagegen nichts mehr – dort ändert sich der Grenzsteuersatz durch die Abfindung nicht, ganz gleich ob sie auf einmal oder rechnerisch verteilt besteuert wird. Der Rechner weist diesen Fall aus, statt eine Ersparnis vorzutäuschen, die es dort nicht gibt.",
  "Für die Einkommensteuer selbst rechnet dieser Rechner mit derselben Tarifformel wie der Brutto-Netto-Rechner (§ 32a EStG) – wer sein zu versteuerndes Einkommen noch nicht kennt, findet dort die Herleitung aus dem Bruttogehalt. Nicht abgebildet sind Kirchensteuer-Erlasse aus Billigkeitsgründen, die Verteilung einer Abfindung über zwei Kalenderjahre sowie Sonderfälle wie eine parallel laufende Abfindung für den Betriebsrat. Alle Angaben sind Näherungen und keine Steuerberatung.",
];

const faq: FaqEntry[] = [
  {
    question: "Was ist die Fünftelregelung genau?",
    answer:
      "Ein Rechenverfahren nach § 34 EStG für außerordentliche Einkünfte wie eine Abfindung: Das Finanzamt ermittelt die Steuer auf das reguläre Einkommen, dann die Steuer auf das reguläre Einkommen plus ein Fünftel der Abfindung, bildet die Differenz und multipliziert sie mit fünf. Diese verfünffachte Differenz ist die zusätzliche Steuer auf die gesamte Abfindung. Das Verfahren wird automatisch angewendet, wenn es günstiger ist als die volle Versteuerung im selben Jahr – von Amts wegen, ohne gesonderten Antrag.",
  },
  {
    question: "Was zählt als zu versteuerndes Einkommen für diesen Rechner?",
    answer:
      "Das Jahreseinkommen ohne die Abfindung, nach Abzug von Werbungskosten-Pauschale, Sonderausgaben und Sozialversicherungsbeiträgen – also dieselbe Bemessungsgrundlage, die auch im Steuerbescheid steht. Bei unterjähriger Kündigung zählt nur das tatsächlich in diesem Kalenderjahr erzielte Einkommen, nicht das Jahresgehalt hochgerechnet. Wer diesen Wert nicht direkt kennt, findet die Herleitung aus dem Bruttogehalt im Brutto-Netto-Rechner.",
  },
  {
    question: "Warum spart die Fünftelregelung bei niedrigem Einkommen mehr?",
    answer:
      "Weil der deutsche Steuertarif progressiv ist: Jeder zusätzliche Euro wird mit einem höheren Satz besteuert als der vorherige. Bei niedrigem regulärem Einkommen liegt das rechnerische Fünftel der Abfindung noch in einer niedrigen Progressionszone oder sogar im Grundfreibetrag – dann fällt kaum oder gar keine zusätzliche Steuer an. Bei hohem regulärem Einkommen liegt dasselbe Fünftel dagegen oft schon in einer hohen Progressionszone, und der Effekt schrumpft.",
  },
  {
    question: "Wann bringt die Fünftelregelung gar nichts mehr?",
    answer:
      "Wenn das reguläre Einkommen bereits so hoch ist, dass sowohl das gesamte Fünftel als auch die volle Abfindung im obersten, konstanten Grenzsteuersatz von 42 oder 45 Prozent besteuert würden. Dann ist die Steuer auf jeden zusätzlichen Euro gleich hoch, egal ob er sofort oder rechnerisch verteilt versteuert wird – die Differenz zwischen beiden Methoden verschwindet.",
  },
  {
    question: "Kann ich den Auszahlungszeitpunkt der Abfindung beeinflussen?",
    answer:
      "Oft ja, im Rahmen der Verhandlung des Aufhebungsvertrags – etwa, ob die Abfindung noch im laufenden Jahr oder erst im Folgejahr fließt. Das lohnt sich vor allem, wenn im Folgejahr ein deutlich niedrigeres Einkommen zu erwarten ist, etwa durch eine Phase der Arbeitslosigkeit. Wichtig zu wissen: Auch Arbeitslosengeld zählt als Einkommen für den Progressionsvorbehalt und erhöht damit den Steuersatz auf das übrige Einkommen, senkt aber nicht das zu versteuernde Einkommen selbst in gleicher Weise wie ein Gehalt.",
  },
  {
    question: "Muss ich für die Fünftelregelung etwas beantragen?",
    answer:
      "Nein, das Finanzamt prüft im Rahmen der Steuererklärung automatisch, ob sie günstiger ist als die reguläre Versteuerung, und wendet sie dann von Amts wegen an. Voraussetzung ist, dass es sich um eine „Zusammenballung von Einkünften“ handelt – bei einer normalen, einmaligen Abfindung ist das so gut wie immer erfüllt. Der Arbeitgeber kann die Fünftelregelung schon beim Lohnsteuerabzug berücksichtigen, kennt dabei aber selten das genaue restliche Jahreseinkommen – die endgültige, meist günstigere Berechnung erfolgt über die Steuererklärung.",
  },
];

export const abfindung: ToolManifest = {
  slug: "abfindung",
  name: "Abfindungsrechner",
  tagline:
    "Steuer auf eine Abfindung mit der Fünftelregelung nach § 34 EStG – im Vergleich zur vollen Versteuerung im selben Jahr.",
  category: "geld",
  icon: DoorOpen,
  status: "live",
  keywords: [
    "abfindung berechnen",
    "abfindung steuer rechner",
    "fünftelregelung berechnen",
    "abfindung netto",
    "abfindung versteuern",
    "abfindungsrechner",
    "steuer auf abfindung",
  ],

  sections,

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: abfindungAffiliate,
  },
};
