/**
 * Inhalte der SEO-Unterseiten des Stromkosten-Rechners – je Gerät eine Seite
 * ("was kostet ein trockner an strom").
 *
 * Die Texte sind geschrieben, die Zahlen darin nicht: Sie kommen aus
 * `calculatePower()` mit genau den Voreinstellungen, mit denen die Seite den
 * Rechner startet. Ändert sich ein Preset in `logic.ts`, ändert sich der Text
 * mit – Zahlen im Fließtext, die niemand nachzieht, sind die häufigste Quelle
 * für Seiten, die irgendwann nicht mehr stimmen.
 *
 * Bei Heizlüfter und Klimagerät steht zusätzlich eine Saisonrechnung im Text.
 * Die Voreinstellung rechnet beide über das ganze Jahr, weil der Rechner keine
 * Saison kennt – und 769 Euro im Jahr für ein Gerät, das nur im Hochsommer
 * läuft, wäre eine Zahl, die niemandem hilft.
 */

import {
  formatAmount,
  formatEuro,
  formatEuroRounded,
  formatInteger,
} from "@/lib/format";
import type { VariantContent } from "@/tools/variants";
import {
  calculatePower,
  devicePresets,
  type PowerResult,
  type DevicePreset,
} from "./logic";

/** Voreingestellter Arbeitspreis in Cent je Kilowattstunde (siehe Component). */
const PREIS_CENT = 35;

interface Fakten {
  preset: DevicePreset;
  ergebnis: PowerResult;
  /** "140 €" – Jahreskosten, gerundet. */
  jahr: string;
  /** "11,63 €" – Monatskosten. */
  monat: string;
  /** "0,38 €" – Tageskosten. */
  tag: string;
  /** "399" – Verbrauch in kWh pro Jahr. */
  kwh: string;
  /** "151" – CO₂ in kg pro Jahr. */
  co2: string;
}

function faktenFor(id: string): Fakten {
  const preset = devicePresets.find((device) => device.id === id);
  if (!preset) throw new Error(`Unbekanntes Gerät: ${id}`);

  const ergebnis = calculatePower({
    watts: preset.watts,
    pattern: preset.pattern,
    usage: preset.usage,
    kwhPerCycle: preset.kwhPerCycle,
    standbyWatts: preset.standbyWatts,
    pricePerKwhCents: PREIS_CENT,
  });

  return {
    preset,
    ergebnis,
    jahr: formatEuroRounded(ergebnis.costPerYear),
    monat: formatEuro(ergebnis.costPerMonth),
    tag: formatEuro(ergebnis.costPerDay),
    kwh: formatInteger(ergebnis.totalKwh),
    co2: formatInteger(ergebnis.co2KgPerYear),
  };
}

/** Was ein Gerät kostet, wenn es nur an `tage` Tagen im Jahr läuft. */
function saison(watts: number, stundenProTag: number, tage: number) {
  const kwhRoh = (watts / 1000) * stundenProTag * tage;
  const euroRoh = (kwhRoh * PREIS_CENT) / 100;
  return {
    kwhRoh,
    euroRoh,
    kwh: formatInteger(kwhRoh),
    kosten: formatEuroRounded(euroRoh),
  };
}

/** Kosten je Durchgang – nur bei Wasch-, Spülmaschine und Trockner sinnvoll. */
function jeDurchgang(preset: DevicePreset) {
  return formatEuro((preset.kwhPerCycle * PREIS_CENT) / 100);
}

/* ---------------------------------------------------------------------------
 * Die Seiten
 * ------------------------------------------------------------------------- */

