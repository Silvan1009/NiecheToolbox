import { House } from "lucide-react";
import { formatInteger } from "@/lib/format";
import { regions } from "@/tools/brueckentage/logic";
import type { FaqEntry, ToolManifest, ToolVariant } from "@/tools/types";
import { immobilienAffiliate } from "./affiliate";
import Component from "./Component";
import { grestHistorie, grestSpanne, grunderwerbsteuer } from "./grunderwerbsteuer";
import { defaultInput } from "./logic";

const { notarPercent, maklerPercent } = defaultInput();

/** Kaufnebenkosten in Euro für einen Kaufpreis, bei gegebenem Steuersatz. */
const nebenkosten = (kaufpreis: number, grest: number) =>
  Math.round((kaufpreis * (grest + notarPercent + maklerPercent)) / 100);

const euro = (betrag: number) => `${formatInteger(betrag)} Euro`;

/** Prozentangabe mit Dezimalkomma und ohne angehängte Nullen: "3,5", "9,07". */
const prozent = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");

/* ---------------------------------------------------------------------------
 * Inhalte
 * ------------------------------------------------------------------------- */

const about: string[] = [
  "Beim Immobilienkauf entscheidet selten der Kaufpreis, sondern das, was daneben steht. Grunderwerbsteuer, Notar, Grundbuch und Maklerprovision summieren sich je nach Bundesland auf 8 bis 12 Prozent – bei einer Wohnung für 350.000 Euro sind das 28.000 bis 42.000 Euro. Diese Summe ist zum Notartermin fällig und wird von Banken so gut wie nie mitfinanziert. Wer sie nicht als Guthaben hat, bekommt die Finanzierung nicht. Deshalb steht sie hier ganz vorne und nicht im Kleingedruckten.",
  "Die zweite Zahl, die häufig falsch gelesen wird, ist die Rendite. Die Bruttomietrendite setzt die Jahreskaltmiete ins Verhältnis zum Kaufpreis und ignoriert damit sowohl die Nebenkosten als auch alles, was laufend abgeht: nicht umlagefähiges Hausgeld, Verwaltung, Instandhaltungsrücklage und das Risiko, dass eine Wohnung mal leer steht. Die Nettomietrendite rechnet all das mit und liegt regelmäßig ein bis anderthalb Prozentpunkte darunter. Für die Frage, ob sich ein Objekt trägt, ist nur sie brauchbar.",
  "Beim Darlehen ist nicht die heutige Rate das Risiko, sondern die Restschuld am Ende der Zinsbindung. Bei zwei Prozent Anfangstilgung und zehn Jahren Bindung sind nach Ablauf noch rund drei Viertel der Darlehenssumme offen – zu einem Zinssatz, den heute niemand kennt. Der Rechner ermittelt diese Restschuld über einen echten monatlichen Tilgungsplan, nicht über eine Jahresnäherung, und zeigt im Jahresverlauf, wie sich das Verhältnis von Zins zu Tilgung mit der Zeit dreht.",
  "Bei vermieteten Objekten entscheidet die Steuer über Plus oder Minus. Abgeschrieben wird nur das Gebäude, nicht der Grund und Boden – deshalb fragt der Rechner nach dem Gebäudeanteil, der je nach Lage zwischen 60 und 85 Prozent liegt. Zusammen mit den Schuldzinsen führt die Abschreibung oft zu einem steuerlichen Verlust, obwohl tatsächlich Geld hereinkommt. Diese Erstattung ist ein echter Teil der Rendite und steht hier als eigene Zeile im Ergebnis.",
  "Im Modus Eigennutzung fällt die Mieteinnahme weg, dafür zählt die Miete, die du nach dem Kauf nicht mehr zahlst. Der Vergleich mit dem Mieten ist nur dann fair, wenn das Eigenkapital auf der anderen Seite ebenfalls arbeitet: Wer nicht kauft, kann die 80.000 Euro anlegen und die monatliche Differenz zwischen Rate und Miete dazulegen. Genau so rechnet der Rechner – und deshalb kann Mieten je nach angenommener Rendite auch dann besser abschneiden, wenn die Immobilie im Wert steigt.",
  "Alle Angaben sind Näherungen und keine Steuer- oder Anlageberatung. Solidaritätszuschlag, Kirchensteuer, der progressive Verlauf des Steuertarifs und Sonderfälle wie Denkmalabschreibung oder Förderkredite bleiben außen vor. Die Wertentwicklung ist die unsicherste Annahme im ganzen Rechner: Sie lässt sich nicht vorhersagen, sondern nur durchspielen. Wer wissen will, ob eine Kalkulation trägt, sollte sie einmal mit null Prozent Wertsteigerung rechnen.",
];

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
 * Bundesland-Varianten
 * ------------------------------------------------------------------------- */

