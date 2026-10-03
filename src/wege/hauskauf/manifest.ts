import { Route } from "lucide-react";
import type { ContentSection, FaqEntry } from "@/tools/types";
import type { WegManifest } from "../types";
import { hauskaufAffiliate } from "./affiliate";
import {
  BELASTUNGSQUOTE_ENG,
  BELASTUNGSQUOTE_KOMFORTABEL,
  RESTSCHULD_RISIKO_ANTEIL,
} from "./urteil";

const sections: ContentSection[] = [
  {
    heading: "Wo die Schwellen liegen",
    blocks: [
      {
        type: "table",
        caption:
          "Belastungsquote: Rate plus Nebenkosten geteilt durch das Haushaltsnetto",
        head: ["Belastungsquote", "Einordnung"],
        rows: [
          [`unter ${BELASTUNGSQUOTE_KOMFORTABEL} %`, "komfortabel"],
          [
            `${BELASTUNGSQUOTE_KOMFORTABEL}–${BELASTUNGSQUOTE_ENG} %`,
            "tragbar, aber eng",
          ],
          [`über ${BELASTUNGSQUOTE_ENG} %`, "Vorsicht angebracht"],
        ],
      },
      {
        type: "note",
        text: `Zusätzlich markiert der Weg eine Restschuld von über ${RESTSCHULD_RISIKO_ANTEIL} Prozent der ursprünglichen Darlehenssumme zum Ende der Zinsbindung als eigenes Risiko – unabhängig davon, wie komfortabel die heutige Rate aussieht.`,
      },
    ],
  },
];

const about: string[] = [
  `Der Immobilien-Rechner sagt dir die monatliche Rate. Der Brutto-Netto-Rechner sagt dir das Haushaltsnetto. Beide Zahlen für sich sind schnell falsch eingeordnet – ${BELASTUNGSQUOTE_ENG} Prozent Belastungsquote klingen erst mal nach viel, sind es aber nur, wenn du weißt, worauf sie sich beziehen. Dieser Weg rechnet beides in einem Zug durch und macht daraus ein Urteil: komfortabel, tragbar oder eng.`,
  `Die Belastungsquote ist die Rate plus Nebenkosten geteilt durch das Haushaltsnetto. Banken prüfen bei der Kreditvergabe etwas Ähnliches, oft strenger. Unter ${BELASTUNGSQUOTE_KOMFORTABEL} Prozent gilt eine Finanzierung als komfortabel – Urlaub, Rücklagen und ein Jobwechsel passen noch daneben. Bis ${BELASTUNGSQUOTE_ENG} Prozent ist sie tragbar, aber eng: Zwei, drei größere Ausgaben im selben Jahr, und es wird knapp. Darüber ist Vorsicht angebracht, unabhängig davon, was eine Bank noch finanzieren würde.`,
  `Der Liquiditätspuffer ist die Zahl, die im Alltag zählt: Netto minus Wohnbelastung, also das, was tatsächlich noch für alles andere übrig bleibt – Lebensmittel, Versicherungen, Kinder, Auto, Rücklagen. Eine niedrige Belastungsquote bei einem sehr hohen Einkommen und ein hoher Puffer bei einem niedrigen Einkommen können sich unterschiedlich anfühlen, obwohl die Quote ähnlich aussieht. Deshalb stehen beide Zahlen nebeneinander, nicht nur eine.`,
  `Die zweite Zahl im Urteil ist die Restschuld zum Ende der Zinsbindung, direkt aus dem Tilgungsplan des Immobilien-Rechners. Stehen dort noch über ${RESTSCHULD_RISIKO_ANTEIL} Prozent der ursprünglichen Darlehenssumme offen, markiert der Weg das als Risiko – nicht weil die heutige Rate ein Problem wäre, sondern weil diese Summe zu einem dann unbekannten Zinssatz weiterfinanziert werden muss. Eine höhere Anfangstilgung senkt diese Zahl spürbar, auch wenn sie die heutige Rate erhöht.`,
  `Gerechnet wird mit einem Haushaltseinkommen. Verdienen zwei Personen, zählst du beide Bruttogehälter zusammen – der Brutto-Netto-Rechner selbst kennt nur ein Gehalt und eine Steuerklasse, eine echte Zusammenveranlagung mit zwei unterschiedlichen Einkommen weicht davon leicht ab. Laufende Kosten stammen aus den Angaben zu Hausgeld, Instandhaltung und Verwaltung im ersten Schritt; Heiz- und Stromkosten sind nicht eingerechnet, weil sie stark vom Gebäude abhängen und im Immobilien-Rechner selbst nicht abgefragt werden.`,
  "Wie beim Immobilien-Rechner gilt: Alle Angaben sind Näherungen, keine Finanzierungszusage und keine Steuer- oder Anlageberatung. Für die einzelnen Stellschrauben – Zinsbindung, Tilgung, Steuerklasse, Kirchensteuer – lohnt sich der Blick in die beiden Rechner, aus denen dieser Weg zusammengesetzt ist.",
];