function trockner(): VariantContent {
  const f = faktenFor("trockner");
  const { preset } = f;

  // Derselbe Nutzungsrhythmus, aber mit dem Verbrauch eines Wärmepumpen-
  // trockners: die Zahl, um die es beim Gerätetausch geht.
  const wpKwh = 1.5 * preset.usage * 52;
  const wpEuro = (wpKwh * PREIS_CENT) / 100;
  const wpKosten = formatEuroRounded(wpEuro);
  const ersparnis = formatEuroRounded(f.ergebnis.costPerYear - wpEuro);

  return {
    slug: "trockner-stromkosten",
    title: "Was kostet ein Wäschetrockner an Strom?",
    description: `Ein Kondenstrockner kostet bei ${preset.usage} Durchgängen pro Woche rund ${f.jahr} Strom im Jahr – ${f.monat} im Monat. Mit Vergleich zum Wärmepumpentrockner.`,
    heading: "Stromkosten: Wäschetrockner",
    params: {
      watt: preset.watts,
      muster: preset.pattern,
      nutzung: preset.usage,
      kwh: preset.kwhPerCycle,
      standby: preset.standbyWatts,
    },
    about: [
      `Ein Kondenstrockner braucht rund ${formatAmount(preset.kwhPerCycle)} Kilowattstunden je Durchgang. Bei ${preset.usage} Durchgängen pro Woche und ${PREIS_CENT} Cent je Kilowattstunde sind das ${f.kwh} Kilowattstunden und ${f.jahr} im Jahr – ${f.monat} im Monat, ${jeDurchgang(preset)} je Ladung. Damit gehört der Trockner zu den drei teuersten Einzelgeräten im Haushalt, ohne dass es jemandem auffällt: Die Kosten verteilen sich auf Hunderte kleine Läufe und tauchen nie als einzelner Posten auf.`,
      `Entscheidend ist die Bauart, nicht die Wattzahl auf dem Typenschild. Ein Wärmepumpentrockner kommt mit etwa 1,5 Kilowattstunden je Durchgang aus – bei sonst gleicher Nutzung also ${formatInteger(wpKwh)} Kilowattstunden und ${wpKosten} im Jahr. Die Differenz von rund ${ersparnis} pro Jahr ist der eigentliche Grund, warum sich der Aufpreis beim Neukauf rechnet: Bei einer Gerätelaufzeit von zehn Jahren geht es um einen mittleren dreistelligen bis vierstelligen Betrag.`,
      `Die Stellschraube mit dem größten Hebel bleibt trotzdem die Schleuderdrehzahl der Waschmaschine. Wäsche, die mit 1600 statt 1000 Umdrehungen geschleudert wurde, kommt mit deutlich weniger Restfeuchte in den Trockner und braucht dort spürbar weniger Energie. Wer die Hälfte der Ladungen auf die Leine hängt, halbiert den Posten schlicht – ${formatEuroRounded(f.ergebnis.costPerYear / 2)} im Jahr, ohne ein neues Gerät zu kaufen.`,
      `Der Standby fällt hier kaum ins Gewicht: ${formatAmount(preset.standbyWatts)} Watt Dauerlast ergeben ${formatEuro(f.ergebnis.standbyCostPerYear)} im Jahr, also ${formatAmount(f.ergebnis.standbyShare)} Prozent der Gesamtkosten. Bei einem Gerät, das ohnehin viel verbraucht, ist die Steckdosenleiste nicht das Thema – bei Fernseher und Konsole schon.`,
    ],
    faq: [
      {
        question: "Was kostet ein Wäschetrockner im Jahr?",
        answer: `Bei ${preset.usage} Durchgängen pro Woche, ${formatAmount(preset.kwhPerCycle)} Kilowattstunden je Durchgang und ${PREIS_CENT} Cent je Kilowattstunde: ${f.jahr} im Jahr. Ein Wärmepumpentrockner kommt bei gleicher Nutzung auf ${wpKosten}. Trage oben deine eigene Zahl der Durchgänge und deinen Arbeitspreis ein – beides verschiebt das Ergebnis deutlich.`,
      },
      {
        question: "Was kostet ein Trocknergang?",
        answer: `${jeDurchgang(preset)} bei ${formatAmount(preset.kwhPerCycle)} Kilowattstunden und ${PREIS_CENT} Cent. Ein Wärmepumpentrockner liegt bei etwa ${formatEuro((1.5 * PREIS_CENT) / 100)} je Ladung. Der Wert je Durchgang steht auf dem Energielabel des Geräts, meist bezogen auf das Standardprogramm Baumwolle bei voller Beladung – teilbeladen wird es pro Kilo Wäsche teurer, nicht billiger.`,
      },
      {
        question: "Lohnt sich ein Wärmepumpentrockner?",
        answer: `Bei dieser Nutzung spart er rund ${ersparnis} im Jahr. Ob sich der Aufpreis gegenüber einem Kondenstrockner lohnt, hängt fast nur an der Zahl der Durchgänge: Wer einmal pro Woche trocknet, wartet über zehn Jahre auf die Amortisation, wer fünfmal die Woche trocknet, hat sie in drei bis vier Jahren. Rechne beide Fälle oben durch, indem du den Verbrauch je Durchgang von ${formatAmount(preset.kwhPerCycle)} auf 1,5 änderst.`,
      },
      {
        question: "Wie viel CO₂ verursacht ein Trockner?",
        answer: `Rund ${f.co2} Kilogramm im Jahr, gerechnet mit 380 Gramm je Kilowattstunde im deutschen Strommix. Der Wert ist eine Näherung und sinkt mit dem Ausbau der Erneuerbaren jedes Jahr. Wer mit Ökostrom oder eigener Photovoltaik trocknet, liegt deutlich darunter – an den Kosten ändert das nichts.`,
      },
    ],
  };
}

