import { Percent } from "lucide-react";
import type { ContentSection, ToolManifest } from "@/tools/types";

const sections: ContentSection[] = [
  {
    heading: "Die vier Fragen mit Beispiel",
    blocks: [
      {
        type: "table",
        caption: "Dieselbe Gleichung, nach vier verschiedenen Größen aufgelöst",
        head: ["Frage", "Beispiel", "Ergebnis"],
        rows: [
          ["Wie viel sind p % von X?", "20 % von 80 €", "16 €"],
          ["Wovon sind das p %?", "16 € sind 20 % wovon?", "80 €"],
          ["Wie viel % ist ein Teil vom Ganzen?", "16 von 80", "20 %"],
          ["Um wie viel % hat sich der Wert verändert?", "von 80 auf 100", "+25 %"],
        ],
      },
    ],
  },
  {
    heading: "Prozent im Kopf überschlagen",
    blocks: [
      {
        type: "p",
        text: "Für einen schnellen Überschlag ohne Rechner reichen ein paar Faustregeln, die sich alle aus den 10 Prozent ableiten.",
      },
      {
        type: "ul",
        items: [
          "10 %: Komma eine Stelle nach links verschieben.",
          "1 %: Komma zwei Stellen nach links verschieben.",
          "5 %: die 10 % halbieren.",
          "20 %: die 10 % verdoppeln, oder durch 5 teilen.",
          "25 %: durch 4 teilen.",
          "50 %: halbieren.",
        ],
      },
      {
        type: "note",
        text: "15 % lässt sich als 10 % plus die Hälfte davon zusammensetzen – bei 80 Euro also 8 Euro plus 4 Euro, macht 12 Euro. Für die exakte Zahl mit Nachkommastellen bleibt der Rechner oben trotzdem zuverlässiger.",
      },
    ],
  },
  {
    heading: "Prozentsätze, die im Alltag oft gebraucht werden",
    blocks: [
      {
        type: "table",
        caption: "Häufig gesuchte Prozentangaben",
        head: ["Anlass", "Üblicher Satz"],
        rows: [
          ["Regulärer Mehrwertsteuersatz", "19 %"],
          ["Ermäßigter Mehrwertsteuersatz (u. a. Lebensmittel, Bücher)", "7 %"],
          ["Trinkgeld in Deutschland", "5–10 %"],
          ["Rabatt im Schlussverkauf", "20–50 %"],
        ],
      },
      {
        type: "note",
        text: "Für die Mehrwertsteuer gilt: Ein Nettopreis plus 19 % ist nicht dasselbe wie ein Bruttopreis minus 19 %. Um aus einem Bruttopreis den enthaltenen Steueranteil herauszurechnen, muss durch 1,19 geteilt werden, nicht mit 0,19 multipliziert – ein klassischer Fall für die Frage „Wovon sind das p Prozent?“ oben im Rechner.",
      },
    ],
  },
];