function buildVariants(): ToolVariant[] {
  const spanne = grestSpanne();

  return regions.map((region) => {
    const satz = grunderwerbsteuer[region.code];
    const quote = satz + notarPercent + maklerPercent;
    const nk300 = nebenkosten(300000, satz);
    const nk500 = nebenkosten(500000, satz);

    // Was dasselbe Objekt im günstigsten und im teuersten Land kosten würde.
    const gegenBayern = Math.round((300000 * (satz - spanne.min)) / 100);
    const gegenHoechst = Math.round((300000 * (spanne.max - satz)) / 100);

    const vergleich =
      satz === spanne.min
        ? `Damit ist ${region.name} das günstigste Bundesland – im Vergleich zu den Ländern mit ${prozent(spanne.max)} Prozent spart ein Kauf hier ${euro(gegenHoechst)} bei 300.000 Euro Kaufpreis.`
        : satz === spanne.max
          ? `Damit gehört ${region.name} zu den teuersten Bundesländern: Derselbe Kauf über 300.000 Euro kostet hier ${euro(gegenBayern)} mehr Steuer als in Bayern.`
          : `Gegenüber Bayern mit ${prozent(spanne.min)} Prozent sind das bei 300.000 Euro Kaufpreis ${euro(gegenBayern)} mehr, gegenüber den Ländern mit ${prozent(spanne.max)} Prozent ${euro(gegenHoechst)} weniger.`;

    return {
      slug: `kaufnebenkosten-${region.slug}`,
      title: `Kaufnebenkosten ${region.name}: Rechner mit ${prozent(satz)} % Grunderwerbsteuer`,
      description: `Bei ${prozent(satz)} Prozent Grunderwerbsteuer kostet ein Kauf über 300.000 Euro in ${region.name} rund ${euro(nk300)} an Nebenkosten. Mit Finanzierung, Mietrendite und Cashflow.`,
      heading: `Immobilien-Rechner für ${region.name}`,
      params: { land: region.code, grest: satz },

      about: [
        `In ${region.name} beträgt die Grunderwerbsteuer ${prozent(satz)} Prozent des Kaufpreises – ${grestHistorie[region.code]}. Sie ist der größte Einzelposten der Kaufnebenkosten und wird fällig, sobald der Kaufvertrag notariell beurkundet ist. Das Finanzamt schickt den Bescheid meist wenige Wochen nach dem Termin; erst wenn die Steuer bezahlt ist, gibt es die Unbedenklichkeitsbescheinigung, ohne die keine Eintragung ins Grundbuch erfolgt.`,
        `Zusammen mit Notar und Grundbuch (rund 2 Prozent) und einer Maklerprovision von 3,57 Prozent kommt ein Kauf in ${region.name} damit auf etwa ${prozent(quote)} Prozent Nebenkosten. Bei 300.000 Euro Kaufpreis sind das rund ${euro(nk300)}, bei 500.000 Euro rund ${euro(nk500)}. ${vergleich}`,
        `Diese Summe muss als Eigenkapital vorhanden sein: Banken finanzieren die Nebenkosten praktisch nie mit, weil ihnen dafür keine Sicherheit gegenübersteht – im Fall einer Zwangsversteigerung ist das Geld weg. Wer in ${region.name} mit 300.000 Euro Kaufpreis rechnet, braucht also mindestens ${euro(nk300)} auf dem Konto, bevor über die eigentliche Finanzierung gesprochen wird.`,
        ...about.slice(1),
      ],

      faq: [
        {
          question: `Wie hoch ist die Grunderwerbsteuer in ${region.name}?`,
          answer: `${prozent(satz)} Prozent des Kaufpreises. Der Satz ist Landesrecht: Seit der Föderalismusreform 2006 legt ihn jedes Bundesland selbst fest, vorher galten bundesweit einheitlich 3,5 Prozent. Der Satz in ${region.name}: ${grestHistorie[region.code]}. Bei einem Kaufpreis von 300.000 Euro sind das ${euro(Math.round((300000 * satz) / 100))}, bei 500.000 Euro ${euro(Math.round((500000 * satz) / 100))}.`,
        },
        {
          question: `Wie viel Eigenkapital brauche ich für einen Kauf in ${region.name}?`,
          answer: `Mindestens die Kaufnebenkosten, also rund ${prozent(quote)} Prozent des Kaufpreises – bei 300.000 Euro etwa ${euro(nk300)}. Das ist die absolute Untergrenze und führt zu einer Vollfinanzierung des Kaufpreises mit entsprechendem Zinsaufschlag. Komfortabel wird es, wenn zusätzlich rund 20 Prozent des Kaufpreises als Eigenkapital eingebracht werden, in diesem Beispiel also weitere 60.000 Euro.`,
        },
        {
          question: `Lässt sich die Grunderwerbsteuer in ${region.name} senken?`,
          answer: `Legal und in Grenzen: Bewegliches Zubehör wie eine Einbauküche, Markisen oder eine Sauna gehört nicht zum Grundstück und darf im Kaufvertrag gesondert ausgewiesen werden – auf diesen Teil fällt keine Grunderwerbsteuer an. Bei einer Küche im Wert von 15.000 Euro spart das in ${region.name} ${euro(Math.round((15000 * satz) / 100))}. Der Betrag muss angemessen sein, das Finanzamt prüft bei auffälligen Ansätzen. Bei Neubauten kann außerdem die Trennung von Grundstückskauf und Bauvertrag helfen, wenn beide Verträge tatsächlich unabhängig sind.`,
        },
        ...sharedFaq.slice(0, 5),
      ],
    };
  });
}

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

  Component,
  getVariants: buildVariants,

  about,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: immobilienAffiliate,
  },
};
