import { HandCoins } from "lucide-react";
import type { ContentSection, ToolManifest } from "@/tools/types";
import { trinkgeldAffiliate } from "./affiliate";

/**
 * Der ausführliche Teil unter dem Einstieg: internationale Gepflogenheiten,
 * die im Rechner selbst keinen Platz haben, aber zur Frage "wie viel
 * Trinkgeld" naheliegend dazugehören.
 */
const sections: ContentSection[] = [
  {
    heading: "Trinkgeld international",
    blocks: [
      {
        type: "p",
        text: "Wie viel Trinkgeld angemessen ist, unterscheidet sich stark von Land zu Land – wer im Ausland isst, sollte die dortige Gepflogenheit kennen und nicht die deutsche mitnehmen.",
      },
      {
        type: "table",
        caption: "Übliches Trinkgeld im Restaurant, grobe Richtwerte",
        head: ["Land", "Üblich"],
        rows: [
          ["Deutschland, Österreich, Schweiz", "5–10 %, aufgerundet"],
          ["USA", "15–20 %, gilt als fester Bestandteil des Lohns"],
          ["Vereinigtes Königreich", "10–12,5 %, oft schon als „service charge“ auf der Rechnung"],
          ["Frankreich, Italien", "Bedienung meist gesetzlich inbegriffen, zusätzlich wenig oder nichts üblich"],
          ["Japan", "Kein Trinkgeld – gilt teils sogar als unhöflich"],
        ],
      },
      {
        type: "note",
        text: "In den USA ist Trinkgeld praktisch keine Kür: Der gesetzliche Mindestlohn für Servicekräfte liegt dort in vielen Bundesstaaten deutlich unter dem allgemeinen Mindestlohn, weil das Trinkgeld den Unterschied ausgleichen soll.",
      },
    ],
  },
  {
    heading: "Wann Trinkgeld schon inbegriffen ist",
    blocks: [
      {
        type: "p",
        text: "Manche Rechnungen weisen bereits ein „Bedienungsgeld“ oder eine „Service Charge“ aus – dann ist das Trinkgeld bereits Teil des Preises, und was zusätzlich gegeben wird, ist eine Extra-Anerkennung, keine Pflicht. Steht auf der Rechnung nichts dergleichen, ist das Trinkgeld in Deutschland vollständig freiwillig und geht direkt an die Bedienung, nicht an den Betrieb.",
      },
    ],
  },
  {
    heading: "Woher der Name kommt und wie es steuerlich behandelt wird",
    blocks: [
      {
        type: "p",
        text: "Das Wort „Trinkgeld“ meint wörtlich Geld für ein Getränk – ursprünglich eine kleine Zugabe, mit der sich die Bedienung nach Feierabend selbst ein Getränk leisten konnte, nicht eine Bewertung der Servicequalität wie im heutigen Verständnis. Ähnliche Ursprünge hat das englische „tip“, das häufig, aber nicht gesichert, auf „to insure promptness“ zurückgeführt wird.",
      },
      {
        type: "note",
        text: "Steuerlich ist Deutschland ungewöhnlich großzügig: Trinkgeld, das Angestellte freiwillig von Gästen erhalten, ist nach § 3 Nr. 51 EStG vollständig steuerfrei, ohne Obergrenze – solange kein Rechtsanspruch darauf besteht. Für Selbstständige, etwa eine Friseurmeisterin mit eigenem Salon, gilt diese Steuerfreiheit dagegen nicht.",
      },
    ],
  },
];

export const trinkgeld: ToolManifest = {
  slug: "trinkgeld",
  name: "Trinkgeld-Splitter",
  tagline:
    "Rechnung plus Trinkgeld fair auf alle aufteilen – mit dem Betrag, den jede Person wirklich zahlt.",
  category: "geld",
  icon: HandCoins,
  status: "live",
  keywords: [
    "trinkgeld rechner",
    "rechnung teilen",
    "trinkgeld berechnen",
    "rechnung aufteilen",
    "trinkgeld prozent",
    "restaurant",
    "gruppe",
  ],

  about: [
    "Am Ende eines gemeinsamen Abends steht immer dieselbe Rechenaufgabe: Rechnung, Trinkgeld, geteilt durch alle. Gib den Betrag ein, wähle das Trinkgeld und die Zahl der Personen – der Rechner sagt dir sofort, was jede Person auf den Tisch legt. Wer nur weiß, was das eigene Gericht gekostet hat, schaltet auf „Pro Person“ um und gibt diesen Betrag ein – die Gesamtsumme rechnet sich von selbst.",
    "In Deutschland sind 5 bis 10 Prozent Trinkgeld üblich, bei besonders gutem Service auch mehr. Trinkgeld ist freiwillig und immer eine Anerkennung, keine Pflicht. Praktisch ist das Aufrunden: Wenn jede Person auf 50 Cent oder einen ganzen Euro aufrundet, wird das Zahlen einfacher – der Rest geht als Trinkgeld mit. Der Rechner zeigt dir, wie viel Prozent dabei am Ende zusammenkommen.",
    "Gerechnet wird in ganzen Cent, damit sich kein Rundungsfehler einschleicht. Geht die Summe nicht glatt auf, wird pro Person auf den nächsten Cent aufgerundet – so reicht der Betrag am Tisch immer.",
  ],

  faq: [
    {
      question: "Wie viel Trinkgeld ist in Deutschland üblich?",
      answer:
        "Im Restaurant sind 5 bis 10 Prozent gängig, bei sehr gutem Service auch mehr. Im Café oder an der Bar rundet man meist einfach auf. Trinkgeld ist freiwillig – niemand muss sich rechtfertigen, wenn er nichts gibt.",
    },
    {
      question:
        "Kann ich den Betrag pro Person eingeben statt der Gesamtrechnung?",
      answer:
        "Ja. Über den Umschalter bei „Betrag“ wechselst du zwischen Gesamtrechnung und Betrag pro Person. Praktisch, wenn jede Person einzeln bestellt hat und du nur den eigenen Posten kennst – der Rechner multipliziert das für die Gesamtsumme hoch und teilt Trinkgeld und Rundung wie gewohnt auf alle auf.",
    },
    {
      question:
        "Warum zahlt jede Person ein paar Cent mehr als der geteilte Betrag?",
      answer:
        "Weil sich Beträge oft nicht glatt teilen lassen. 10 Euro auf drei Personen sind 3,33 Euro – zusammen nur 9,99 Euro. Der Rechner rundet deshalb pro Person auf den nächsten Cent auf, damit die Summe am Tisch immer reicht. Die Differenz ist im Trinkgeld enthalten.",
    },
    {
      question:
        "Wird das Trinkgeld auf den Betrag vor oder nach dem Aufrunden berechnet?",
      answer:
        "Der Prozentsatz gilt für den eingegebenen Rechnungsbetrag. Das Aufrunden kommt danach dazu und erhöht das Trinkgeld – wie viel es am Ende tatsächlich ist, siehst du unter „Trinkgeld effektiv“.",
    },
    {
      question: "Kann ich das Ergebnis mit anderen teilen?",
      answer:
        "Ja. Betrag, Trinkgeld, Personenzahl und Rundung stehen in der Adresszeile. Der Button „Link kopieren“ erzeugt einen Link, der bei allen dasselbe Ergebnis zeigt – praktisch für die Gruppenchat-Abrechnung.",
    },
  ],

  sections,

  monetization: {
    adDensity: "low",
    affiliate: trinkgeldAffiliate,
  },
};
