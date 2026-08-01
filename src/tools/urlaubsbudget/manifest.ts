import { Luggage } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { urlaubsbudgetAffiliate } from "./affiliate";
import Component from "./Component";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Ein Reisebudget scheitert selten am Rechnen und fast immer an zwei Verwechslungen. Die erste: Nächte und Tage sind nicht dasselbe. Sieben Übernachtungen bedeuten acht Tage, an denen gegessen wird – der Anreisetag zählt mit. Wer Verpflegung mit den Nächten multipliziert, plant systematisch einen ganzen Tag zu wenig ein. Die zweite: Das Zimmer kostet pro Nacht, nicht pro Person und Nacht. So steht es in jedem Angebot, und so rechnet dieser Planer.",
  "Kinder kosten nicht überall gleich viel, und ein einziger Kopf-Faktor über alle Posten liegt deshalb zwangsläufig irgendwo daneben. Beim Flug zahlen sie ab zwei Jahren fast den vollen Preis, beim Essen und bei Eintritten deutlich weniger. Der Planer trennt das: Die Anreise zählt jeden Kopf voll, Verpflegung und Aktivitäten nur zu einem einstellbaren Anteil, voreingestellt auf 60 Prozent. Für Kleinkinder sind 30 bis 40 Prozent näher an der Wirklichkeit, für Teenager 90 bis 100.",
  "Der Puffer ist kein Sicherheitsdenken, sondern Erfahrung. Er deckt nicht den Notfall ab, sondern die Gelegenheit: den Ausflug, der sich erst vor Ort ergibt, das teurere Restaurant am letzten Abend, das Taxi bei Regen. Zehn Prozent sind ein guter Startwert. Ein Budget ohne Puffer wird an genau diesen Stellen gerissen, und dann fühlt sich der Urlaub nach Verzicht an, obwohl das Geld eigentlich da gewesen wäre.",
  "Das Tagesbudget vor Ort ist die Zahl, mit der man tatsächlich unterwegs ist. Es enthält nur, was täglich aus der Geldbörse geht – Verpflegung, Aktivitäten, Nahverkehr –, und lässt Anreise und Unterkunft weg, weil die längst bezahlt sind. Als Orientierung für Europa: 50 bis 70 Euro je Person und Tag in Süd- und Osteuropa, 80 bis 110 in Skandinavien und der Schweiz. Liegt der eingetragene Wert unter 20 Euro, weist der Planer darauf hin.",
  "Aus dem Budget und der Zeit bis zur Abreise wird schließlich die monatliche Sparrate. Sie wird schlicht geteilt und nicht verzinst gerechnet: Eine Urlaubskasse liegt sechs bis zwölf Monate auf einem Tagesgeldkonto, und die Zinsen daraus liegen unter dem, was der Wechselkurs am Reisetag ausmacht. Eine Zinsrechnung würde hier Genauigkeit vortäuschen, die es nicht gibt. Aufgerundet wird trotzdem, damit die Kasse am Ende nicht knapp danebenliegt.",
  "Alle Ergebnisse sind Planungszahlen, keine Angebote. Preise für Flug und Unterkunft schwanken je nach Buchungszeitpunkt erheblich, und gerade in den Schulferien liegen zwischen der günstigsten und der teuersten Woche schnell 30 bis 50 Prozent. Der Planer rechnet das durch, was du einträgst – er sucht keine Preise.",
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie viel Geld brauche ich für eine Woche Urlaub?",
    answer:
      "Für zwei Personen mit Flug, Mittelklassehotel und normalem Essen sind rund 2.300 Euro ein realistischer Startwert – das entspricht der Voreinstellung dieses Planers. Ohne Flug und mit Ferienwohnung sinkt der Betrag schnell unter 1.500 Euro. Entscheidend sind drei Posten in dieser Reihenfolge: Anreise, Unterkunft und Verpflegung.",
  },
  {
    question: "Warum rechnet der Planer mit einem Tag mehr als Nächten?",
    answer:
      "Weil der Anreisetag mitgegessen wird. Sieben Übernachtungen bedeuten acht Tage mit Frühstück, Mittag und Abendessen. Die Unterkunft wird deshalb nach Nächten gerechnet, alles Übrige nach Tagen. Bei zwei Personen und 35 Euro am Tag macht diese Unterscheidung 70 Euro aus.",
  },
  {
    question: "Wie viel Puffer sollte ich einplanen?",
    answer:
      "Zehn Prozent sind ein guter Startwert, bei Fernreisen und langen Aufenthalten eher fünfzehn. Unter fünf Prozent wird es eng: Ein verpasster Anschluss, ein Arztbesuch oder ein teureres Zimmer als gebucht sprengen dann bereits das Budget. Der Planer weist ausdrücklich darauf hin, wenn der Puffer zu knapp gesetzt ist.",
  },
  {
    question: "Zählt der Planer Kinder anders als Erwachsene?",
    answer:
      "Bei Verpflegung und Aktivitäten ja, voreingestellt zu 60 Prozent. Bei der Anreise pro Person zählen Kinder voll, weil Flug und Bahn ab zwei Jahren kaum Rabatt geben. Die Unterkunft läuft pro Nacht und ist von der Personenzahl ohnehin unabhängig. Der Anteil lässt sich in der Feineinstellung ändern.",
  },
  {
    question: "Wird die Sparrate verzinst gerechnet?",
    answer:
      "Nein, bewusst nicht. Bei sechs bis zwölf Monaten Laufzeit und Tagesgeldzinsen geht es um einen zweistelligen Eurobetrag – weniger als die Schwankung der Flugpreise oder des Wechselkurses. Der offene Betrag wird schlicht durch die Monate geteilt und dabei aufgerundet, damit das Ziel sicher erreicht wird.",
  },
  {
    question: "Was gehört ins Tagesbudget vor Ort und was nicht?",
    answer:
      "Hinein gehört alles, was tatsächlich täglich ausgegeben wird: Verpflegung, Eintritte, Nahverkehr. Nicht hinein gehören Anreise und Unterkunft, weil sie vor der Reise bezahlt sind und nicht mehr in der Geldbörse liegen. Genau deshalb weist der Planer beide Zahlen getrennt aus.",
  },
  {
    question: "Kann ich mein Budget mit jemandem teilen?",
    answer:
      "Ja. Alle Eingaben stehen in der Adresszeile, sobald du sie änderst – der Link führt also zum fertig ausgefüllten Rechner. Über die Schaltfläche unter dem Ergebnis lässt er sich kopieren oder direkt weitergeben. Persönliche Daten sind darin keine, nur Beträge und Anzahl der Reisenden.",
  },
];

export const urlaubsbudget: ToolManifest = {
  slug: "urlaubsbudget",
  name: "Urlaubsbudget-Planer",
  tagline:
    "Was der Urlaub am Ende kostet – und was du bis zur Abreise monatlich zurücklegen musst.",
  category: "alltag",
  icon: Luggage,
  status: "live",
  keywords: [
    "urlaubsbudget berechnen",
    "urlaub kosten rechner",
    "reisekosten berechnen",
    "urlaubskasse sparen",
    "tagesbudget urlaub",
    "familienurlaub kosten",
    "wie viel geld im urlaub",
    "reisebudget planen",
    "urlaub sparen monatlich",
  ],

  Component,
  // Das Abreisedatum darf nicht im Client entstehen: sonst weicht der erste
  // Client-Render vom SSR-HTML ab.
  getDefaultParams: () => ({ heute: todayIso() }),
  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: urlaubsbudgetAffiliate,
  },
};
