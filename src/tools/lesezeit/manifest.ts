import { BookOpenText } from "lucide-react";
import type { ContentSection, ToolManifest } from "@/tools/types";
import { lesezeitAffiliate } from "./affiliate";

const sections: ContentSection[] = [
  {
    heading: "Lesegeschwindigkeit je Textart",
    blocks: [
      {
        type: "table",
        caption: "Wörter pro Minute, je nach Art des Lesens",
        head: ["Lesemodus", "Wörter pro Minute"],
        rows: [
          ["Anspruchsvoller Fachtext, mitdenkend", "100–150"],
          ["Normaler Sachtext, still gelesen", "200–250"],
          ["Überfliegen (nur Kernaussagen)", "350+"],
          ["Laut vorlesen", "rund 130"],
        ],
      },
    ],
  },
  {
    heading: "Lesezeit typischer Textlängen",
    blocks: [
      {
        type: "p",
        text: "Wer die eigene Wortzahl kennt, kann die Lesezeit bei 200 Wörtern pro Minute – dem üblichen Richtwert für Sachtexte – auch ohne Rechner überschlagen.",
      },
      {
        type: "table",
        caption: "Lesezeit bei 200 Wörtern pro Minute",
        head: ["Wortzahl", "Lesezeit"],
        rows: [
          ["250 Wörter (kurze E-Mail)", "gut 1 Minute"],
          ["500 Wörter", "2,5 Minuten"],
          ["1.000 Wörter", "5 Minuten"],
          ["1.500 Wörter (typischer Blogartikel)", "7,5 Minuten"],
          ["5.000 Wörter", "25 Minuten"],
          ["10.000 Wörter", "50 Minuten"],
        ],
      },
      {
        type: "note",
        text: "Zum Vergleich: Eine Kurzgeschichte hat oft 3.000 bis 7.500 Wörter, ein durchschnittlicher Roman 80.000 bis 100.000 – bei 200 Wörtern pro Minute wären das mehr als sechs Stunden reine Lesezeit, weshalb niemand einen Roman am Stück liest.",
      },
    ],
  },
  {
    heading: "Was die Lesezeit zusätzlich verändert",
    blocks: [
      {
        type: "p",
        text: "Die Wörter-pro-Minute-Werte sind Durchschnittswerte über viele Texte hinweg – im Einzelfall weichen sie deutlich ab. Dialoglastige Texte mit kurzen Sätzen lesen sich spürbar schneller als Fließtext mit verschachtelten Nebensätzen, weil das Auge mit kurzen, vorhersehbaren Einheiten leichter vorankommt. Ein Fachtext mit unbekannten Begriffen oder Zahlen und Formeln bremst dagegen, weil an diesen Stellen häufiger zurückgesprungen wird als bei einem durchgehend erzählenden Text.",
      },
      {
        type: "note",
        text: "Auch die Sprache selbst spielt eine Rolle: Deutsche Wörter sind durch Komposita wie „Lesegeschwindigkeit“ im Schnitt länger als englische, wodurch reine Wörter-pro-Minute-Vergleiche zwischen beiden Sprachen etwas hinken – innerhalb einer Sprache bleiben sie trotzdem der gebräuchliche Maßstab.",
      },
    ],
  },
  {
    heading: "Warum Lesezeit-Angaben auf Webseiten oft zu niedrig wirken",
    blocks: [
      {
        type: "p",
        text: "Manche Blogs und Nachrichtenseiten zeigen bei gleicher Wortzahl eine kürzere Lesezeit an als dieser Rechner – meist, weil sie mit einem höheren Wert rechnen, oft 250 bis 300 Wörtern pro Minute, statt mit dem hier verwendeten Richtwert für aufmerksames Lesen. Beide Angaben sind für sich genommen nicht falsch, sie messen nur unterschiedlich: eine grobe Kurzfassung fürs Überfliegen gegenüber einer Schätzung fürs Verstehen.",
      },
    ],
  },
];

export const lesezeit: ToolManifest = {
  slug: "lesezeit",
  name: "Lesezeit-Rechner",
  tagline:
    "Wie lange dauert dieser Text? Wörter zählen, Lesedauer schätzen, Vorlesezeit gleich mit.",
  category: "text",
  icon: BookOpenText,
  status: "live",
  keywords: [
    "lesezeit berechnen",
    "lesedauer",
    "wörter zählen",
    "zeichen zählen",
    "wie lange lesen",
    "vorlesezeit",
    "sprechdauer",
  ],

  sections,

  about: [
    "Die Lesezeit ergibt sich aus der Wortzahl geteilt durch die Lesegeschwindigkeit. Für stilles Lesen deutscher Sachtexte werden meist 200 bis 250 Wörter pro Minute angesetzt; wer aufmerksam liest und mitdenkt, liegt eher bei 150. Beim Überfliegen kommt man auf ein Vielfaches, nimmt dafür aber nur die Kernaussagen mit.",
    "Fürs laute Vorlesen gilt eine andere Größe: rund 130 Wörter pro Minute. Das ist die Zahl, die zählt, wenn du einen Vortrag, ein Video-Skript oder eine Rede planst – hier ist die Vorlesezeit gleich mit ausgewiesen.",
    "Dein Text verlässt deinen Browser nicht. Er wird lokal analysiert, nirgendwo gespeichert und steht auch nicht im geteilten Link – dort landet nur die Wortzahl.",
  ],

  faq: [
    {
      question: "Wie viele Wörter liest man pro Minute?",
      answer:
        "Erwachsene lesen stille Sachtexte typischerweise mit 200 bis 250 Wörtern pro Minute. Anspruchsvolle Fachtexte drücken das Tempo auf 100 bis 150, beim Überfliegen sind 350 und mehr möglich. Deshalb kannst du hier zwischen drei Geschwindigkeiten wählen.",
    },
    {
      question: "Warum dauert Vorlesen länger als Lesen?",
      answer:
        "Beim Sprechen bestimmen Atempausen, Betonung und Satzmelodie das Tempo. Als Richtwert gelten 130 Wörter pro Minute – für Vorträge und Video-Skripte ist das die verlässlichere Zahl.",
    },
    {
      question: "Wie werden Wörter gezählt?",
      answer:
        "Getrennt wird an Leerzeichen und Zeilenumbrüchen. Satzzeichen am Wortrand fallen weg, zusammengesetzte Wörter wie „E-Mail“ und Zahlen wie „1.500“ bleiben ein Wort. Ein alleinstehender Gedankenstrich zählt nicht mit.",
    },
    {
      question: "Wird mein Text gespeichert oder übertragen?",
      answer:
        "Nein. Die Berechnung passiert vollständig in deinem Browser. Beim Teilen wandert nur die Wortzahl in den Link, nie der Text selbst.",
    },
  ],

  monetization: {
    adDensity: "low",
    affiliate: lesezeitAffiliate,
  },
};
