import { HandCoins } from "lucide-react";
import type { ToolManifest } from "@/tools/types";
import { trinkgeldAffiliate } from "./affiliate";

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

  monetization: {
    adDensity: "low",
    affiliate: trinkgeldAffiliate,
  },
};
