/**
 * Per-company AAOIFI screening ratios.
 *
 * AAOIFI / academic Sharia screening uses four filters:
 *
 *   | Filter        | Formula                                          | Limit            |
 *   | ------------- | ------------------------------------------------ | ---------------- |
 *   | Activity      | Qualitative                                      | Halal only       |
 *   | Debt          | Interest-bearing debt / Market cap               | ≤ 30%            |
 *   | Cash          | Cash + interest-bearing securities / Market cap  | ≤ 30%            |
 *   | Non-compliant | Non-compliant revenue / Total revenue            | ≤ 5%             |
 *
 * For each ticker we either ship the actual ratios (once data has
 * been collected) or a `null` value — the UI will render
 * "Available soon" pills until then.
 *
 * To populate a ticker, drop an entry into the `ratios` map below.
 * Example:
 *
 *   ratios.ATW = {
 *     activity: "haram",
 *     debtToMarketCapPct: 78.4,
 *     cashToMarketCapPct: 12.1,
 *     nonCompliantIncomePct: 95.0,
 *     asOfDate: "2025-12-31",
 *     source: "AAOIFI screening — 2025 annual report",
 *   };
 */

export type ActivityVerdict = "halal" | "mixed" | "haram";

export interface ShariaRatios {
  activity: ActivityVerdict | null;
  /** Interest-bearing debt / Market cap, in % (e.g. 27.4 for 27.4%) */
  debtToMarketCapPct: number | null;
  /** Cash + interest-bearing securities / Market cap, in % */
  cashToMarketCapPct: number | null;
  /** Non-Sharia-compliant revenue / Total revenue, in % */
  nonCompliantIncomePct: number | null;
  /** Reporting date used for the ratios above (ISO YYYY-MM-DD). */
  asOfDate: string | null;
  /** Free-form source/citation for the data set. */
  source: string | null;
}

export const EMPTY_RATIOS: ShariaRatios = {
  activity: null,
  debtToMarketCapPct: null,
  cashToMarketCapPct: null,
  nonCompliantIncomePct: null,
  asOfDate: null,
  source: null,
};

/**
 * Hand-curated dataset. Add a ticker entry here as the data becomes
 * available — the UI will automatically light up the row with a
 * pass/fail chip instead of "Available soon".
 */
export const ratios: Record<string, ShariaRatios> = {
  // ------------------------------------------------------------------
  // EXAMPLE — uncomment and fill in real numbers when ready.
  //
  // ATW: {
  //   activity: "haram",
  //   debtToMarketCapPct: 78.0,
  //   cashToMarketCapPct: 14.2,
  //   nonCompliantIncomePct: 96.0,
  //   asOfDate: "2025-12-31",
  //   source: "AAOIFI screening — 2025 annual report",
  // },
  // IAM: {
  //   activity: "halal",
  //   debtToMarketCapPct: 18.4,
  //   cashToMarketCapPct: 7.6,
  //   nonCompliantIncomePct: 1.2,
  //   asOfDate: "2025-12-31",
  //   source: "AAOIFI screening — 2025 annual report",
  // },
  // ------------------------------------------------------------------
};

export function getShariaRatios(ticker: string): ShariaRatios {
  return ratios[ticker.toUpperCase().trim()] ?? EMPTY_RATIOS;
}

/* ------------------------------------------------------------------
 * Limits / verdicts
 * ------------------------------------------------------------------ */

export const RATIO_LIMITS = {
  debtToMarketCapPct: 30,
  cashToMarketCapPct: 30,
  nonCompliantIncomePct: 5,
} as const;

export type RowVerdict = "pass" | "fail" | "pending";

export interface RatioRow {
  key: "activity" | "debt" | "cash" | "nonCompliant";
  filter: string;
  formula: string;
  limit: string;
  /** Display string for the company's value, or null if pending. */
  value: string | null;
  /** Numeric value if available, used for chart breakdowns. */
  valuePct: number | null;
  verdict: RowVerdict;
}

export function buildRatioRows(r: ShariaRatios): RatioRow[] {
  const rows: RatioRow[] = [];

  // Activity (qualitative)
  rows.push({
    key: "activity",
    filter: "Activity",
    formula: "Qualitative",
    limit: "Halal only",
    value:
      r.activity === null
        ? null
        : r.activity === "halal"
          ? "Halal"
          : r.activity === "mixed"
            ? "Mixed"
            : "Haram",
    valuePct: null,
    verdict:
      r.activity === null
        ? "pending"
        : r.activity === "halal"
          ? "pass"
          : "fail",
  });

  // Debt
  rows.push({
    key: "debt",
    filter: "Debt",
    formula: "Debt / Market cap",
    limit: "≤ 30%",
    value:
      r.debtToMarketCapPct === null
        ? null
        : `${r.debtToMarketCapPct.toFixed(1)}%`,
    valuePct: r.debtToMarketCapPct,
    verdict:
      r.debtToMarketCapPct === null
        ? "pending"
        : r.debtToMarketCapPct <= RATIO_LIMITS.debtToMarketCapPct
          ? "pass"
          : "fail",
  });

  // Cash
  rows.push({
    key: "cash",
    filter: "Cash",
    formula: "Cash / Market cap",
    limit: "≤ 30%",
    value:
      r.cashToMarketCapPct === null
        ? null
        : `${r.cashToMarketCapPct.toFixed(1)}%`,
    valuePct: r.cashToMarketCapPct,
    verdict:
      r.cashToMarketCapPct === null
        ? "pending"
        : r.cashToMarketCapPct <= RATIO_LIMITS.cashToMarketCapPct
          ? "pass"
          : "fail",
  });

  // Non-compliant income
  rows.push({
    key: "nonCompliant",
    filter: "Non-compliant revenue",
    formula: "Non-compliant income / Total revenue",
    limit: "≤ 5%",
    value:
      r.nonCompliantIncomePct === null
        ? null
        : `${r.nonCompliantIncomePct.toFixed(1)}%`,
    valuePct: r.nonCompliantIncomePct,
    verdict:
      r.nonCompliantIncomePct === null
        ? "pending"
        : r.nonCompliantIncomePct <= RATIO_LIMITS.nonCompliantIncomePct
          ? "pass"
          : "fail",
  });

  return rows;
}
