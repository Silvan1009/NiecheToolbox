import { ShieldCheck } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { versicherungsvergleichAffiliate } from "./affiliate";
import Component from "./Component";

const about: string[] = [
  "Anders als bei Zinsen oder Steuern gibt es bei einer Versicherungsprämie keine Formel, die ein exaktes Ergebnis liefert – jeder Versicherer legt seine Tarife selbst fest, nach einem eigenen, nicht veröffentlichten Tarifwerk. Was sich dagegen gut belegen lässt, sind Marktdurchschnitte und die Richtung, in die bestimmte Merkmale wirken: Eine hohe Schadenfreiheitsklasse senkt die Kfz-Prämie immer, ein körperlich fordernder Beruf erhöht die Berufsunfähigkeitsprämie immer. Dieser Rechner nimmt einen recherchierten Marktdurchschnitt als Ausgangspunkt und wendet darauf Richtungsfaktoren an, deren Größenordnung an veröffentlichten Beispielrechnungen kalibriert ist. Am Ende steht eine Spanne zur Einordnung – keine Offerte und kein Angebot.",
  "Bei der Kfz-Versicherung ist der wichtigste, am meisten unterschätzte Hebel die Schadenfreiheitsklasse: Ein Einsteiger in SF 0 zahlt oft mehr als das Doppelte der Basisprämie, während eine Person mit dreißig unfallfreien Jahren nur noch etwa die Hälfte zahlt. Region, Fahrzeugtyp, Alter und Fahrleistung wirken in dieselbe Richtung wie bei jedem Versicherer, auch wenn die genauen Regional- und Typklassen jedes Anbieters unterschiedlich sind – deshalb rechnet dieser Rechner mit groben, aber realistischen Bandbreiten statt mit einer einzelnen Tabelle eines bestimmten Anbieters.",
  "Bei der privaten Haftpflichtversicherung ist die Spannbreite zwischen den Anbietern besonders groß, weil das versicherte Risiko bei fast allen Verträgen ähnlich klein ist – ein Fahrradunfall oder eine umgestoßene Vase kosten überall etwa dasselbe an Schadensumme. Wer hier deutlich mehr zahlt als der Richtwert, versichert meist nicht mehr Risiko, sondern zahlt für einen älteren Tarif oder unnötige Zusatzbausteine. Das macht die Privathaftpflicht zu der Versicherung, bei der ein Wechsel am einfachsten Geld spart, ohne dass sich am Schutz etwas verschlechtert.",
  "Bei der Berufsunfähigkeitsversicherung ist die Schätzung deutlich unsicherer als bei den beiden anderen Arten, und das hat einen Grund: Der Beitrag hängt hier extrem stark von individuellen Faktoren ab, die dieser Rechner nicht kennt – vor allem Gesundheitsfragen, Rauchstatus und der exakte, nicht nur grob eingeordnete Beruf. Zwei Personen mit identischer Risikogruppe können bei derselben Gesellschaft völlig unterschiedliche Beiträge bekommen, wenn eine von ihnen Vorerkrankungen hat. Die hier gezeigte Zahl ordnet nur ein, in welcher Größenordnung sich der Markt für ein vergleichbares Profil bewegt – eine verbindliche Aussage kann ausschließlich eine echte Risikoprüfung beim Versicherer treffen.",
  "Alle Richtwerte sind Marktdurchschnitte aus aktuellen Tarifvergleichen (Kfz: Verivox-Kfz-Versicherungsreport; Privathaftpflicht und Berufsunfähigkeit: Finanztip-Tarifvergleiche), Stand Juli 2026, und keine Anlage- oder Versicherungsberatung. Die tatsächliche Prämie hängt vom gewählten Versicherer, dem genauen Vertragsumfang und – bei der Berufsunfähigkeit – von der individuellen Gesundheitsprüfung ab. Wer deutlich über der geschätzten Spanne liegt, hat einen guten Anlass für einen Tarifvergleich; wer deutlich darunter liegt, sollte prüfen, ob die Deckung noch zum eigenen Bedarf passt.",
];

