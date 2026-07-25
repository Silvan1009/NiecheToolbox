import { CalendarRange } from "lucide-react";
import type { ToolManifest, ToolVariant } from "@/tools/types";
import { brueckentageAffiliate } from "./affiliate";
import Component from "./Component";
import { regions } from "./logic";

/** Für wie viele Jahre programmatische Landing-Pages entstehen. */
const VARIANT_YEARS = 3;

function buildVariants(): ToolVariant[] {
  const baseYear = new Date().getUTCFullYear();
  const variants: ToolVariant[] = [];

  for (let offset = 0; offset < VARIANT_YEARS; offset += 1) {
    const year = baseYear + offset;
    for (const region of regions) {
      variants.push({
        slug: `${region.slug}-${year}`,
        title: `Brückentage ${year} in ${region.name}`,
        description: `Alle Brückentage ${year} für ${region.name}: Mit wenigen Urlaubstagen maximal viele Tage am Stück frei. Kostenlos berechnet, mit allen Feiertagen des Jahres.`,
        heading: `Brückentage ${year} in ${region.name}`,
        params: { bl: region.code, jahr: year, basisJahr: baseYear },
      });
    }
  }

  return variants;
}

export const brueckentage: ToolManifest = {
  slug: "brueckentage",
  name: "Brückentage-Optimierer",
  tagline:
    "Finde die Tage, an denen ein Urlaubstag drei geschenkte dazu bringt – für dein Bundesland.",
  category: "zeit",
  icon: CalendarRange,
  status: "live",
  keywords: [
    "brückentage",
    "brückentage 2026",
    "feiertage",
    "urlaub planen",
    "urlaubstage",
    "lange wochenenden",
    "bundesland",
    "feiertagskalender",
  ],

  Component,
  getDefaultParams: () => ({ basisJahr: new Date().getUTCFullYear() }),
  getVariants: buildVariants,

  about: [
    "Ein Brückentag ist ein einzelner Arbeitstag zwischen einem Feiertag und dem Wochenende. Wer ihn als Urlaubstag nimmt, verbindet beides zu einer langen freien Spanne. Aus einem eingesetzten Urlaubstag werden so schnell vier freie Tage – manchmal mehr.",
    "Der Rechner kennt alle gesetzlichen Feiertage der 16 Bundesländer und berechnet sie selbst: Ostern kommt aus der Gauß-Osterformel, alle beweglichen Feiertage hängen daran. Für jeden Feiertag prüft er, wie viele freie Tage entstehen, wenn du die umliegenden Arbeitstage frei nimmst, und sortiert die Vorschläge nach dem Verhältnis freie Tage pro Urlaubstag.",
    "Weil die Feiertage je Bundesland unterschiedlich sind, lohnt sich der Blick auf das eigene: Bayern und das Saarland haben die meisten, Berlin, Bremen, Hamburg, Hessen, Niedersachsen und Schleswig-Holstein die wenigsten. Feiertage, die auf ein Wochenende fallen, sind für alle verschenkt – der Rechner zeigt dir, wie viele das im gewählten Jahr sind.",
  ],

  faq: [
    {
      question: "Was ist ein Brückentag genau?",
      answer:
        "Ein Arbeitstag, der zwischen einem Feiertag und dem Wochenende liegt. Fällt ein Feiertag zum Beispiel auf einen Donnerstag, ist der Freitag danach ein Brückentag: Ein Urlaubstag verbindet Feiertag und Wochenende zu vier freien Tagen am Stück.",
    },
    {
      question: "Warum unterscheiden sich die Ergebnisse je Bundesland?",
      answer:
        "Außer Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit und den beiden Weihnachtstagen sind alle Feiertage Ländersache. Fronleichnam gilt zum Beispiel in Bayern, aber nicht in Berlin; der Buß- und Bettag nur in Sachsen.",
    },
    {
      question: "Sind Mariä Himmelfahrt und Fronleichnam überall im Land Feiertage?",
      answer:
        "Nicht überall. Mariä Himmelfahrt ist in Bayern nur in Gemeinden mit überwiegend katholischer Bevölkerung frei – das sind die meisten, aber nicht alle. Fronleichnam gilt in Sachsen und Thüringen ebenfalls nur in einzelnen Gemeinden. Diese Tage sind im Rechner als „nur regional“ gekennzeichnet und zählen erst mit, wenn du sie ausdrücklich aktivierst.",
    },
    {
      question: "Wie berechnet der Rechner die Feiertage?",
      answer:
        "Vollständig rechnerisch, ohne externe Datenquelle. Der Ostersonntag ergibt sich aus der Gauß-Osterformel, Karfreitag, Christi Himmelfahrt, Pfingsten und Fronleichnam sind fixe Abstände dazu. Der Buß- und Bettag ist der letzte Mittwoch vor dem 23. November. Alle festen Feiertage stehen mit ihrer Bundesland-Zuordnung in einer Tabelle. Damit stimmen die Termine auch für weit entfernte Jahre.",
    },
    {
      question: "Zählt der Rechner meinen Urlaubsanspruch mit?",
      answer:
        "Nein. Du gibst an, wie viele Urlaubstage du fürs Brückentage-Nutzen einsetzen willst; der Rest deines Urlaubs bleibt unberührt. Der Jahresplan wählt daraus die Vorschläge mit dem besten Verhältnis, die sich zeitlich nicht überschneiden.",
    },
    {
      question: "Kann ich das Ergebnis teilen?",
      answer:
        "Ja. Bundesland, Jahr und Budget stehen in der Adresszeile – wer den Link öffnet, sieht genau dein Ergebnis. Der Button „Link kopieren“ unter dem Ergebnis übernimmt das für dich.",
    },
  ],

  monetization: {
    adDensity: "low",
    affiliate: brueckentageAffiliate,
  },
};
