import { House } from "lucide-react";
import { formatInteger } from "@/lib/format";
import { regions } from "@/lib/regionen";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { immobilienAffiliate } from "./affiliate";
import {
  grestFaq,
  grestKontext,
  grestSpanne,
  grunderwerbsteuer,
} from "./grunderwerbsteuer";
import { defaultInput } from "./logic";

const { notarPercent, maklerPercent } = defaultInput();

/** Kaufnebenkosten in Euro für einen Kaufpreis, bei gegebenem Steuersatz. */
const nebenkosten = (kaufpreis: number, grest: number) =>
  Math.round((kaufpreis * (grest + notarPercent + maklerPercent)) / 100);

const euro = (betrag: number) => `${formatInteger(betrag)} Euro`;

/** Prozentangabe mit Dezimalkomma und ohne angehängte Nullen: "3,5", "9,07". */
const prozent = (n: number) =>
  String(Math.round(n * 100) / 100).replace(".", ",");

/* ---------------------------------------------------------------------------
 * Inhalte
 * ------------------------------------------------------------------------- */

const about: string[] = [
  "Beim Immobilienkauf entscheidet selten der Kaufpreis, sondern das, was daneben steht. Grunderwerbsteuer, Notar, Grundbuch und Maklerprovision summieren sich je nach Bundesland auf 8 bis 12 Prozent – bei einer Wohnung für 350.000 Euro sind das 28.000 bis 42.000 Euro. Diese Summe ist zum Notartermin fällig und wird von Banken so gut wie nie mitfinanziert. Wer sie nicht als Guthaben hat, bekommt die Finanzierung nicht. Deshalb steht sie hier ganz vorne und nicht im Kleingedruckten.",
];

/**
 * Der ausführliche Teil unter dem Einstieg. Bis zur Aufteilung in Etappe 3
 * stand dieser Inhalt als `about[1..5]` in einem einzigen Fließtext ohne
 * Zwischenüberschrift – fünf verschiedene Themen (Rendite, Restschuld,
 * Abschreibung, Eigennutzung, Modellgrenzen) ohne sichtbare Gliederung. Als
 * `sections` bekommt jedes Thema eine eigene Überschrift, und die
 * AfA-Sätze stehen zusätzlich als Tabelle statt nur im Fließtext.
 */
const sections: ContentSection[] = [
  {
    heading: "Bruttorendite und Nettorendite",
    blocks: [
      {
        type: "p",
        text: "Die Bruttomietrendite setzt die Jahreskaltmiete ins Verhältnis zum Kaufpreis und ignoriert damit sowohl die Nebenkosten als auch alles, was laufend abgeht: nicht umlagefähiges Hausgeld, Verwaltung, Instandhaltungsrücklage und das Risiko, dass eine Wohnung mal leer steht.",
      },
      {
        type: "p",
        text: "Die Nettomietrendite rechnet all das mit und liegt regelmäßig ein bis anderthalb Prozentpunkte darunter. Für die Frage, ob sich ein Objekt trägt, ist nur sie brauchbar – die Bruttorendite taugt höchstens für einen ersten, groben Vergleich zwischen zwei Angeboten.",
      },
    ],
  },
  {
    heading: "Restschuld nach der Zinsbindung",
    blocks: [
      {
        type: "p",
        text: "Beim Darlehen ist nicht die heutige Rate das Risiko, sondern die Restschuld am Ende der Zinsbindung. Bei zwei Prozent Anfangstilgung und zehn Jahren Bindung sind nach Ablauf noch rund drei Viertel der Darlehenssumme offen – zu einem Zinssatz, den heute niemand kennt.",
      },
      {
        type: "note",
        text: "Der Rechner ermittelt die Restschuld über einen echten monatlichen Tilgungsplan, nicht über eine Jahresnäherung, und zeigt im Jahresverlauf, wie sich das Verhältnis von Zins zu Tilgung mit der Zeit dreht.",
      },
    ],
  },
  {
    heading: "Abschreibung bei vermieteten Objekten",
    blocks: [
      {
        type: "p",
        text: "Abgeschrieben wird nur das Gebäude, nicht der Grund und Boden – deshalb fragt der Rechner nach dem Gebäudeanteil, der je nach Lage zwischen 60 und 85 Prozent liegt. Zusammen mit den Schuldzinsen führt die Abschreibung oft zu einem steuerlichen Verlust, obwohl tatsächlich Geld hereinkommt. Diese Erstattung ist ein echter Teil der Rendite und steht im Ergebnis als eigene Zeile.",
      },
      {
        type: "table",
        caption: "Linearer AfA-Satz nach Baujahr (§ 7 Abs. 4 EStG)",
        head: ["Fertigstellung", "AfA-Satz p. a.", "Abschreibungsdauer"],
        rows: [
          ["vor 1925", "2,5 %", "40 Jahre"],
          ["1925–2022", "2 %", "50 Jahre"],
          ["ab 2023", "3 %", "rund 33 Jahre"],
        ],
      },
    ],
  },
  {
    heading: "Kaufen oder Mieten: der faire Vergleich",
    blocks: [
      {
        type: "p",
        text: "Im Modus Eigennutzung fällt die Mieteinnahme weg, dafür zählt die Miete, die du nach dem Kauf nicht mehr zahlst. Der Vergleich mit dem Mieten ist nur dann fair, wenn das Eigenkapital auf der anderen Seite ebenfalls arbeitet: Wer nicht kauft, kann die Kaufnebenkosten und das restliche Eigenkapital anlegen und die monatliche Differenz zwischen Rate und Miete dazulegen.",
      },
      {
        type: "p",
        text: "Genau so rechnet der Rechner – und deshalb kann Mieten je nach angenommener Rendite auch dann besser abschneiden, wenn die Immobilie im Wert steigt. Wer beide Seiten ehrlich vergleichen will, braucht also nicht nur eine Wertsteigerungs-Annahme für die Immobilie, sondern auch eine Rendite-Annahme für das nicht gebundene Kapital.",
      },
    ],
  },
  {
    heading: "Grenzen des Modells",
    blocks: [
      {
        type: "p",
        text: "Alle Angaben sind Näherungen und keine Steuer- oder Anlageberatung. Solidaritätszuschlag, Kirchensteuer, der progressive Verlauf des Steuertarifs und Sonderfälle wie Denkmalabschreibung oder Förderkredite bleiben außen vor.",
      },
      {
        type: "note",
        text: "Die Wertentwicklung ist die unsicherste Annahme im ganzen Rechner: Sie lässt sich nicht vorhersagen, sondern nur durchspielen. Wer wissen will, ob eine Kalkulation trägt, sollte sie einmal mit null Prozent Wertsteigerung rechnen.",
      },
    ],
  },
];