function kuehlschrank(): VariantContent {
  const f = faktenFor("kuehlschrank");
  const { preset } = f;
  const alt = saison(120, 24, 365);

  return {
    slug: "kuehlschrank-stromkosten",
    title: "Was kostet ein Kühlschrank an Strom?",
    description: `Ein Kühlschrank läuft rund um die Uhr und kostet rund ${f.jahr} Strom im Jahr – ${f.monat} im Monat. Mit Vergleich zwischen altem und neuem Gerät.`,
    heading: "Stromkosten: Kühlschrank",
    params: {
      watt: preset.watts,
      muster: preset.pattern,
      nutzung: preset.usage,
      kwh: preset.kwhPerCycle,
      standby: preset.standbyWatts,
    },
    about: [
      `Der Kühlschrank ist das einzige Gerät im Haushalt, das nie ausgeht – und genau deshalb steht er trotz kleiner Leistung weit oben in der Stromrechnung. Mit ${preset.watts} Watt mittlerer Leistungsaufnahme über 24 Stunden kommt er auf ${f.kwh} Kilowattstunden und ${f.jahr} im Jahr, also ${f.monat} im Monat oder ${f.tag} am Tag. Ein Standby existiert nicht: Die Zahl ist der Verbrauch.`,
      `Die ${preset.watts} Watt sind ein Mittelwert, kein Dauerzustand. Der Kompressor läuft in Intervallen und zieht dabei kurzzeitig deutlich mehr; über den Tag gemittelt ergibt sich der Wert, mit dem hier gerechnet wird. Auf dem Energielabel steht deshalb keine Wattzahl, sondern der Jahresverbrauch in Kilowattstunden – wenn du ihn kennst, teile ihn durch 8760 und multipliziere mit 1000, dann hast du die Watt für dieses Feld.`,
      `Beim Kühlschrank lohnt der Blick aufs Alter mehr als bei jedem anderen Gerät. Ein Modell aus den frühen 2000ern zieht im Schnitt eher 120 Watt und kommt damit auf ${alt.kwh} Kilowattstunden und ${alt.kosten} im Jahr – das Dreifache. Über zehn Jahre gerechnet ist der Unterschied größer als der Neupreis eines guten Geräts. Wenn irgendwo im Haushalt ein alter Zweitkühlschrank im Keller steht, ist das fast immer der teuerste Stromfresser der Wohnung.`,
      `Was tatsächlich etwas bringt, ohne ein neues Gerät zu kaufen: die Temperatur auf 7 Grad statt 5 stellen (jedes Grad kälter kostet rund sechs Prozent mehr Strom), die Lüftungsgitter an der Rückseite frei halten, das Gefrierfach abtauen, sobald sich Eis bildet, und den Kühlschrank nicht direkt neben Herd oder Spülmaschine stellen. Zusammen sind das schnell 20 Prozent, also rund ${formatEuroRounded(f.ergebnis.costPerYear * 0.2)} im Jahr.`,
    ],
    faq: [
      {
        question: "Was kostet ein Kühlschrank im Jahr?",
        answer: `Ein aktuelles Gerät mit rund ${preset.watts} Watt mittlerer Leistung kommt auf ${f.kwh} Kilowattstunden und ${f.jahr} im Jahr bei ${PREIS_CENT} Cent je Kilowattstunde. Ein 20 Jahre altes Gerät liegt eher bei ${alt.kosten}. Den genauen Jahresverbrauch deines Geräts findest du auf dem Energielabel oder dem Typenschild im Innenraum.`,
      },
      {
        question: "Wie viel Watt hat ein Kühlschrank?",
        answer: `Die Frage führt in die Irre, weil der Kompressor in Intervallen läuft: Kurzzeitig sind es 80 bis 150 Watt, im Tagesmittel bei einem aktuellen Gerät rund ${preset.watts}. Für die Kostenrechnung zählt allein der Mittelwert. Wenn auf dem Label ein Jahresverbrauch in Kilowattstunden steht, ist das die verlässlichere Angabe – dieser Rechner arbeitet mit der mittleren Leistung, weil sie sich mit jedem Steckdosen-Messgerät bestimmen lässt.`,
      },
      {
        question: "Lohnt sich ein neuer Kühlschrank?",
        answer: `Wenn das alte Gerät älter als 15 Jahre ist, fast immer. Der Sprung von ${alt.kosten} auf ${f.jahr} im Jahr spart rund ${formatEuroRounded(alt.euroRoh - f.ergebnis.costPerYear)} und trägt einen Neupreis von 400 bis 600 Euro in etwa fünf Jahren. Bei einem Gerät von 2015 oder jünger lohnt der Tausch dagegen selten – dort ist der Unterschied zu heutigen Modellen klein, und die Herstellung des neuen Geräts kostet ebenfalls Energie.`,
      },
      {
        question: "Was kostet ein Gefrierschrank zusätzlich?",
        answer: `Eine Gefriertruhe ist mit rund 60 Watt im Mittel angesetzt und kommt damit auf etwa ${saison(60, 24, 365).kosten} im Jahr. Truhen sind dabei sparsamer als Schränke, weil die kalte Luft beim Öffnen nicht herausfällt. Wähle oben unter den Voreinstellungen „Gefriertruhe“, dann rechnet die Seite direkt damit.`,
      },
    ],
  };
}

