import { describe, expect, it } from "vitest";
import { formatEuro } from "@/lib/format";
import {
  formatKennzahl,
  kennzahlGruppen,
  kennzahlKeys,
  kennzahlen,
  kennzahlenDerGruppe,
  tendenzText,
} from "./kennzahlen";
import {
  DDM_MIN_ABSTAND,
  GRAHAM_FAKTOR,
  calculateAktie,
  defaultInput,
  type AktienInput,
} from "./logic";

const basis = defaultInput();

const rechne = (overrides: Partial<AktienInput> = {}) =>
  calculateAktie({ ...basis, ...overrides });

/* ---------------------------------------------------------------------------
 * Größenordnung
 * ------------------------------------------------------------------------- */

describe("Größenordnung", () => {
  it("multipliziert Kurs und Aktienanzahl zum Börsenwert", () => {
    // 68 € × 120 Mio. Stück = 8.160 Mio. €
    expect(rechne().marktkapitalisierungMio).toBeCloseTo(8160, 6);
  });

  it("zieht die Liquidität von den Finanzschulden ab", () => {
    const result = rechne();
    expect(result.nettofinanzschuldenMio).toBeCloseTo(1020, 6);
    expect(result.enterpriseValueMio).toBeCloseTo(8160 + 1020, 6);
  });

  it("weist mehr Liquidität als Schulden als Netto-Liquidität aus", () => {
    const result = rechne({ finanzschuldenMio: 200, liquiditaetMio: 900 });
    expect(result.nettofinanzschuldenMio).toBeCloseTo(-700, 6);
    // Der Unternehmenswert liegt dann unter dem Börsenwert – die Kasse
    // gehört wirtschaftlich dem Käufer.
    expect(result.enterpriseValueMio).toBeCloseTo(8160 - 700, 6);
  });

  it("zieht die Investitionen vom operativen Cashflow ab", () => {
    expect(rechne().freeCashflowMio).toBeCloseTo(420, 6);
  });
});

/* ---------------------------------------------------------------------------
 * Je Aktie
 * ------------------------------------------------------------------------- */

describe("Angaben je Aktie", () => {
  it("rechnet Millionenbeträge auf eine Aktie um", () => {
    const result = rechne();
    expect(result.gewinnJeAktie).toBeCloseTo(430 / 120, 8);
    expect(result.umsatzJeAktie).toBeCloseTo(40, 8);
    expect(result.buchwertJeAktie).toBeCloseTo(2600 / 120, 8);
    expect(result.cashflowJeAktie).toBeCloseTo(6, 8);
    expect(result.fcfJeAktie).toBeCloseTo(3.5, 8);
  });

  it("liefert ohne Aktienanzahl keine Angaben je Aktie", () => {
    const result = rechne({ aktienMio: 0 });
    expect(result.gewinnJeAktie).toBeNull();
    expect(result.buchwertJeAktie).toBeNull();
    expect(result.kgv).toBeNull();
  });

  it("lässt einen negativen Buchwert je Aktie stehen", () => {
    // Negatives Eigenkapital ist eine Aussage und kein Eingabefehler – nur ein
    // KBV lässt sich daraus nicht mehr bilden.
    const result = rechne({ eigenkapitalMio: -300 });
    expect(result.buchwertJeAktie).toBeCloseTo(-2.5, 8);
    expect(result.kbv).toBeNull();
  });
});

/* ---------------------------------------------------------------------------
 * Bewertung
 * ------------------------------------------------------------------------- */