const faq: FaqEntry[] = [
  {
    question: "Ist das eine echte Preisberechnung wie beim Kreditrechner?",
    answer:
      "Nein, und das ist ein wichtiger Unterschied. Ein Kreditzins folgt einer festen mathematischen Formel, eine Versicherungsprämie legt jeder Anbieter nach eigenem, nicht öffentlichem Tarifwerk fest. Dieser Rechner zeigt deshalb einen recherchierten Marktdurchschnitt und die Richtung, in die einzelne Merkmale die Prämie typischerweise verschieben – als Orientierung, nicht als Angebot. Ein verbindlicher Preis kommt immer erst von einem tatsächlichen Versicherer.",
  },
  {
    question: "Warum wirkt sich die Schadenfreiheitsklasse bei der Kfz-Versicherung so stark aus?",
    answer:
      "Weil sie das direkteste Maß für das tatsächliche Unfallrisiko einer fahrenden Person ist, das ein Versicherer hat. Ein Einsteiger in SF 0 hat noch keine Schadenhistorie, gilt also statistisch als riskanter, und zahlt deshalb oft mehr als das Doppelte einer erfahrenen Person mit derselben Deckung. Mit jedem unfallfreien Jahr sinkt die Einstufung, bis viele Versicherer nach etwa 25 bis 35 Jahren die günstigste Klasse erreichen. Wer als Einsteiger startet, kann oft günstiger als Zweitfahrer bei einem Elternteil oder Partner mitversichert werden, statt die teure Startklasse allein zu durchlaufen.",
  },
  {
    question: "Warum ist die Spanne bei der Berufsunfähigkeitsversicherung so viel breiter?",
    answer:
      "Weil dort mehr individuelle Faktoren mitspielen, die dieser Rechner nicht abfragt. Kfz- und Haftpflichtprämien hängen überwiegend von objektiven, leicht abfragbaren Merkmalen ab – Alter, Region, Fahrzeug. Bei der Berufsunfähigkeit entscheidet zusätzlich die individuelle Gesundheit: Vorerkrankungen, Rauchstatus, sogar Hobbys können den Beitrag erheblich verändern oder zu Risikozuschlägen und Ausschlüssen führen. Deshalb ist hier nur eine grobe Größenordnung möglich, keine engere Schätzung.",
  },
  {
    question: "Was bedeutet die Einordnung „über dem Durchschnitt“ bei meiner eigenen Prämie?",
    answer:
      "Dass die eingetragene eigene Prämie oberhalb der geschätzten Marktspanne für das eingegebene Profil liegt. Das muss nicht falsch sein – ältere Verträge, umfangreichere Zusatzleistungen oder ein bereits erfolgter Schadenfall können das rechtfertigen. Es ist aber ein guter Anlass, den eigenen Vertrag mit aktuellen Tarifen zu vergleichen, statt automatisch weiterzuzahlen. Bei „im Rahmen“ bewegt sich die eigene Prämie dagegen im Bereich dessen, was für ein vergleichbares Profil üblich ist.",
  },
  {
    question: "Woher stammen die Durchschnittswerte?",
    answer:
      "Aus aktuellen Tarifvergleichen unabhängiger Vergleichsportale: für die Kfz-Versicherung aus dem Verivox-Kfz-Versicherungsreport, für Privathaftpflicht und Berufsunfähigkeit aus Finanztip-Tarifvergleichen, jeweils Stand Juli 2026. Diese Werte ändern sich mit der Marktentwicklung – Kfz-Prämien sind in den vergangenen Jahren mehrfach deutlich gestiegen –, weshalb ein aktueller Tarifvergleich immer genauer ist als jeder hier hinterlegte Durchschnittswert.",
  },
  {
    question: "Lohnt sich eine Selbstbeteiligung bei der Privathaftpflicht wirklich?",
    answer:
      "In den meisten Fällen ja. Eine Privathaftpflichtversicherung ist für Großschäden gedacht – einen Personenschaden in sechsstelliger Höhe kann kaum jemand aus eigener Tasche zahlen. Kleinere Schäden von wenigen Hundert Euro werden dagegen oft ohnehin nicht gemeldet, um die Einstufung nicht zu verschlechtern. Eine Selbstbeteiligung von 150 bis 250 Euro senkt die Prämie spürbar, ohne den eigentlichen Zweck der Versicherung – den Schutz vor Großschäden – zu schmälern.",
  },
  {
    question: "Warum steigt die BU-Prämie mit dem Eintrittsalter so stark?",
    answer:
      "Weil zwei Effekte zusammenkommen: Das statistische Risiko einer Berufsunfähigkeit steigt mit dem Alter deutlich, und eine später abgeschlossene Versicherung hat automatisch eine kürzere Laufzeit bis zum vereinbarten Ende, wodurch sich dieselbe Wahrscheinlichkeit auf weniger Beitragsjahre verteilt. Wer früh abschließt, sichert sich außerdem die Gesundheit von heute für den ganzen Vertrag – eine erst mit 45 beantragte Versicherung muss bereits vorhandene gesundheitliche Einschränkungen berücksichtigen, eine mit 25 beantragte in der Regel noch nicht.",
  },
];

export const versicherungsvergleich: ToolManifest = {
  slug: "versicherungsvergleich",
  name: "Versicherungs-Vergleichsrechner",
  tagline:
    "Kfz-, Privathaftpflicht- und Berufsunfähigkeitsversicherung gegen den Marktdurchschnitt einordnen – mit Richtwert, Spanne und den Faktoren dahinter.",
  category: "geld",
  icon: ShieldCheck,
  status: "live",
  keywords: [
    "versicherungsvergleich",
    "kfz versicherung durchschnittspreis",
    "privathaftpflicht durchschnittspreis",
    "berufsunfähigkeitsversicherung kosten",
    "bin ich zu teuer versichert",
    "kfz versicherung vergleichen",
    "bu versicherung beitrag berechnen",
    "haftpflichtversicherung preis",
  ],

  Component,

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: versicherungsvergleichAffiliate,
  },
};