function heizluefter(): VariantContent {
  const f = faktenFor("heizluefter");
  const { preset } = f;
  const winter = saison(preset.watts, preset.usage, 120);
  const gas = formatEuroRounded(
    ((preset.watts / 1000) * preset.usage * 120 * 12) / 100,
  );

  return {
    slug: "heizluefter-stromkosten",
    title: "Was kostet ein Heizlüfter an Strom?",
    description: `Ein Heizlüfter mit ${formatInteger(preset.watts)} Watt kostet ${f.tag} pro Betriebstag bei ${preset.usage} Stunden – über eine Heizsaison rund ${winter.kosten}. Mit Vergleich zur Gasheizung.`,
    heading: "Stromkosten: Heizlüfter",
    params: {
      watt: preset.watts,
      muster: preset.pattern,
      nutzung: preset.usage,
      kwh: preset.kwhPerCycle,
      standby: preset.standbyWatts,
    },
    about: [
      `Ein Heizlüfter ist das billigste Heizgerät im Laden und die teuerste Wärme im Haus. Mit ${formatInteger(preset.watts)} Watt und ${preset.usage} Stunden Betrieb kostet er ${f.tag} am Tag – das klingt harmlos. Über eine Heizsaison von rund 120 Tagen werden daraus ${winter.kwh} Kilowattstunden und ${winter.kosten}. Die Voreinstellung dieser Seite rechnet mit dem ganzen Jahr und kommt deshalb auf ${f.jahr}; wenn du nur im Winter heizt, ist die Saisonzahl die richtige.`,
      `Der Grund für die hohen Kosten ist kein technischer Mangel, im Gegenteil: Ein Heizlüfter setzt praktisch 100 Prozent des Stroms in Wärme um, besser geht es nicht. Teuer ist der Strom selbst. Eine Kilowattstunde Wärme aus Strom kostet ${PREIS_CENT} Cent, dieselbe Kilowattstunde aus Gas rund 12 Cent, aus einer Wärmepumpe mit Jahresarbeitszahl 3 etwa ${formatAmount(PREIS_CENT / 3)} Cent. Dieselbe Wärmemenge über dieselben 120 Tage kostet mit Gas also rund ${gas} statt ${winter.kosten}.`,
      `Wirtschaftlich ist ein Heizlüfter deshalb nur in genau einem Fall: kurz, punktuell und dort, wo sonst ein ganzes Haus mitgeheizt würde – zehn Minuten im Bad an einem Übergangstag, an dem die Zentralheizung noch aus ist. Sobald er täglich stundenlang läuft, ist er die teuerste Lösung von allen. Das gilt auch für den vermeintlichen Spartrick, im Homeoffice nur ein Zimmer elektrisch zu heizen und die Zentralheizung aus zu lassen: Bei ${preset.usage} Stunden am Tag rechnet sich das gegenüber Gas nicht.`,
      `Zwei Hinweise zur Sicherheit, die mit Strompreisen nichts zu tun haben, aber an dieser Stelle dazugehören: ${formatInteger(preset.watts)} Watt sind an einer normalen Steckdose der obere Rand, und zwei solche Geräte an einer Mehrfachsteckdose überlasten die Leitung zuverlässig. Und ein Heizlüfter gehört nie unbeaufsichtigt in einen Raum mit Textilien in der Nähe – das ist der häufigste Grund für Wohnungsbrände durch Heizgeräte.`,
    ],
    faq: [
      {
        question: "Was kostet ein Heizlüfter pro Stunde?",
        answer: `Bei ${formatInteger(preset.watts)} Watt und ${PREIS_CENT} Cent je Kilowattstunde: ${formatEuro((preset.watts / 1000) * (PREIS_CENT / 100))} je Betriebsstunde. Ein Gerät mit 1000 Watt kostet die Hälfte, eines mit 3000 Watt anderthalbmal so viel. Die Wattzahl steht auf dem Typenschild; viele Geräte haben zwei Stufen, dann gilt der eingestellte Wert.`,
      },
      {
        question: "Was kostet ein Heizlüfter im Winter?",
        answer: `Bei ${preset.usage} Stunden am Tag über 120 Heizsaisontage: ${winter.kwh} Kilowattstunden und ${winter.kosten}. Die Zahl oben im Rechner rechnet mit 365 Tagen und liegt deshalb höher – trage unter „Stunden pro Tag“ einen kleineren Wert ein, wenn du das Gerät nur an einzelnen Tagen nutzt, oder rechne die Saisonzahl aus dem Tagespreis von ${f.tag} hoch.`,
      },
      {
        question: "Ist ein Heizlüfter günstiger als die Heizung?",
        answer: `Nein, und der Abstand ist groß. Strom kostet rund ${PREIS_CENT} Cent je Kilowattstunde, Gas etwa 12, Fernwärme je nach Netz 10 bis 18. Für dieselbe Wärmemenge zahlst du mit dem Heizlüfter also ungefähr das Dreifache. Der Eindruck, es sei günstiger, entsteht dadurch, dass die Stromkosten erst mit der Jahresabrechnung sichtbar werden – die Gasrechnung dagegen sofort.`,
      },
      {
        question: "Lohnt sich ein Heizlüfter im Homeoffice?",
        answer: `Nur wenn die Alternative wäre, ein ganzes Haus auf Temperatur zu bringen, um in einem Raum zu sitzen – und selbst dann rechnet es sich meist erst bei sehr schlecht gedämmten Gebäuden. Bei ${preset.usage} Stunden am Tag kostet der Lüfter ${winter.kosten} über die Saison. Ein Infrarotpaneel ist im Verbrauch nicht besser (auch dort wird Strom eins zu eins in Wärme umgesetzt), fühlt sich aber bei gleicher Leistung wärmer an, weil es Flächen statt Luft erwärmt.`,
      },
    ],
  };
}

