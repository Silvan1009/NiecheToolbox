import { BookOpenText } from "lucide-react";
import type { ToolManifest } from "@/tools/types";
import { lesezeitAffiliate } from "./affiliate";
import Component from "./Component";

export const lesezeit: ToolManifest = {
  slug: "lesezeit",
  name: "Lesezeit-Rechner",
  tagline:
    "Wie lange dauert dieser Text? Wörter zählen, Lesedauer schätzen, Vorlesezeit gleich mit.",
  category: "text",
  icon: BookOpenText,
  status: "live",
  keywords: [
    "lesezeit berechnen",
    "lesedauer",
    "wörter zählen",
    "zeichen zählen",
    "wie lange lesen",
    "vorlesezeit",
    "sprechdauer",
  ],

  Component,

  about: [
    "Die Lesezeit ergibt sich aus der Wortzahl geteilt durch die Lesegeschwindigkeit. Für stilles Lesen deutscher Sachtexte werden meist 200 bis 250 Wörter pro Minute angesetzt; wer aufmerksam liest und mitdenkt, liegt eher bei 150. Beim Überfliegen kommt man auf ein Vielfaches, nimmt dafür aber nur die Kernaussagen mit.",
    "Fürs laute Vorlesen gilt eine andere Größe: rund 130 Wörter pro Minute. Das ist die Zahl, die zählt, wenn du einen Vortrag, ein Video-Skript oder eine Rede planst – hier ist die Vorlesezeit gleich mit ausgewiesen.",
    "Dein Text verlässt deinen Browser nicht. Er wird lokal analysiert, nirgendwo gespeichert und steht auch nicht im geteilten Link – dort landet nur die Wortzahl.",
  ],

  faq: [
    {
      question: "Wie viele Wörter liest man pro Minute?",
      answer:
        "Erwachsene lesen stille Sachtexte typischerweise mit 200 bis 250 Wörtern pro Minute. Anspruchsvolle Fachtexte drücken das Tempo auf 100 bis 150, beim Überfliegen sind 350 und mehr möglich. Deshalb kannst du hier zwischen drei Geschwindigkeiten wählen.",
    },
    {
      question: "Warum dauert Vorlesen länger als Lesen?",
      answer:
        "Beim Sprechen bestimmen Atempausen, Betonung und Satzmelodie das Tempo. Als Richtwert gelten 130 Wörter pro Minute – für Vorträge und Video-Skripte ist das die verlässlichere Zahl.",
    },
    {
      question: "Wie werden Wörter gezählt?",
      answer:
        "Getrennt wird an Leerzeichen und Zeilenumbrüchen. Satzzeichen am Wortrand fallen weg, zusammengesetzte Wörter wie „E-Mail“ und Zahlen wie „1.500“ bleiben ein Wort. Ein alleinstehender Gedankenstrich zählt nicht mit.",
    },
    {
      question: "Wird mein Text gespeichert oder übertragen?",
      answer:
        "Nein. Die Berechnung passiert vollständig in deinem Browser. Beim Teilen wandert nur die Wortzahl in den Link, nie der Text selbst.",
    },
  ],

  monetization: {
    adDensity: "low",
    affiliate: lesezeitAffiliate,
  },
};
