import { Car } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { autokostenAffiliate } from "./affiliate";

const about: string[] = [
  "Die meisten Leute überschlagen ihr Auto aus Tanken plus Versicherung plus Steuer – und liegen damit oft um mehr als die Hälfte daneben. Der größte Einzelposten ist fast immer der Wertverlust, und ausgerechnet der bleibt unsichtbar, weil dafür nie eine Rechnung kommt: Ein Auto für 22.000 Euro, das nach sechs Jahren noch 9.000 Euro wert ist, kostet allein dadurch rund 2.170 Euro im Jahr – mehr als Versicherung und Steuer zusammen. Dieser Rechner rechnet den Wertverlust deshalb explizit mit, linear über die geplante Haltedauer, statt ihn wie die meisten Kostenüberschläge zu ignorieren.",
  "Damit die Zahl vergleichbar ist – mit einer Bahncard, einem Carsharing-Abo oder einem zweiten, sparsameren Auto –, weist der Rechner die Gesamtkosten zusätzlich als Preis pro Kilometer aus. Das ist dieselbe Kennzahl, mit der auch der ADAC seine Autokosten-Übersicht veröffentlicht. Sie macht sichtbar, was die reine Monatssumme verschleiert: Wer wenig fährt, zahlt pro Kilometer deutlich mehr, weil Steuer, Versicherung und Wertverlust unabhängig von der Fahrleistung anfallen und sich nur auf wenige Kilometer verteilen.",
  "Wartung, Reparaturen und Verschleißteile lassen sich nicht auf den Euro genau vorhersagen – sie hängen von Modell, Alter und Fahrweise ab. Der Rechner arbeitet deshalb mit zwei getrennten Jahrespauschalen: „Wartung & Inspektion“ für Werkstatttermine nach Plan, Ölwechsel und die Hauptuntersuchung, „Verschleiß & Reifen“ für Reifensätze, Bremsen und Batterie. Wer die eigenen Werkstattrechnungen der letzten zwei, drei Jahre zur Hand hat, bekommt daraus einen deutlich genaueren Wert als aus jeder Pauschale.",
  "Kreditrate oder Leasingrate fließen bewusst nicht in dieses Ergebnis ein. Das ist eine Frage der Bezahlung, nicht des Unterhalts – zwei baugleiche Autos kosten in Steuer, Versicherung, Sprit und Wertverlust gleich viel, ganz gleich ob eines bar bezahlt wurde und das andere finanziert ist. Wer die monatliche Kreditrate mit einrechnen will, addiert sie am besten separat zum Ergebnis dieses Rechners – oder ermittelt sie zuerst mit dem Kreditrechner.",
  "Alle Vorgabewerte sind grobe Richtwerte und keine Zusage für ein bestimmtes Modell. Verbrauch, Versicherungsbeitrag und Wertverlust unterscheiden sich zwischen Kleinwagen und SUV, zwischen Vielfahrer und Wenigfahrer, zwischen Neuwagen und Gebrauchtem teils um ein Vielfaches. Der Rechner ist deshalb vor allem als Rahmen gedacht, in den die eigenen, tatsächlichen Zahlen eingetragen werden – am aussagekräftigsten ist er dort, wo echte Rechnungen und keine Schätzwerte stehen.",
];