function gaming(): VariantContent {
  const f = faktenFor("gaming");
  const { preset } = f;
  const idle = saison(60, 24 - preset.usage, 365);

  return {
    slug: "gaming-stromkosten",
    title: "Was kostet ein Gaming-PC an Strom?",
    description: `Ein Gaming-PC mit ${formatInteger(preset.watts)} Watt kostet bei ${preset.usage} Stunden am Tag rund ${f.jahr} im Jahr – ${f.monat} im Monat. Mit Standby- und Leerlaufanteil.`,
    heading: "Stromkosten: Gaming-PC",
    params: {
      watt: preset.watts,
      muster: preset.pattern,
      nutzung: preset.usage,
      kwh: preset.kwhPerCycle,
      standby: preset.standbyWatts,
    },
    about: [
      `Ein Gaming-PC unter Last zieht mit Mittelklasse-Grafikkarte rund ${formatInteger(preset.watts)} Watt, Monitor eingerechnet. Bei ${preset.usage} Stunden Spielzeit am Tag sind das ${f.kwh} Kilowattstunden und ${f.jahr} im Jahr, also ${f.monat} im Monat. Zum Einordnen: Das ist mehr, als ein aktueller Kühlschrank im selben Zeitraum verbraucht.`,
      `Die Wattzahl auf dem Netzteil ist dabei nicht die Antwort. Ein 750-Watt-Netzteil sagt nur, was es liefern könnte – gezogen wird, was die Komponenten anfordern. Realistische Werte: 60 bis 90 Watt im Leerlauf, 200 bis 300 Watt in einem älteren oder genügsamen Spiel, 400 bis 600 Watt in einem aktuellen Titel mit hohen Einstellungen. Wer es genau wissen will, misst mit einem Steckdosen-Messgerät einmal im Leerlauf und einmal im Spiel und trägt hier den Durchschnitt ein.`,
      `Der unterschätzte Posten ist nicht das Spielen, sondern die Zeit dazwischen. ${formatAmount(preset.standbyWatts)} Watt Standby ergeben ${formatEuro(f.ergebnis.standbyCostPerYear)} im Jahr – wenig. Bleibt der Rechner dagegen im Leerlauf an, statt in den Ruhezustand zu gehen, sind es bei 60 Watt über die restlichen ${24 - preset.usage} Stunden des Tages ${idle.kwh} Kilowattstunden und ${idle.kosten} im Jahr, also mehr als die Hälfte der eigentlichen Spielkosten. Der Energiesparplan von Windows ist an dieser Stelle die wirksamste Einstellung im ganzen System.`,
      `Was sonst noch messbar wirkt: ein Framelimit auf die Bildwiederholrate des Monitors (eine Grafikkarte, die 300 Bilder pro Sekunde in ein 144-Hertz-Panel rendert, verheizt die Differenz), Undervolting der Grafikkarte, das bei gleicher Leistung oft 15 bis 20 Prozent spart, und ein Monitor, der sich nach Inaktivität abschaltet statt einen Bildschirmschoner zu zeigen. Alle drei zusammen bringen leicht ${formatEuroRounded(f.ergebnis.costPerYear * 0.2)} im Jahr.`,
    ],
    faq: [
      {
        question: "Was kostet ein Gaming-PC im Jahr an Strom?",
        answer: `Bei ${formatInteger(preset.watts)} Watt und ${preset.usage} Stunden Spielzeit am Tag: ${f.kwh} Kilowattstunden und ${f.jahr} im Jahr bei ${PREIS_CENT} Cent je Kilowattstunde. Ein Bürorechner mit 60 Watt käme bei gleicher Nutzung auf ${saison(60, preset.usage, 365).kosten}, eine Konsole auf etwa ${saison(160, preset.usage, 365).kosten}.`,
      },
      {
        question: "Was kostet eine Stunde Zocken?",
        answer: `${formatEuro((preset.watts / 1000) * (PREIS_CENT / 100))} bei ${formatInteger(preset.watts)} Watt. Ein Abend von vier Stunden kostet also rund ${formatEuro(4 * (preset.watts / 1000) * (PREIS_CENT / 100))}. Der Wert schwankt stark mit dem Spiel: Ein Indie-Titel im Framelimit kann bei einem Drittel liegen, ein aktueller Titel mit Raytracing beim Anderthalbfachen.`,
      },
      {
        question: "Wie viel Watt zieht mein PC wirklich?",
        answer: `Nicht das, was auf dem Netzteil steht – das ist die maximale Abgabeleistung, nicht der Verbrauch. Software wie HWiNFO liest die Leistungsaufnahme von CPU und Grafikkarte direkt aus, erfasst aber nicht das ganze System. Verlässlich ist nur ein Messgerät zwischen Steckdose und Rechner: einmal im Leerlauf ablesen, einmal nach zehn Minuten im Spiel, und den Mittelwert nach deiner tatsächlichen Nutzung bilden.`,
      },
      {
        question: "Sollte ich den PC ausschalten oder im Ruhezustand lassen?",
        answer: `Ruhezustand oder Herunterfahren – beides liegt bei ${formatAmount(preset.standbyWatts)} Watt oder darunter und macht kaum einen Unterschied, im Jahr ${formatEuro(f.ergebnis.standbyCostPerYear)}. Teuer ist nur der Leerlauf mit laufendem System: rund 60 Watt, über ${24 - preset.usage} Stunden am Tag ${idle.kosten} im Jahr. Der Mythos, häufiges Ein- und Ausschalten schade der Hardware, stammt aus der Zeit mechanischer Festplatten und trifft auf aktuelle Systeme nicht mehr zu.`,
      },
    ],
  };
}

