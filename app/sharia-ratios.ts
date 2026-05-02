import {
  companyScreeningData,
  type ActivityClassification,
  type ScreeningRatioStatus,
} from "./screening-data";

/**
 * Per-company AAOIFI screening ratios.
 *
 * AAOIFI / academic Sharia screening uses four filters:
 *
 *   | Filter        | Formula                                          | Limit      |
 *   | ------------- | ------------------------------------------------ | ---------- |
 *   | Activity      | Qualitative                                      | Sharia-compliant only |
 *   | Debt          | Interest-bearing debt / Market cap              | <= 30%     |
 *   | Cash          | Cash + interest-bearing securities / Market cap | <= 30%     |
 *   | Non-compliant | Non-compliant revenue / Total revenue           | <= 5%      |
 */

export type ActivityVerdict = "compliant" | "mixed" | "not_compliant";

export interface ShariaRatios {
  activity: ActivityVerdict | null;
  /** Interest-bearing debt / Market cap, in % (e.g. 27.4 for 27.4%) */
  debtToMarketCapPct: number | null;
  debtStatus: ScreeningRatioStatus | null;
  /** Cash + interest-bearing securities / Market cap, in % */
  cashToMarketCapPct: number | null;
  cashStatus: ScreeningRatioStatus | null;
  /** Non-Sharia-compliant revenue / Total revenue, in % */
  nonCompliantIncomePct: number | null;
  nonCompliantIncomeStatus: ScreeningRatioStatus | null;
  /** Reporting date used for the ratios above (ISO YYYY-MM-DD). */
  asOfDate: string | null;
  /** Free-form source/citation for the data set. */
  source: string | null;
}

export const EMPTY_RATIOS: ShariaRatios = {
  activity: null,
  debtToMarketCapPct: null,
  debtStatus: null,
  cashToMarketCapPct: null,
  cashStatus: null,
  nonCompliantIncomePct: null,
  nonCompliantIncomeStatus: null,
  asOfDate: null,
  source: null,
};

function toPct(value: number | null): number | null {
  return value === null ? null : value * 100;
}

function toActivityVerdict(
  classification: ActivityClassification | null
): ActivityVerdict | null {
  if (classification === "Compliant") return "compliant";
  if (classification === "Mixed") return "mixed";
  if (classification === "Not compliant") return "not_compliant";
  return null;
}

export const ratios: Record<string, ShariaRatios> = Object.fromEntries(
  Object.values(companyScreeningData).map((company) => [
    company.ticker,
    {
      activity: toActivityVerdict(company.aaoifi.activityClassification),
      debtToMarketCapPct: toPct(company.aaoifi.debtRatio),
      debtStatus: company.aaoifi.debtStatus,
      cashToMarketCapPct: toPct(company.aaoifi.depositsRatio),
      cashStatus: company.aaoifi.depositsStatus,
      nonCompliantIncomePct: toPct(company.aaoifi.nonCompliantRevenueRatio),
      nonCompliantIncomeStatus: company.aaoifi.revenueStatus,
      asOfDate: null,
      source: "EinveX AAOIFI 80-company screening dataset",
    },
  ])
);

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

export type RowVerdict = "pass" | "fail" | "pending" | "not_applicable";

export interface RatioRow {
  key: "activity" | "debt" | "cash" | "nonCompliant";
  filter: string;
  formula: string;
  limit: string;
  /** Display string for the company's value, or null if not applicable. */
  value: string | null;
  /** Numeric value if available, used for chart breakdowns. */
  valuePct: number | null;
  verdict: RowVerdict;
  statusLabel?: string;
}

function formatRatioValue(
  value: number | null,
  status: ScreeningRatioStatus | null
): string | null {
  if (value !== null) return `${value.toFixed(1)}%`;
  if (status === "N/A" || status === "SUSPENDED") return "N/A";
  return null;
}

function getRatioVerdict(
  value: number | null,
  status: ScreeningRatioStatus | null,
  limit: number
): RowVerdict {
  if (status === "PASS") return "pass";
  if (status === "FAIL") return "fail";
  if (status === "N/A" || status === "SUSPENDED") return "not_applicable";
  if (value === null) return "not_applicable";
  return value <= limit ? "pass" : "fail";
}

function getRatioStatusLabel(status: ScreeningRatioStatus | null) {
  if (status === "N/A") return "N/A";
  if (status === "SUSPENDED") return "Suspended";
  return undefined;
}

export function buildRatioRows(r: ShariaRatios): RatioRow[] {
  return [
    {
      key: "activity",
      filter: "Activity",
      formula: "Qualitative",
      limit: "Sharia-compliant only",
      value:
        r.activity === null
          ? null
          : r.activity === "not_compliant"
            ? "Not Sharia-compliant"
            : "Sharia-compliant",
      valuePct: null,
      verdict:
        r.activity === null
          ? "pending"
          : r.activity === "not_compliant"
            ? "fail"
            : "pass",
    },
    {
      key: "debt",
      filter: "Debt",
      formula: "Debt / Market cap",
      limit: "<= 30%",
      value: formatRatioValue(r.debtToMarketCapPct, r.debtStatus),
      valuePct: r.debtToMarketCapPct,
      verdict: getRatioVerdict(
        r.debtToMarketCapPct,
        r.debtStatus,
        RATIO_LIMITS.debtToMarketCapPct
      ),
      statusLabel: getRatioStatusLabel(r.debtStatus),
    },
    {
      key: "cash",
      filter: "Cash",
      formula: "Cash / Market cap",
      limit: "<= 30%",
      value: formatRatioValue(r.cashToMarketCapPct, r.cashStatus),
      valuePct: r.cashToMarketCapPct,
      verdict: getRatioVerdict(
        r.cashToMarketCapPct,
        r.cashStatus,
        RATIO_LIMITS.cashToMarketCapPct
      ),
      statusLabel: getRatioStatusLabel(r.cashStatus),
    },
    {
      key: "nonCompliant",
      filter: "Non-compliant revenue",
      formula: "Non-compliant income / Total revenue",
      limit: "<= 5%",
      value: formatRatioValue(
        r.nonCompliantIncomePct,
        r.nonCompliantIncomeStatus
      ),
      valuePct: r.nonCompliantIncomePct,
      verdict: getRatioVerdict(
        r.nonCompliantIncomePct,
        r.nonCompliantIncomeStatus,
        RATIO_LIMITS.nonCompliantIncomePct
      ),
      statusLabel: getRatioStatusLabel(r.nonCompliantIncomeStatus),
    },
  ];
}