export const prozentrechner: ToolManifest = {
  slug: "prozentrechner",
  name: "Prozentrechner",
  tagline:
    "Anteil, Grundwert, Prozentsatz oder Veränderung – die vier Prozentfragen des Alltags in einem Rechner.",
  category: "alltag",
  icon: Percent,
  status: "live",
  keywords: [
    "prozentrechner",
    "prozent berechnen",
    "prozentsatz berechnen",
    "grundwert berechnen",
    "prozentwert berechnen",
    "wie viel prozent",
    "rabatt berechnen",
    "prozentuale veränderung",
    "prozentrechnung",
  ],

  sections,

  about: [
    "Prozentrechnung stellt fast immer dieselbe Frage in einer von vier Varianten: Wie viel sind p Prozent von einem Wert? Wovon sind das p Prozent? Wie viel Prozent ist ein Teil vom Ganzen? Und: Um wie viel Prozent hat sich ein Wert verändert? Oben wird die Frage gewechselt, unten steht sofort das passende Ergebnis – alle vier rechnen aus derselben Gleichung, nur nach einer anderen Größe aufgelöst.",
    "Am häufigsten gebraucht wird der erste Fall: Ausgangswert und Prozentsatz sind bekannt, gesucht ist der Anteil – beim Rabatt der Nachlass, bei der Mehrwertsteuer der Aufschlag. Deshalb zeigt der Rechner hier gleich drei Zahlen: den Anteil selbst sowie den Wert nach Abzug und nach Zuschlag, damit sich weder Rabatt- noch Aufschlagfrage getrennt ausrechnen lässt.",
    "Bei der Veränderung zählt die Richtung, denn der Bezugswert wechselt: Steigt ein Preis von 80 auf 100 Euro, sind das 25 Prozent mehr – sinkt er von 100 auf 80 Euro zurück, sind es nur 20 Prozent weniger. Ein Plus von 20 Prozent und ein Minus von 20 Prozent gleichen sich deshalb nicht aus. Prozentpunkte sind zudem etwas anderes als Prozent: Steigt eine Quote von 5 % auf 10 %, sind das 5 Prozentpunkte, aber 100 Prozent Veränderung.",
  ],

  faq: [
    {
      question:
        "Was ist der Unterschied zwischen Prozentwert, Grundwert und Prozentsatz?",
      answer:
        "Der Grundwert ist das Ganze, die 100 % – etwa der ursprüngliche Preis. Der Prozentsatz ist die Angabe in Prozent, etwa 20 %. Der Prozentwert ist der Anteil, der dabei herauskommt – bei 20 % von 80 Euro sind das 16 Euro. Jede der vier Reiter-Optionen im Rechner löst dieselbe Gleichung nach einer anderen dieser drei Größen auf.",
    },
    {
      question: "Wie berechne ich einen Rabatt?",
      answer:
        "Ausgangspreis als Grundwert eingeben, den Rabattsatz als Prozent – der Rechner zeigt sofort den Nachlass in Euro und direkt darunter den Preis nach Abzug. Für einen Aufschlag, etwa Steuer oder Trinkgeld, steht daneben derselbe Wert nach Zuschlag.",
    },
    {
      question: "Warum heben sich +20 % und −20 % nicht gegenseitig auf?",
      answer:
        "Weil sich die zweite Rechnung auf einen anderen Grundwert bezieht. Steigt ein Preis von 100 Euro um 20 % auf 120 Euro und sinkt danach wieder um 20 %, sind das 20 % von 120 – also 24 Euro Abzug, macht 96 Euro. Das ist weniger als der Ausgangspreis, weil der Bezugswert nach der ersten Rechnung ein anderer ist.",
    },
    {
      question: "Was sind Prozentpunkte im Unterschied zu Prozent?",
      answer:
        "Prozentpunkte sind die einfache Differenz zweier Prozentangaben, Prozent ist eine relative Veränderung. Steigt ein Zinssatz von 4 % auf 5 %, ist das ein Plus von einem Prozentpunkt – relativ gesehen aber eine Erhöhung um 25 %, denn 1 ist 25 % von 4. Beide Angaben sind richtig, sie beantworten nur unterschiedliche Fragen.",
    },
    {
      question: "Kann ich ein Ergebnis mit anderen teilen?",
      answer:
        "Ja. Die eingegebenen Werte stehen in der Adresszeile, sortiert nach der gewählten Frage. Der Button „Link kopieren“ erzeugt einen Link, der bei allen dieselbe Rechnung mit denselben Zahlen zeigt.",
    },
    {
      question: "Was ist der Unterschied zwischen Prozent und Promille?",
      answer:
        "Beide sind Bruchteile von hundert beziehungsweise von tausend: Ein Prozent ist ein Hundertstel, ein Promille ein Tausendstel – ein Promille entspricht also einem Zehntel Prozent. Promille wird vor allem dort verwendet, wo Anteile sehr klein sind und Prozent unhandliche Nachkommastellen bräuchte, etwa bei der Blutalkoholkonzentration oder bei sehr niedrigen Fehler- und Ausfallquoten in der Industrie. Rechnerisch lässt sich jeder Promillewert einfach durch Teilen durch 10 in Prozent umrechnen, und umgekehrt durch Multiplizieren mit 10.",
    },
  ],

  monetization: {
    adDensity: "low",
  },
};