function klimageraet(): VariantContent {
  const f = faktenFor("klimageraet");
  const { preset } = f;
  const sommer = saison(preset.watts, preset.usage, 30);
  const hitzetage = saison(preset.watts, preset.usage, 60);

  return {
    slug: "klimageraet-stromkosten",
    title: "Was kostet ein mobiles Klimagerät an Strom?",
    description: `Ein mobiles Klimagerät mit ${formatInteger(preset.watts)} Watt kostet ${f.tag} pro Tag bei ${preset.usage} Stunden – über 30 heiße Tage rund ${sommer.kosten}. Mit Vergleich zum Split-Gerät.`,
    heading: "Stromkosten: mobiles Klimagerät",
    params: {
      watt: preset.watts,
      muster: preset.pattern,
      nutzung: preset.usage,
      kwh: preset.kwhPerCycle,
      standby: preset.standbyWatts,
    },
    about: [
      `Ein mobiles Klimagerät zieht im Betrieb rund ${formatInteger(preset.watts)} Watt. Bei ${preset.usage} Stunden am Tag sind das ${f.tag} täglich. Diese Zahl ist die brauchbare: Der Jahreswert von ${f.jahr}, den der Rechner oben zeigt, unterstellt Betrieb an 365 Tagen und ist für ein Sommergerät sinnlos. Realistisch sind 20 bis 40 Tage im Jahr, an denen es tatsächlich läuft – bei 30 Tagen kostet die Saison ${sommer.kosten}, bei einem heißen Sommer mit 60 Einsatztagen ${hitzetage.kosten}.`,
      `Der große Nachteil des mobilen Geräts steckt im Abluftschlauch. Er bläst warme Luft aus dem Fenster, und die Luft, die dafür nachströmt, kommt von draußen – warm. Ein Ein-Schlauch-Gerät arbeitet also permanent gegen den Unterdruck an, den es selbst erzeugt. Das ist der Grund, warum die tatsächliche Kühlleistung deutlich unter der Angabe auf dem Karton liegt und die Kosten pro gekühltem Grad hoch sind. Eine ordentliche Fensterabdichtung ist die mit Abstand wirksamste Maßnahme: Sie kostet 20 bis 40 Euro und senkt die Laufzeit spürbar.`,
      `Ein fest installiertes Split-Gerät braucht für dieselbe Kühlleistung etwa die Hälfte bis ein Drittel der Energie, weil der Kompressor draußen sitzt und kein Schlauch warme Luft nachzieht. Bei 30 Einsatztagen wären das statt ${sommer.kosten} rund ${saison(preset.watts / 2.5, preset.usage, 30).kosten}. Der Haken ist die Installation: Sie kostet je nach Gebäude 1.500 bis 3.000 Euro, braucht bei Eigentumswohnungen die Zustimmung der Eigentümergemeinschaft und bei Mietwohnungen die des Vermieters.`,
      `Was ohne Gerät hilft und in dieser Rechnung gar nicht auftaucht: nachts und früh morgens querlüften, tagsüber Fenster und Rollläden zu, außenliegende Beschattung statt Innenjalousie. Die Reihenfolge ist nicht beliebig – ein Raum, in den den ganzen Tag die Sonne scheint, lässt sich mit ${formatInteger(preset.watts)} Watt kaum herunterkühlen, während ein verschatteter Raum oft ganz ohne Gerät auskommt.`,
    ],
    faq: [
      {
        question: "Was kostet ein mobiles Klimagerät pro Stunde?",
        answer: `${formatEuro((preset.watts / 1000) * (PREIS_CENT / 100))} bei ${formatInteger(preset.watts)} Watt und ${PREIS_CENT} Cent je Kilowattstunde. Ein Gerät mit 2.000 Watt kostet das Doppelte. Die Leistungsaufnahme in Watt steht auf dem Typenschild – nicht zu verwechseln mit der Kühlleistung in BTU oder Watt Kälteleistung, die etwa zwei- bis dreimal so hoch angegeben wird.`,
      },
      {
        question: "Was kostet ein Klimagerät im Sommer?",
        answer: `Bei ${preset.usage} Stunden am Tag: ${sommer.kosten} über 30 Einsatztage, ${hitzetage.kosten} über 60. Der Jahreswert im Rechner oben rechnet mit täglichem Betrieb und liegt deshalb bei ${f.jahr} – das ist die richtige Zahl nur für ein Gerät, das durchgehend läuft. Trage unter „Stunden pro Tag“ deinen tatsächlichen Schnitt über das ganze Jahr ein, wenn du die Jahreszahl brauchst.`,
      },
      {
        question: "Lohnt sich ein Split-Klimagerät gegenüber einem mobilen?",
        answer: `Im Verbrauch klar: etwa die Hälfte bis ein Drittel, bei 30 Einsatztagen also rund ${saison(preset.watts / 2.5, preset.usage, 30).kosten} statt ${sommer.kosten}. Bei einer Ersparnis in dieser Größenordnung amortisiert sich eine Installation für 2.000 Euro rein rechnerisch aber erst nach Jahrzehnten. Für ein Split-Gerät sprechen Kühlleistung, Lautstärke und die Möglichkeit, es im Winter als Wärmepumpe zu nutzen – nicht der Stromverbrauch allein.`,
      },
      {
        question: "Warum kühlt mein mobiles Klimagerät so schlecht?",
        answer: `Fast immer wegen des Abluftschlauchs. Er transportiert warme Luft nach draußen, wodurch im Raum ein Unterdruck entsteht – und die Luft, die nachströmt, kommt durch Fenster- und Türritzen von draußen herein. Eine dichte Fensterabdichtung ist deshalb keine Zubehör-Empfehlung, sondern Voraussetzung. Zweiter häufiger Grund: ein zu großer oder unverschatteter Raum. ${formatInteger(preset.watts)} Watt kühlen zuverlässig etwa 20 bis 25 Quadratmeter, sofern die Sonne nicht den ganzen Tag hereinscheint.`,
      },
    ],
  };
}