describe("Bewertungskennzahlen", () => {
  it("rechnet die Vielfachen aus Kurs und Bezugsgröße", () => {
    const result = rechne();
    expect(result.kgv).toBeCloseTo(8160 / 430, 8);
    expect(result.kuv).toBeCloseTo(8160 / 4800, 8);
    expect(result.kbv).toBeCloseTo(8160 / 2600, 8);
    expect(result.kcv).toBeCloseTo(8160 / 720, 8);
    expect(result.kfcv).toBeCloseTo(8160 / 420, 8);
  });

  it("bezieht die EV-Vielfachen auf den Unternehmenswert", () => {
    const result = rechne();
    expect(result.evEbitda).toBeCloseTo(9180 / 900, 8);
    expect(result.evEbit).toBeCloseTo(9180 / 640, 8);
    expect(result.evUmsatz).toBeCloseTo(9180 / 4800, 8);
  });

  it("weist die Gewinnrendite als Kehrwert des KGV aus", () => {
    const result = rechne();
    expect(result.gewinnrendite).not.toBeNull();
    expect(result.gewinnrendite!).toBeCloseTo(100 / (8160 / 430), 8);
  });

  it("setzt das KGV ins Verhältnis zum Wachstum", () => {
    const result = rechne({ gewinnwachstumPercent: 10 });
    expect(result.peg).toBeCloseTo(8160 / 430 / 10, 8);
  });

  it("bildet kein PEG ohne Wachstum", () => {
    expect(rechne({ gewinnwachstumPercent: 0 }).peg).toBeNull();
    expect(rechne({ gewinnwachstumPercent: -3 }).peg).toBeNull();
  });

  it("lässt bei einem Verlust die gewinnabhängigen Kennzahlen entfallen", () => {
    const result = rechne({ gewinnMio: -120 });
    expect(result.kgv).toBeNull();
    expect(result.peg).toBeNull();
    expect(result.ausschuettungsquote).toBeNull();
    // Umsatz-, Buchwert- und Cashflow-Vielfache bleiben brauchbar.
    expect(result.kuv).toBeCloseTo(8160 / 4800, 8);
    expect(result.kbv).not.toBeNull();
    expect(result.kcv).not.toBeNull();
    // Die Gewinnrendite bleibt – als negative Zahl. Sie ist der ehrlichere
    // Blick auf ein Verlustjahr als ein fehlendes KGV.
    expect(result.gewinnrendite!).toBeCloseTo((-120 / 120 / 68) * 100, 8);
  });

  it("bildet keine EV-Vielfachen bei negativem Unternehmenswert", () => {
    // Mehr Kasse als Börsenwert: rechnerisch möglich, als Vielfaches sinnlos.
    const result = rechne({ liquiditaetMio: 12000 });
    expect(result.enterpriseValueMio).toBeLessThan(0);
    expect(result.evEbitda).toBeNull();
    expect(result.evEbit).toBeNull();
    expect(result.evUmsatz).toBeNull();
  });

  it("bildet keine Vielfachen ohne Kurs", () => {
    const result = rechne({ kurs: 0 });
    expect(result.kgv).toBeNull();
    expect(result.kuv).toBeNull();
    expect(result.dividendenrendite).toBeNull();
    expect(result.abweichungProzent).toBeNull();
  });
});

/* ---------------------------------------------------------------------------
 * Rentabilität
 * ------------------------------------------------------------------------- */

describe("Rentabilität", () => {
  it("rechnet die Margen auf den Umsatz", () => {
    const result = rechne();
    expect(result.ebitdaMarge).toBeCloseTo((900 / 4800) * 100, 8);
    expect(result.ebitMarge).toBeCloseTo((640 / 4800) * 100, 8);
    expect(result.nettomarge).toBeCloseTo((430 / 4800) * 100, 8);
  });

  it("rechnet die Kapitalrenditen", () => {
    const result = rechne();
    expect(result.roe).toBeCloseTo((430 / 2600) * 100, 8);
    expect(result.roa).toBeCloseTo((430 / 6100) * 100, 8);
    // Eingesetztes Kapital = Bilanzsumme ohne kurzfristige Verbindlichkeiten.
    expect(result.roce).toBeCloseTo((640 / (6100 - 1400)) * 100, 8);
  });

  it("bildet keine Eigenkapitalrendite bei negativem Eigenkapital", () => {
    const result = rechne({ eigenkapitalMio: -300 });
    expect(result.roe).toBeNull();
    expect(result.eigenkapitalquote).toBeNull();
    expect(result.verschuldungsgrad).toBeNull();
  });

  it("vergleicht den operativen Cashflow mit dem Gewinn", () => {
    expect(rechne().gewinnqualitaet).toBeCloseTo((720 / 430) * 100, 8);
    expect(rechne({ gewinnMio: -50 }).gewinnqualitaet).toBeNull();
  });
});

