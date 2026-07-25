import { Zap } from "lucide-react";
import type { ToolManifest, ToolVariant } from "@/tools/types";
import { stromkostenAffiliate } from "./affiliate";
import Component from "./Component";
import { devicePresets } from "./logic";

/** Die Geräte, nach deren Kosten am häufigsten gesucht wird. */
const VARIANT_DEVICES = [
  "trockner",
  "kuehlschrank",
  "heizluefter",
  "gaming",
  "klimageraet",
  "waschmaschine",
];

function buildVariants(): ToolVariant[] {
  return VARIANT_DEVICES.flatMap((id) => {
    const preset = devicePresets.find((device) => device.id === id);
    if (!preset) return [];

    const slug = id.replace(/[^a-z0-9]+/g, "-");
    return [
      {
        slug: `${slug}-stromkosten`,
        title: `Was kostet ein ${preset.label} an Strom?`,
        description: `Stromkosten für einen ${preset.label} pro Jahr, Monat und Tag – mit Standby, deinem Arbeitspreis und dem CO₂-Ausstoß.`,
        heading: `Stromkosten: ${preset.label}`,
        params: {
          watt: preset.watts,
          muster: preset.pattern,
          nutzung: preset.usage,
          kwh: preset.kwhPerCycle,
          standby: preset.standbyWatts,
        },
      },
    ];
  });
}

export const stromkosten: ToolManifest = {
  slug: "stromkosten",
  name: "Stromkosten-Rechner",
  tagline:
    "Was kostet ein einzelnes Gerät im Jahr? Mit Standby, echten Nutzungsmustern und CO₂.",
  category: "geld",
  icon: Zap,
  status: "live",
  keywords: [
    "stromkosten berechnen",
    "stromverbrauch gerät",
    "was kostet trockner strom",
    "standby kosten",
    "kwh kosten rechner",
    "stromkosten pro jahr",
    "watt in euro",
  ],

  Component,
  getVariants: buildVariants,

  about: [
    "Die Rechnung selbst ist einfach: Verbrauch mal Preis. Schwierig ist die Eingabe – und daran scheitern die meisten Rechner. Ein Fernseher läuft Stunden am Tag, eine Waschmaschine in Durchgängen pro Woche, ein Backofen ein paar Stunden im Monat. Alles in „Stunden pro Tag“ zu pressen führt zu Zahlen, die niemand kennt. Hier wählst du das Muster, das zu deinem Gerät passt.",
    "Bei Wasch- und Spülmaschinen zählt außerdem nicht die Leistungsangabe, sondern der Verbrauch je Durchgang. Eine Waschmaschine zieht beim Aufheizen kurz 2000 Watt und läuft danach mit fast nichts – aus der Wattzahl allein lässt sich der Verbrauch nicht ableiten. Die Angabe in Kilowattstunden je Durchgang steht auf dem Energielabel.",
    "Der zweite oft unterschätzte Posten ist der Standby. Ein Gerät mit drei Watt Dauerlast verbraucht im Jahr rund 26 Kilowattstunden, ohne einen Handschlag zu tun – mehr als manches Gerät, das dreimal pro Woche eine Stunde läuft. Der Rechner weist den Anteil deshalb getrennt aus und rechnet ihn nur für die Zeit, in der das Gerät nicht ohnehin läuft.",
    "Der CO₂-Wert ist eine Näherung mit 380 Gramm je Kilowattstunde für den deutschen Strommix. Dieser Wert sinkt mit dem Ausbau der Erneuerbaren von Jahr zu Jahr; als Größenordnung taugt er, als exakte Bilanz nicht.",
  ],

  faq: [
    {
      question: "Was kostet ein Wäschetrockner im Jahr?",
      answer:
        "Ein Kondenstrockner braucht rund 2,5 Kilowattstunden je Durchgang, ein moderner Wärmepumpentrockner etwa 1,5. Bei drei Durchgängen pro Woche und 35 Cent je Kilowattstunde sind das ungefähr 135 Euro im Jahr für den Kondens- und 82 Euro für den Wärmepumpentrockner. Damit gehört der Trockner zu den teuersten Einzelgeräten im Haushalt – Wäscheleine ist die einzige Maßnahme, die noch mehr spart als ein Gerätetausch.",
    },
    {
      question: "Wie rechne ich Watt in Euro um?",
      answer:
        "Leistung in Watt durch 1000 ergibt Kilowatt, mal Betriebsstunden ergibt Kilowattstunden, mal Arbeitspreis ergibt Euro. Ein 100-Watt-Gerät, das täglich fünf Stunden läuft, kommt auf 182,5 Kilowattstunden im Jahr – bei 35 Cent sind das rund 64 Euro. Die Faustregel dazu: Ein Watt Dauerlast kostet im Jahr etwa drei Euro.",
    },
    {
      question: "Lohnt es sich, den Standby abzuschalten?",
      answer:
        "Bei einzelnen Geräten mit einem halben Watt kaum, in Summe schon. Ein durchschnittlicher Haushalt verliert über alle Geräte hinweg 50 bis 100 Kilowattstunden im Jahr an Standby, also 20 bis 35 Euro. Eine abschaltbare Steckdosenleiste an Fernseher, Konsole und Anlage kostet einmalig wenige Euro. Übersteigt der Standby-Anteil hier 30 Prozent, weist der Rechner darauf hin.",
    },
    {
      question: "Wo finde ich die Wattzahl meines Geräts?",
      answer:
        "Auf dem Typenschild an der Rückseite oder Unterseite, beim Laptop auf dem Netzteil. Die Angabe dort ist die maximale Leistungsaufnahme, nicht der Durchschnitt – ein Gaming-PC mit 600-Watt-Netzteil zieht im Spiel vielleicht 400 Watt und im Leerlauf 60. Wer es genau wissen will, braucht ein Messgerät für die Steckdose; die Voreinstellungen hier sind typische Durchschnittswerte.",
    },
    {
      question: "Was ist ein normaler Strompreis?",
      answer:
        "Entscheidend ist der Arbeitspreis je Kilowattstunde, nicht der Gesamtbetrag der Rechnung – dort steckt auch der Grundpreis drin, der unabhängig vom Verbrauch anfällt. Der Rechner ist auf 35 Cent voreingestellt; trage den Wert von deiner letzten Abrechnung ein, dann stimmt das Ergebnis. Für einen Tarifvergleich zählt bei hohem Verbrauch der Arbeitspreis, bei niedrigem der Grundpreis stärker.",
    },
    {
      question: "Rechnet der Rechner auch mit einem Solaranlagen-Anteil?",
      answer:
        "Nein, er rechnet mit einem einheitlichen Arbeitspreis. Wer eine Photovoltaikanlage hat und einen Teil selbst verbraucht, kann als Näherung einen Mischpreis eintragen: den Netzpreis und die entgangene Einspeisevergütung im Verhältnis des jeweiligen Anteils gewichtet.",
    },
  ],

  monetization: {
    adDensity: "medium",
    affiliate: stromkostenAffiliate,
  },
};