function waschmaschine(): VariantContent {
  const f = faktenFor("waschmaschine");
  const { preset } = f;

  // 60-Grad-Wäsche braucht rund das Doppelte des Eco-Programms.
  const heissKwh = 1.4 * preset.usage * 52;
  const heissKosten = formatEuroRounded((heissKwh * PREIS_CENT) / 100);

  return {
    slug: "waschmaschine-stromkosten",
    title: "Was kostet eine Waschmaschine an Strom?",
    description: `Eine Waschmaschine kostet bei ${preset.usage} Waschgängen pro Woche rund ${f.jahr} Strom im Jahr – ${jeDurchgang(preset)} je Waschgang. Mit Vergleich der Waschprogramme.`,
    heading: "Stromkosten: Waschmaschine",
    params: {
      watt: preset.watts,
      muster: preset.pattern,
      nutzung: preset.usage,
      kwh: preset.kwhPerCycle,
      standby: preset.standbyWatts,
    },
    about: [
      `Eine Waschmaschine braucht im Eco-Programm rund ${formatAmount(preset.kwhPerCycle)} Kilowattstunden je Waschgang. Bei ${preset.usage} Waschgängen pro Woche und ${PREIS_CENT} Cent je Kilowattstunde sind das ${f.kwh} Kilowattstunden und ${f.jahr} im Jahr – ${jeDurchgang(preset)} je Ladung. Damit ist die Waschmaschine deutlich günstiger als ihr Ruf; teuer wird Wäsche erst im Trockner, der bei gleicher Ladung leicht das Dreifache verbraucht.`,
      `Die Wattzahl hilft hier nicht weiter, und deshalb fragt der Rechner in diesem Muster gar nicht danach. Eine Waschmaschine zieht beim Aufheizen des Wassers kurzzeitig 2.000 Watt und läuft den Rest des Programms mit 100 bis 200 Watt für Trommel und Pumpe. Aus der Spitzenleistung lässt sich der Verbrauch nicht ableiten – maßgeblich ist der Wert je Waschgang, und der steht auf dem Energielabel, bezogen auf das Eco-Programm bei voller Beladung.`,
      `Praktisch die gesamte Energie geht ins Aufheizen des Wassers, und daran hängt der einzige große Hebel: die Temperatur. Ein Waschgang bei 60 Grad braucht ungefähr das Doppelte eines Eco-Programms – bei ${preset.usage} Wäschen pro Woche wären das ${heissKosten} statt ${f.jahr} im Jahr. Normal verschmutzte Alltagswäsche wird bei 30 oder 40 Grad genauso sauber, sofern das Waschmittel dazu passt. 60 Grad sind nur bei Handtüchern, Bettwäsche und im Krankheitsfall sinnvoll, und dann besser gelegentlich als grundsätzlich.`,
      `Das Eco-Programm ist die zweite Stelle, an der viele das Gegenteil des Erwarteten tun. Es dauert länger, nicht weil es mehr macht, sondern weil es weniger heizt und den Schmutz stattdessen über Zeit löst – die längere Laufzeit ist genau der Grund für den geringeren Verbrauch. Der Standby fällt daneben kaum ins Gewicht: ${formatAmount(preset.standbyWatts)} Watt ergeben ${formatEuro(f.ergebnis.standbyCostPerYear)} im Jahr, also ${formatAmount(f.ergebnis.standbyShare)} Prozent.`,
    ],
    faq: [
      {
        question: "Was kostet ein Waschgang?",
        answer: `${jeDurchgang(preset)} bei ${formatAmount(preset.kwhPerCycle)} Kilowattstunden und ${PREIS_CENT} Cent je Kilowattstunde – Strom allein, ohne Wasser und Waschmittel. Mit Wasser und Waschmittel liegt eine Ladung bei etwa 60 bis 80 Cent. Bei 60 Grad verdoppeln sich die Stromkosten je Waschgang ungefähr.`,
      },
      {
        question: "Was kostet eine Waschmaschine im Jahr?",
        answer: `Bei ${preset.usage} Waschgängen pro Woche: ${f.kwh} Kilowattstunden und ${f.jahr}. Wer überwiegend bei 60 Grad wäscht, landet bei rund ${heissKosten}. Trage oben deine eigene Zahl der Waschgänge ein – ein Vierpersonenhaushalt kommt eher auf sechs bis acht pro Woche, ein Single auf zwei.`,
      },
      {
        question: "Spart das Eco-Programm wirklich, obwohl es länger dauert?",
        answer: `Ja, und der Zusammenhang ist genau umgekehrt zur Intuition: Es dauert länger, weil es weniger heizt. Das Aufheizen des Wassers macht den Großteil des Verbrauchs aus; die Trommelbewegung kostet fast nichts. Ein Eco-Programm über drei Stunden bei 40 Grad braucht deshalb weniger als ein Kurzprogramm über eine Stunde bei 60 Grad.`,
      },
      {
        question: "Lohnt sich waschen mit 30 statt 60 Grad?",
        answer: `Für normale Alltagswäsche ja – der Unterschied liegt bei rund der Hälfte der Stromkosten, hier also ${formatEuroRounded(f.ergebnis.costPerYear)} statt ${heissKosten} im Jahr. Wichtig ist nur, gelegentlich heiß zu waschen und die Trommel zwischendurch offen stehen zu lassen: Dauerhaft niedrige Temperaturen begünstigen Ablagerungen und Geruch in der Maschine. Ein Waschgang bei 60 Grad im Monat reicht dafür aus.`,
      },
    ],
  };
}

export const variantenTexte: VariantContent[] = [
  trockner(),
  kuehlschrank(),
  heizluefter(),
  gaming(),
  klimageraet(),
  waschmaschine(),
];