/* ---------------------------------------------------------------------------
 * Bilanz
 * ------------------------------------------------------------------------- */

describe("Bilanz und Verschuldung", () => {
  it("rechnet Quote, Gearing, Schuldenlast und Deckungsgrade", () => {
    const result = rechne();
    expect(result.eigenkapitalquote).toBeCloseTo((2600 / 6100) * 100, 8);
    expect(result.verschuldungsgrad).toBeCloseTo((1020 / 2600) * 100, 8);
    expect(result.nettoschuldenEbitda).toBeCloseTo(1020 / 900, 8);
    expect(result.zinsdeckung).toBeCloseTo(640 / 60, 8);
    expect(result.liquiditaetsgrad3).toBeCloseTo((2300 / 1400) * 100, 8);
  });

  it("weist Netto-Liquidität negativ aus", () => {
    const result = rechne({ finanzschuldenMio: 100, liquiditaetMio: 700 });
    expect(result.nettoschuldenEbitda).toBeCloseTo(-600 / 900, 8);
    expect(result.verschuldungsgrad).toBeCloseTo((-600 / 2600) * 100, 8);
  });

  it("bildet keine Zinsdeckung ohne Zinsaufwand", () => {
    expect(rechne({ zinsaufwandMio: 0 }).zinsdeckung).toBeNull();
  });
});

/* ---------------------------------------------------------------------------
 * Dividende
 * ------------------------------------------------------------------------- */

describe("Dividende", () => {
  it("rechnet Rendite und Ausschüttungsquote", () => {
    const result = rechne();
    expect(result.dividendenrendite).toBeCloseTo((1.4 / 68) * 100, 8);
    expect(result.ausschuettungsquote).toBeCloseTo((1.4 / (430 / 120)) * 100, 8);
  });

  it("unterscheidet keine Dividende von einer fehlenden Angabe", () => {
    // Null Dividende ist eine Aussage: die Rendite ist dann null Prozent.
    const result = rechne({ dividendeJeAktie: 0 });
    expect(result.dividendenrendite).toBe(0);
    expect(result.ausschuettungsquote).toBe(0);
    // Ein Dividendenmodell lässt sich ohne Dividende dagegen nicht rechnen.
    expect(result.fairerWertDividende).toBeNull();
  });
});

/* ---------------------------------------------------------------------------
 * Fairer Wert
 * ------------------------------------------------------------------------- */

