# Ausgangslage vor der Konsolidierung (Etappe 0)

Commit: d3aa3a3c600a66dfcb8a157a384bbac5e556ab30 (origin/main)
Datum: 2026-09-15

## Alle Seiten unter 800 Wörtern eigener Prosa

`scripts/content-audit.ts` zählt 51, weil es `/wege/` und `/rechner/` als reine
Verzeichnisseiten von der Wortgrenze ausnimmt (`LISTING_PAGES`). Diese Tabelle
listet alle 53 zur Vollständigkeit mit.

| Wörter | Pfad |
|---:|---|
| 116 | `/wege/` (Verzeichnisseite, ausgenommen) |
| 126 | `/rechner/` (Verzeichnisseite, ausgenommen) |
| 223 | `/rechtliches/impressum/` |
| 554 | `/tools/lesezeit/` |
| 592 | `/` |
| 631 | `/tools/arbeitstage/` |
| 646 | `/tools/geburtstermin/` |
| 652 | `/tools/bmi/` |
| 657 | `/wege/gehalt/3-prozent/` |
| 657 | `/wege/gehalt/15-prozent/` |
| 660 | `/wege/gehalt/10-prozent/` |
| 662 | `/wege/gehalt/5-prozent/` |
| 669 | `/tools/kalorienbedarf/` |
| 672 | `/tools/trinkgeld/` |
| 678 | `/tools/brueckentage/` |
| 697 | `/tools/elternzeit/` |
| 712 | `/tools/backform/20-auf-26/` |
| 713 | `/tools/backform/26-auf-18/` |
| 713 | `/tools/backform/24-auf-20/` |
| 718 | `/wege/autokauf/` |
| 722 | `/tools/backform/26-auf-28/` |
| 722 | `/tools/backform/24-auf-26/` |
| 722 | `/tools/backform/22-auf-26/` |
| 722 | `/tools/backform/18-auf-26/` |
| 723 | `/tools/backform/26-auf-20/` |
| 723 | `/tools/backform/26-auf-24/` |
| 723 | `/tools/backform/28-auf-26/` |
| 723 | `/tools/immobilienrechner/kaufnebenkosten-mecklenburg-vorpommern/` |
| 723 | `/tools/immobilienrechner/kaufnebenkosten-sachsen-anhalt/` |
| 730 | `/tools/partymengen/` |
| 731 | `/tools/prozentrechner/` |
| 733 | `/tools/immobilienrechner/kaufnebenkosten-bremen/` |
| 733 | `/tools/immobilienrechner/kaufnebenkosten-nordrhein-westfalen/` |
| 740 | `/tools/immobilienrechner/kaufnebenkosten-niedersachsen/` |
| 740 | `/wege/nachwuchs/` |
| 741 | `/tools/immobilienrechner/kaufnebenkosten-rheinland-pfalz/` |
| 742 | `/tools/immobilienrechner/kaufnebenkosten-hessen/` |
| 743 | `/tools/immobilienrechner/kaufnebenkosten-hamburg/` |
| 750 | `/ueber/` |
| 753 | `/tools/immobilienrechner/kaufnebenkosten-berlin/` |
| 753 | `/tools/immobilienrechner/kaufnebenkosten-saarland/` |
| 755 | `/tools/immobilienrechner/kaufnebenkosten-brandenburg/` |
| 756 | `/tools/immobilienrechner/kaufnebenkosten-schleswig-holstein/` |
| 757 | `/tools/immobilienrechner/kaufnebenkosten-baden-wuerttemberg/` |
| 761 | `/tools/immobilienrechner/kaufnebenkosten-thueringen/` |
| 763 | `/tools/immobilienrechner/kaufnebenkosten-sachsen/` |
| 771 | `/tools/immobilienrechner/kaufnebenkosten-bayern/` |
| 789 | `/wege/gehalt/` |
| 791 | `/tools/stromkosten/` |
| 793 | `/tools/brueckentage/hessen-2028/` |
| 796 | `/tools/brueckentage/schleswig-holstein-2028/` |
| 797 | `/wege/ruhestand/` |
| 799 | `/tools/brueckentage/nordrhein-westfalen-2028/` |

## Überlappung je Tool-Familie (nur Varianten, max/median)

| Familie | Varianten | min Wörter | max Wörter | max Überlappung | median Überlappung |
|---|---:|---:|---:|---:|---:|
| /tools/brueckentage | 48 | 793 | 872 | 79.4% | 45.2% |
| /tools/arbeitstage | 32 | 870 | 934 | 76.1% | 59.3% |
| /tools/immobilienrechner | 16 | 723 | 771 | 70.7% | 49.6% |
| /tools/backform | 10 | 712 | 723 | 65.8% | 53.9% |
| /tools/aktienkennzahlen | 10 | 1131 | 1206 | 47.8% | 46.1% |
| /tools/sparplan | 9 | 1113 | 1224 | 45.7% | 43.7% |
| /tools/kreditrechner | 9 | 1030 | 1114 | 47.4% | 44.2% |
| /tools/bruttonetto | 9 | 1000 | 1066 | 48.0% | 46.1% |
| /tools/stromkosten | 6 | 839 | 934 | 29.5% | 27.9% |
| /tools/energiekosten | 6 | 862 | 909 | 44.2% | 40.7% |
| /tools/kindergeld | 5 | 828 | 847 | 43.5% | 40.2% |
| /tools/umzug | 5 | 866 | 909 | 79.9% | 69.0% |
| /tools/partymengen | 5 | 879 | 897 | 77.9% | 58.8% |
| /tools/urlaubsbudget | 4 | 897 | 923 | 44.7% | 44.0% |
| /wege/gehalt | 4 | 657 | 662 | 53.5% | 49.9% |

## Gesamtwerte (aus scripts/content-audit.ts)

- Seiten in der Sitemap: 218
- Einmalige Wortfolgen: 77.6 % (Ziel ≥ 85.0 %)
- Seiten unter 800 Wörtern: 51
- Stärkste Überlappung: 79.9 % (Ziel ≤ 40.0 %)
- Exportgröße: 29.1 MiB (Grenze 47.7 MiB)