const faq: FaqEntry[] = [
  {
    question:
      "Warum ist der Wertverlust die größte Kostenposition, obwohl kein Geld dafür überwiesen wird?",
    answer:
      "Weil ein Auto ab dem Kauf laufend an Wert verliert, unabhängig davon, ob es gefahren wird oder in der Garage steht. Dieser Verlust zeigt sich nicht auf dem Kontoauszug, sondern erst beim Verkauf oder in der Differenz zum Neupreis – und genau deshalb wird er beim Überschlagen so oft vergessen. Rechnerisch ist er trotzdem ein echter Kostenfaktor: Geld, das beim Kauf gebunden war und beim Verkauf nicht wiederkommt.",
  },
  {
    question:
      "Wie bestimme ich den Restwert meines Autos nach ein paar Jahren?",
    answer:
      "Am zuverlässigsten über aktuelle Angebote für vergleichbare Modelle in ähnlichem Alter und ähnlicher Laufleistung auf gängigen Gebrauchtwagenbörsen. Als grobe Faustregel verlieren Neuwagen im ersten Jahr etwa 20 bis 25 Prozent, danach jährlich weitere 10 bis 15 Prozent – nach sechs Jahren bleiben oft noch 30 bis 40 Prozent des Neupreises. Elektroautos und wenig gefragte Modelle verlieren häufig schneller, gesuchte Gebrauchte langsamer.",
  },
  {
    question:
      "Was zählt zu „Wartung & Inspektion“ und was zu „Verschleiß & Reifen“?",
    answer:
      "Unter Wartung & Inspektion stehen die Termine, die im Wartungsplan des Herstellers vorgesehen sind: Ölwechsel, Filter, Inspektionen sowie die Hauptuntersuchung alle zwei Jahre. Verschleiß & Reifen umfasst alles, was sich mit der Zeit abnutzt und ausgetauscht werden muss – Reifensätze, Bremsscheiben und -beläge, die Batterie. Die Trennung hilft, weil beide Posten unterschiedlich stark von der Fahrleistung abhängen: Reifen und Bremsen nutzen sich mit den Kilometern ab, viele Inspektionen sind dagegen fest an die Zeit gekoppelt.",
  },
  {
    question: "Sind Kreditrate oder Leasingrate in den Kosten enthalten?",
    answer:
      "Nein, bewusst nicht. Dieser Rechner bildet den laufenden Unterhalt ab – was ein Auto an Wertverlust, Betrieb und Instandhaltung kostet, unabhängig von der Bezahlweise. Eine Finanzierung kommt als eigene Position obendrauf und lässt sich am besten getrennt mit dem Kreditrechner ermitteln, weil Zinssatz und Laufzeit dort eigene Stellschrauben sind.",
  },
  {
    question: "Wie finde ich meinen tatsächlichen Verbrauch?",
    answer:
      "Am genauesten über die letzten Tankquittungen: getankte Menge geteilt durch die seit dem letzten Volltanken gefahrenen Kilometer, mal 100. Der Herstellerverbrauch nach WLTP liegt im Alltag – vor allem bei viel Kurzstrecke, Autobahn oder Klimaanlage – häufig 15 bis 25 Prozent darunter. Wer keine eigenen Werte hat, kommt mit dem WLTP-Wert plus einem Aufschlag von etwa 20 Prozent näher an die Realität als mit dem reinen Herstellerwert.",
  },
  {
    question: "Was ist ein guter Wert für Kosten pro Kilometer?",
    answer:
      "Für einen durchschnittlichen Kompaktwagen mit rund 12.000 bis 15.000 Kilometern im Jahr bewegen sich die Gesamtkosten häufig zwischen 30 und 45 Cent pro Kilometer, größere oder neuere Fahrzeuge deutlich darüber. Der Wert sinkt mit steigender Fahrleistung, weil sich die Fixkosten auf mehr Kilometer verteilen, und er ist der Maßstab, mit dem sich ein Auto ehrlich gegen Alternativen wie ein Jobticket oder Carsharing rechnen lässt.",
  },
  {
    question: "Wie unterscheidet sich das bei einem Elektroauto?",
    answer:
      "Strom kostet pro gefahrenem Kilometer meist deutlich weniger als Benzin oder Diesel, und Wartung fällt geringer aus, weil Verschleißteile wie Ölwechsel oder Auspuff entfallen. Dem steht oft ein höherer Kaufpreis und damit ein höherer absoluter Wertverlust gegenüber, auch wenn die Kfz-Steuer bei vielen Elektroautos noch bis zu einer gesetzlich befristeten Frist entfällt. Über den Umschalter bei „Antrieb“ rechnet der Rechner mit Kilowattstunden statt Litern und benennt den Kraftstoffposten in Stromkosten um.",
  },
];

export const autokosten: ToolManifest = {
  slug: "autokosten",
  name: "Auto-Unterhaltskosten-Rechner",
  tagline:
    "Wertverlust, Kraftstoff, Steuer, Versicherung, Wartung und Verschleiß zusammen – als Kosten pro Monat und pro Kilometer.",
  seoTitle: "Autokosten-Rechner: Kosten pro Monat und Kilometer",
  metaDescription:
    "Unterhaltskosten eines Autos berechnen: Wertverlust, Kraftstoff, Kfz-Steuer, Versicherung, Wartung und Verschleiß – pro Monat und pro Kilometer.",
  category: "geld",
  icon: Car,
  status: "live",
  keywords: [
    "autokosten berechnen",
    "unterhaltskosten auto rechner",
    "was kostet ein auto im monat",
    "kosten pro kilometer auto",
    "autokosten rechner",
    "wertverlust auto berechnen",
    "kfz kosten rechner",
    "autounterhalt berechnen",
  ],

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: autokostenAffiliate,
  },
};