describe("Fairer Wert", () => {
  it("rechnet das KGV-Modell auf den Gewinn je Aktie", () => {
    expect(rechne().fairerWertKgv).toBeCloseTo(18 * (430 / 120), 8);
  });

  it("rechnet die Graham-Zahl aus Gewinn und Buchwert", () => {
    const eps = 430 / 120;
    const buchwert = 2600 / 120;
    expect(rechne().fairerWertGraham).toBeCloseTo(
      Math.sqrt(GRAHAM_FAKTOR * eps * buchwert),
      8,
    );
  });

  it("diskontiert die wachsende Dividende", () => {
    // Gordon: D × (1 + g) / (r − g), hier 1,40 × 1,07 / 0,03.
    expect(rechne().fairerWertDividende).toBeCloseTo((1.4 * 1.07) / 0.03, 8);
  });

  it("verweigert das Dividendenmodell bei zu kleinem Abstand zum Wachstum", () => {
    const result = rechne({
      gewinnwachstumPercent: 7,
      renditeanspruchPercent: 7 + DDM_MIN_ABSTAND - 0.5,
    });
    expect(result.fairerWertDividende).toBeNull();
    expect(result.warnings.some((w) => w.includes("Dividendenmodell"))).toBe(true);
    // Die anderen Verfahren bleiben davon unberührt.
    expect(result.fairerWertKgv).not.toBeNull();
    expect(result.fairerWertGraham).not.toBeNull();
  });

  it("mittelt nur über die Verfahren, die sich rechnen lassen", () => {
    const ohneDividende = rechne({ dividendeJeAktie: 0 });
    const kgvWert = ohneDividende.fairerWertKgv!;
    const graham = ohneDividende.fairerWertGraham!;
    expect(ohneDividende.fairerWertSchnitt).toBeCloseTo((kgvWert + graham) / 2, 8);
    expect(ohneDividende.fairerWertMin).toBeCloseTo(Math.min(kgvWert, graham), 8);
    expect(ohneDividende.fairerWertMax).toBeCloseTo(Math.max(kgvWert, graham), 8);
  });

  it("liefert ohne jedes Verfahren keinen fairen Wert", () => {
    const result = rechne({
      gewinnMio: -200,
      eigenkapitalMio: -50,
      dividendeJeAktie: 0,
    });
    expect(result.fairerWertKgv).toBeNull();
    expect(result.fairerWertGraham).toBeNull();
    expect(result.fairerWertDividende).toBeNull();
    expect(result.fairerWertSchnitt).toBeNull();
    expect(result.abweichungProzent).toBeNull();
  });

  it("misst die Abweichung vom Kurs mit Vorzeichen", () => {
    const result = rechne();
    const schnitt = result.fairerWertSchnitt!;
    expect(result.abweichungProzent).toBeCloseTo(((schnitt - 68) / 68) * 100, 8);
    // Bei diesen Annahmen liegt der Kurs über dem Mittel der Verfahren.
    expect(result.abweichungProzent!).toBeLessThan(0);
  });
});

/* ---------------------------------------------------------------------------
 * Projektion
 * ------------------------------------------------------------------------- */

describe("Projektion und erwartete Rendite", () => {
  it("schreibt Gewinn und Dividende mit derselben Rate fort", () => {
    const result = rechne({ horizontJahre: 3 });
    expect(result.jahre).toHaveLength(3);

    const eps = 430 / 120;
    expect(result.jahre[0].gewinnJeAktie).toBeCloseTo(eps * 1.07, 8);
    expect(result.jahre[2].gewinnJeAktie).toBeCloseTo(eps * 1.07 ** 3, 8);
    expect(result.jahre[2].dividende).toBeCloseTo(1.4 * 1.07 ** 3, 8);
    // Die Ausschüttungsquote bleibt damit über die ganze Projektion konstant.
    expect(result.jahre[2].dividende / result.jahre[2].gewinnJeAktie).toBeCloseTo(
      1.4 / eps,
      8,
    );
  });

  it("summiert die Dividenden ohne Wiederanlage", () => {
    const result = rechne({ horizontJahre: 3 });
    const erwartet = 1.4 * (1.07 + 1.07 ** 2 + 1.07 ** 3);
    expect(result.jahre[2].dividendeKumuliert).toBeCloseTo(erwartet, 8);
    expect(result.dividendenSumme).toBeCloseTo(erwartet, 8);
  });

  it("bewertet den Endkurs mit dem fairen KGV", () => {
    const result = rechne({ horizontJahre: 10 });
    const epsEnde = (430 / 120) * 1.07 ** 10;
    expect(result.gewinnJeAktieEnde).toBeCloseTo(epsEnde, 8);
    expect(result.kursErwartetEnde).toBeCloseTo(18 * epsEnde, 8);
  });

  it("rechnet die erwartete Rendite als Rendite pro Jahr", () => {
    const result = rechne({ horizontJahre: 10 });
    const gesamt = result.gesamtwertEnde!;
    expect(result.erwarteteRenditeProJahr).toBeCloseTo(
      ((gesamt / 68) ** (1 / 10) - 1) * 100,
      8,
    );
    // Zur Kontrolle: bei diesen Annahmen rund acht Prozent pro Jahr.
    expect(result.erwarteteRenditeProJahr!).toBeCloseTo(8.06, 1);
  });

  it("rechnet auch schrumpfende Gewinne fort", () => {
    const result = rechne({ gewinnwachstumPercent: -5, horizontJahre: 5 });
    expect(result.gewinnJeAktieEnde!).toBeLessThan(result.gewinnJeAktie!);
    expect(result.erwarteteRenditeProJahr!).toBeLessThan(0);
  });

  it("projiziert nichts ohne Gewinn je Aktie", () => {
    const result = rechne({ aktienMio: 0 });
    expect(result.jahre).toHaveLength(0);
    expect(result.gesamtwertEnde).toBeNull();
    expect(result.erwarteteRenditeProJahr).toBeNull();
  });
});