const faq: FaqEntry[] = [
  {
    question: "Wie viel Prozent vom Netto darf die Rate sein?",
    answer: `Als Faustregel gilt: unter ${BELASTUNGSQUOTE_KOMFORTABEL} Prozent des Haushaltsnettos ist komfortabel, bis ${BELASTUNGSQUOTE_ENG} Prozent noch tragbar, aber eng. Banken rechnen bei der Kreditvergabe eine eigene Haushaltsrechnung mit oft strengeren Annahmen – wer dort durchkommt, liegt also nicht automatisch komfortabel. Die Quote allein sagt außerdem nichts über die absolute Höhe: 35 Prozent von 6.000 Euro lassen mehr Luft als 35 Prozent von 2.500 Euro, deshalb zeigt dieser Weg zusätzlich den Liquiditätspuffer in Euro.`,
  },
  {
    question: "Was bedeutet die Einstufung „tragbar“ genau?",
    answer:
      "Tragbar heißt: Die Rechnung geht rechnerisch auf, aber ohne großen Spielraum. Zwischen 30 und 40 Prozent Belastungsquote reicht das Netto für Rate und Nebenkosten, doch mehrere unerwartete Ausgaben im selben Jahr – eine Reparatur, ein Jobwechsel mit Gehaltseinbruch, eine Geburt – können eng werden. „Tragbar“ ist kein Warnsignal, aber eine Einladung, den Puffer in Euro genauer anzusehen, bevor du unterschreibst.",
  },
  {
    question: "Warum wird die Restschuld gewarnt, obwohl die Rate stimmt?",
    answer: `Weil die heutige Rate nicht das eigentliche Risiko ist. Zum Ende der Zinsbindung – oft nach zehn Jahren – muss die dann noch offene Restschuld zu einem Zinssatz weiterfinanziert werden, den heute niemand kennt. Stehen dort noch über ${RESTSCHULD_RISIKO_ANTEIL} Prozent der ursprünglichen Darlehenssumme offen, markiert der Weg das als Risiko. Eine höhere Anfangstilgung senkt diese Restschuld deutlich, auch wenn sie die Rate heute erhöht – das lässt sich im ersten Schritt direkt durchspielen.`,
  },
  {
    question: "Wir verdienen zu zweit – wie trage ich das ein?",
    answer:
      "Addiere beide Bruttogehälter und trage die Summe im zweiten Schritt ein. Der Brutto-Netto-Rechner dahinter kennt nur eine Steuerklasse und ein Gehalt; bei einer echten gemeinsamen Veranlagung mit zwei unterschiedlichen Einkommen weicht das tatsächliche Netto leicht von der Summe zweier Einzelrechnungen ab, meist zugunsten des Haushalts. Für eine grobe Einschätzung reicht die Addition.",
  },
  {
    question: "Sind Heizung und Strom in der Belastung enthalten?",
    answer:
      "Nein. Die Wohnbelastung enthält Rate, nicht umlagefähiges Hausgeld, Instandhaltungsrücklage und Verwaltung – aus den Angaben im ersten Schritt. Heiz- und Stromkosten hängen stark vom Gebäude, seiner Dämmung und der Personenzahl ab und werden hier nicht abgefragt. Für eine genauere Schätzung dieser Posten hilft der Energiekosten-Rechner zusätzlich zu diesem Weg.",
  },
  {
    question: "Ersetzt dieses Urteil ein Beratungsgespräch bei der Bank?",
    answer:
      "Nein. Der Weg zeigt, ob sich Kaufpreis und Einkommen überhaupt zusammen rechnen lassen, und macht das an zwei nachvollziehbaren Zahlen fest. Eine Bank prüft zusätzlich Bonität, Schufa, Beleihungswert des Objekts und eigene, oft konservativere Haushaltsrechnungen. Wer hier komfortabel abschneidet, hat eine gute Ausgangslage für das Gespräch – keine Zusage.",
  },
];

export const hauskauf: WegManifest = {
  slug: "hauskauf",
  name: "Check: Hauskauf",
  tagline:
    "Immobilie, Finanzierung und Nettoeinkommen in einem Urteil: trägt die Rate deinen Haushalt?",
  seoTitle: "Hauskauf-Check: Kann ich mir die Immobilie leisten?",
  metaDescription:
    "Hauskauf durchrechnen: Immobilie, Finanzierung und Nettoeinkommen in einem Urteil – trägt dein Haushalt die Rate, und wie hoch ist die Belastung?",
  sources: [
    {
      label: "§ 11 GrEStG – Steuersatz, Abrundung",
      href: "https://www.gesetze-im-internet.de/grestg_1983/__11.html",
      note: "Grunderwerbsteuer als Teil der Kaufnebenkosten",
    },
    {
      label: "§ 489 BGB – Ordentliches Kündigungsrecht des Darlehensnehmers",
      href: "https://www.gesetze-im-internet.de/bgb/__489.html",
      note: "Kündigung nach zehn Jahren Zinsbindung",
    },
  ],
  category: "wohnen",
  icon: Route,
  status: "live",
  keywords: [
    "hauskauf rechner",
    "kann ich mir ein haus leisten",
    "wie viel haus kann ich mir leisten",
    "immobilie leisten rechner",
    "hauskauf budget",
    "baufinanzierung tragbarkeit",
    "belastungsquote rechner",
    "haus kaufen gehalt",
  ],

  sourceTools: [
    {
      slug: "immobilienrechner",
      detailEyebrow: "Alle Angaben zur Immobilie",
      detailDescription:
        "Tilgungsplan, Jahresverlauf und Kaufen-oder-Mieten im Detail.",
      backlinkDescription:
        "Dieses Ergebnis mit deinem Nettoeinkommen zusammenrechnen: komfortabel, tragbar oder eng?",
    },
    {
      slug: "bruttonetto",
      detailEyebrow: "Alle Angaben zum Einkommen",
      detailDescription: "Jeder Abzug einzeln, mit Steuerklassen-Vergleich.",
      backlinkDescription:
        "Dieses Netto mit einer Immobilienfinanzierung zusammenrechnen: komfortabel, tragbar oder eng?",
    },
  ],

  about,
  sections,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: hauskaufAffiliate,
  },
};