/**
 * Bundesländer-Vergleich auf der Tool-Seite selbst – Ersatz für die 16
 * `kaufnebenkosten-<land>`-Unterseiten, die im Zuge der AdSense-
 * Konsolidierung entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md
 * und src/lib/retiredPaths.ts). `grestKontext` und `grestFaq` stammen von
 * dort und werden hier weiterverwendet statt neu geschrieben.
 */
function uebersichtSection(): ContentSection {
  const spanne = grestSpanne();
  const rows = [...regions]
    .sort((a, b) => grunderwerbsteuer[a.code] - grunderwerbsteuer[b.code])
    .map((region) => {
      const satz = grunderwerbsteuer[region.code];
      return [
        region.name,
        `${prozent(satz)} %`,
        euro(nebenkosten(300000, satz)),
        euro(nebenkosten(500000, satz)),
      ];
    });

  return {
    heading: "Kaufnebenkosten je Bundesland im Vergleich",
    blocks: [
      {
        type: "p",
        text: `Die Grunderwerbsteuer reicht von ${prozent(spanne.min)} Prozent in Bayern bis ${prozent(spanne.max)} Prozent in den teuersten Ländern – zusammen mit Notar, Grundbuch und Maklerprovision ergibt das die gesamten Kaufnebenkosten. Wer sein Bundesland im Rechner oben auswählt, bekommt die vollständige Kalkulation mit Finanzierung, Mietrendite und Cashflow.`,
      },
      {
        type: "table",
        caption: "Grunderwerbsteuer und Kaufnebenkosten gesamt",
        head: ["Bundesland", "Grunderwerbsteuer", "Nebenkosten bei 300.000 €", "Nebenkosten bei 500.000 €"],
        rows,
      },
      {
        type: "ul",
        items: regions.map(
          (region) => `${region.name}: ${grestKontext[region.code]}`,
        ),
      },
    ],
  };
}

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie viel Eigenkapital brauche ich für eine Immobilie?",
    answer:
      "Als Untergrenze gelten die Kaufnebenkosten, also je nach Bundesland 8 bis 12 Prozent des Kaufpreises. Damit ist die Finanzierung zwar möglich, aber teuer: Banken staffeln den Zins nach dem Beleihungsauslauf, und über 90 Prozent wird es spürbar teurer. Als komfortabel gilt, wenn zusätzlich 20 Prozent des Kaufpreises als Eigenkapital eingebracht werden. Der Rechner weist den Beleihungsauslauf aus und warnt, wenn das Eigenkapital nicht einmal die Nebenkosten deckt.",
  },
  {
    question: "Was ist ein guter Kaufpreisfaktor?",
    answer:
      "Der Kaufpreisfaktor sagt, wie viele Jahreskaltmieten der Kaufpreis entspricht – er ist der Kehrwert der Bruttomietrendite. Bis etwa zum 20-Fachen gilt ein Objekt als günstig, zwischen dem 20- und 25-Fachen als normal, ab dem 30-Fachen trägt es sich fast nur noch über die Wertsteigerung. In Städten wie München oder Hamburg sind Faktoren über 35 seit Jahren üblich; dort wird faktisch auf steigende Preise gesetzt, nicht auf laufende Erträge.",
  },
  {
    question: "Warum ist der Cashflow negativ, obwohl die Rendite stimmt?",
    answer:
      "Weil die Tilgung im Cashflow steckt, in der Rendite aber nicht. Wer mit zwei Prozent tilgt, zahlt jeden Monat einen Teil seines eigenen Vermögensaufbaus – das Geld ist weg vom Konto, aber nicht verloren. Ein negativer Cashflow bei gleichzeitig positiver Rendite bedeutet also: Das Objekt rechnet sich, kostet dich aber jeden Monat Liquidität. Entscheidend ist, ob diese Zuzahlung dauerhaft tragbar ist, auch wenn die Heizung ausfällt oder der Mieter auszieht.",
  },
  {
    question: "Was passiert nach dem Ende der Zinsbindung?",
    answer:
      "Die Restschuld wird zu den dann geltenden Konditionen weiterfinanziert, meist per Anschlussdarlehen bei derselben oder einer anderen Bank. Bei zehn Jahren Bindung und zwei Prozent Anfangstilgung stehen danach noch rund drei Viertel der ursprünglichen Summe offen. Steigt der Zins in dieser Zeit um zwei Prozentpunkte, steigt auch die Rate deutlich. Der Rechner rechnet nach der Zinsbindung mit demselben Zinssatz weiter – wer das Risiko sehen will, rechnet die Kalkulation einmal mit einem höheren Zins durch.",
  },
  {
    question: "Warum wird nur der Gebäudeanteil abgeschrieben?",
    answer:
      "Weil sich Grund und Boden nicht abnutzt. Abgeschrieben wird nur das Gebäude, üblicherweise mit zwei Prozent pro Jahr über fünfzig Jahre, bei Baujahren vor 1925 mit 2,5 Prozent und bei Fertigstellung ab 2023 mit drei Prozent. Der Gebäudeanteil wird aus dem Kaufvertrag oder über den Bodenrichtwert bestimmt und liegt je nach Lage zwischen 60 und 85 Prozent – in teuren Innenstadtlagen ist der Bodenanteil höher, die Abschreibung entsprechend kleiner. Die Kaufnebenkosten gehören anteilig mit zur Bemessungsgrundlage.",
  },
  {
    question: "Was ist die Spekulationsfrist?",
    answer:
      "Wer eine vermietete Immobilie innerhalb von zehn Jahren nach dem Kauf wieder verkauft, muss den Gewinn versteuern – und zwar mit dem persönlichen Steuersatz und erhöht um die zwischenzeitlich genutzte Abschreibung. Nach zehn Jahren ist der Gewinn steuerfrei. Selbst genutzte Immobilien sind davon ausgenommen, wenn sie im Verkaufsjahr und den beiden Jahren davor bewohnt wurden. Der Rechner weist die Steuer aus, sobald der Betrachtungszeitraum unter zehn Jahren liegt.",
  },
  {
    question: "Lohnt sich Kaufen oder Mieten?",
    answer:
      "Das hängt weniger am Kaufpreis als an drei Annahmen: der Wertentwicklung, der Rendite, die das Eigenkapital sonst gebracht hätte, und der Haltedauer. Wer zehn Jahre bleibt, hat die Kaufnebenkosten kaum verdient – sie sind sofort weg und stecken nicht im Immobilienwert. Wer dreißig Jahre bleibt, gewinnt fast immer. Der Rechner stellt beide Vermögen nebeneinander und unterstellt dabei, dass der Mieter sein Eigenkapital anlegt und die Differenz zur Kaufbelastung ebenfalls investiert.",
  },
  {
    question: "Sind die Kaufnebenkosten steuerlich absetzbar?",
    answer:
      "Bei vermieteten Objekten nicht sofort, aber anteilig über die Abschreibung: Grunderwerbsteuer, Notar- und Grundbuchkosten sowie die Maklerprovision gehören zu den Anschaffungskosten und werden zusammen mit dem Kaufpreis auf Gebäude und Grundstück aufgeteilt. Der Gebäudeanteil davon fließt in die Abschreibung ein. Bei Eigennutzung sind sie steuerlich unbeachtlich. Der Rechner berücksichtigt das automatisch.",
  },
];

/* ---------------------------------------------------------------------------
 * Manifest
 * ------------------------------------------------------------------------- */

export const immobilienrechner: ToolManifest = {
  slug: "immobilienrechner",
  name: "Immobilien-Rechner",
  tagline:
    "Kaufnebenkosten, Finanzierung, Mietrendite und Cashflow nach Steuern – für Kapitalanlage und Eigennutzung.",
  category: "wohnen",
  icon: House,
  status: "live",
  keywords: [
    "immobilienrechner",
    "kaufnebenkosten berechnen",
    "mietrendite berechnen",
    "immobilie als kapitalanlage",
    "grunderwerbsteuer rechner",
    "kaufen oder mieten rechner",
    "tilgungsrechner immobilie",
    "eigenkapitalrendite immobilie",
    "cashflow immobilie berechnen",
  ],

  about,
  sections: [...sections, uebersichtSection()],
  faq: [...sharedFaq, ...Object.values(grestFaq)],

  monetization: {
    adDensity: "medium",
    affiliate: immobilienAffiliate,
  },
};