/* ---------------------------------------------------------------------------
 * Eingaben klemmen
 * ------------------------------------------------------------------------- */

describe("unsinnige Eingaben", () => {
  it("begrenzt den Horizont auf dreißig Jahre", () => {
    expect(rechne({ horizontJahre: 99 }).horizontJahre).toBe(30);
    expect(rechne({ horizontJahre: 0 }).horizontJahre).toBe(1);
  });

  it("behandelt negative Bestände als null", () => {
    const result = rechne({ kurs: -10, liquiditaetMio: -50 });
    expect(result.marktkapitalisierungMio).toBe(0);
    expect(result.nettofinanzschuldenMio).toBeCloseTo(1500, 6);
  });

  it("stürzt bei NaN nicht ab", () => {
    const result = rechne({
      kurs: Number.NaN,
      gewinnMio: Number.NaN,
      umsatzMio: Number.NaN,
      horizontJahre: Number.NaN,
    });
    expect(result.kgv).toBeNull();
    expect(result.nettomarge).toBeNull();
    expect(Number.isFinite(result.marktkapitalisierungMio)).toBe(true);
  });
});

/* ---------------------------------------------------------------------------
 * Hinweise
 * ------------------------------------------------------------------------- */

describe("Hinweise", () => {
  it("meldet bei den Voreinstellungen nur das hohe PEG", () => {
    // Die Startwerte sind absichtlich unauffällig – bis auf die Bewertung im
    // Verhältnis zum Wachstum. Fällt hier ein zweiter Hinweis an, hat sich
    // eine Voreinstellung verschoben.
    const warnings = rechne().warnings;
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("PEG");
  });

  it("warnt vor zu hoher Verschuldung", () => {
    const warnings = rechne({ finanzschuldenMio: 4000 }).warnings;
    expect(warnings.some((w) => w.includes("EBITDA"))).toBe(true);
  });

  it("warnt vor einer Dividende über dem Gewinn", () => {
    const warnings = rechne({ dividendeJeAktie: 4 }).warnings;
    expect(warnings.some((w) => w.includes("übersteigt den Gewinn"))).toBe(true);
  });

  it("warnt, wenn der Gewinn nicht als Geld ankommt", () => {
    const warnings = rechne({ operativerCashflowMio: 300 }).warnings;
    expect(warnings.some((w) => w.includes("operative Cashflow"))).toBe(true);
  });

  it("warnt bei negativem freien Cashflow", () => {
    const warnings = rechne({ investitionenMio: 900 }).warnings;
    expect(warnings.some((w) => w.includes("freie Cashflow"))).toBe(true);
  });

  it("meldet einen hohen Buchwertaufschlag nur bei positiver Rendite", () => {
    // KBV 3,1 bei 4,2 Prozent Eigenkapitalrendite: Der Aufschlag ist die
    // Erklärung wert.
    const schwach = rechne({ gewinnMio: 110 });
    expect(schwach.warnings.some((w) => w.includes("Buchwerts"))).toBe(true);

    // Im Verlustjahr wäre derselbe Satz Unsinn – dort erklärt der Hinweis zum
    // fehlenden Gewinn die Lage schon.
    const verlust = rechne({ gewinnMio: -120 });
    expect(verlust.warnings.some((w) => w.includes("Buchwerts"))).toBe(false);
  });

  it("warnt bei einem Verlust und bei negativem Eigenkapital", () => {
    expect(
      rechne({ gewinnMio: -50 }).warnings.some((w) => w.includes("keinen Gewinn")),
    ).toBe(true);
    expect(
      rechne({ eigenkapitalMio: -50 }).warnings.some((w) =>
        w.includes("Eigenkapital ist null oder negativ"),
      ),
    ).toBe(true);
  });
});

/* ---------------------------------------------------------------------------
 * Katalog
 * ------------------------------------------------------------------------- */

describe("Kennzahlen-Katalog", () => {
  const result = rechne();

  it("liefert für jede Kennzahl einen Wert oder bewusst null", () => {
    for (const key of kennzahlKeys) {
      const wert = kennzahlen[key].select(result);
      expect(wert === null || Number.isFinite(wert)).toBe(true);
    }
  });

  it("ordnet jede Kennzahl einer beschriebenen Gruppe zu", () => {
    const gruppen = new Set(kennzahlGruppen.map((g) => g.key));
    for (const key of kennzahlKeys) {
      expect(gruppen.has(kennzahlen[key].gruppe)).toBe(true);
    }
    // Und jede Gruppe trägt auch etwas.
    for (const gruppe of kennzahlGruppen) {
      expect(kennzahlenDerGruppe(gruppe.key).length).toBeGreaterThan(0);
    }
  });

  it("beschreibt jede bewertbare Kennzahl mit einem Faustwert", () => {
    for (const key of kennzahlKeys) {
      const def = kennzahlen[key];
      if (def.bewerten) expect(def.faustwert).toBeTruthy();
    }
  });

  it("ordnet Vielfache nach unten und Renditen nach oben ein", () => {
    expect(kennzahlen.kgv.bewerten!(12)).toBe("gut");
    expect(kennzahlen.kgv.bewerten!(20)).toBe("neutral");
    expect(kennzahlen.kgv.bewerten!(40)).toBe("schwach");

    expect(kennzahlen.roe.bewerten!(18)).toBe("gut");
    expect(kennzahlen.roe.bewerten!(12)).toBe("neutral");
    expect(kennzahlen.roe.bewerten!(4)).toBe("schwach");

    // Netto-Liquidität ist der beste Fall, nicht der schlechteste.
    expect(kennzahlen.nettoschuldenEbitda.bewerten!(-1.5)).toBe("gut");
  });

  it("bewertet eine sehr niedrige Ausschüttungsquote als unauffällig", () => {
    // Wer nichts ausschüttet, investiert entweder klug oder kann nicht – das
    // entscheidet diese Kennzahl nicht.
    expect(kennzahlen.ausschuettungsquote.bewerten!(10)).toBe("neutral");
    expect(kennzahlen.ausschuettungsquote.bewerten!(45)).toBe("gut");
    expect(kennzahlen.ausschuettungsquote.bewerten!(120)).toBe("schwach");
  });

  it("benennt dasselbe Urteil je nach Skala verschieden", () => {
    expect(tendenzText("preis", "gut")).toBe("günstig");
    expect(tendenzText("qualitaet", "gut")).toBe("stark");
  });

  it("formatiert Werte nach Einheit und fehlende Werte als Gedankenstrich", () => {
    expect(formatKennzahl("faktor", 18.9767)).toBe("18,98");
    expect(formatKennzahl("prozent", 5.2696)).toBe("5,27 %");
    // Intl setzt vor das Währungszeichen ein geschütztes Leerzeichen – der
    // Vergleich läuft deshalb gegen den Formatierer und nicht gegen ein
    // handgeschriebenes Literal.
    expect(formatKennzahl("euro", 3.5833)).toBe(formatEuro(3.58));
    expect(formatKennzahl("faktor", null)).toBe("–");
  });
});
