"use client";

import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import Sparkline from "../components/sparkline";
import {
  formatMad,
  formatNumber,
  formatPct,
  getQuote,
  marketQuotes,
  type MarketQuote,
} from "../market-data";
import { companyScreeningData, getStatusStyle } from "../screening-data";
import { EquityCurve, SectorDonut, ShariaDonut } from "./portfolio-charts";
import {
  FIXED_BROKER_COMMISSION_RATE,
  FIXED_TAX_RATE,
  usePortfolio,
  type Holding,
  type Trade,
} from "./portfolio-store";

type QuoteFeedResponse = {
  quotes?: MarketQuote[];
};

type QuoteLookup = Map<string, MarketQuote>;

function mergeQuoteFallbacks(liveQuotes: MarketQuote[]): MarketQuote[] {
  const liveByTicker = new Map(
    liveQuotes.map((quote) => [quote.ticker.toUpperCase(), quote])
  );

  return marketQuotes.map((fallback) => {
    const live = liveByTicker.get(fallback.ticker);
    return live ? { ...fallback, ...live } : fallback;
  });
}

export default function PortfolioClient() {
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();
  const prefillTicker = searchParams.get("add") ?? "";

  const {
    state,
    hydrated,
    buy,
    sell,
    recordDividend,
    withdrawPot,
    deleteTrade,
    deleteDividend,
    reset,
  } = usePortfolio();

  const [nisab, setNisab] = useState<number>(25000);
  const [zakatRate, setZakatRate] = useState<number>(2.5);
  const [quotes, setQuotes] = useState<MarketQuote[]>(marketQuotes);
  const highlightEntryGuide = prefillTicker.trim().length > 0;

  useEffect(() => {
    let disposed = false;

    async function loadQuotes() {
      try {
        const res = await fetch("/api/quotes", { cache: "no-store" });
        if (!res.ok) return;
        const feed = (await res.json()) as QuoteFeedResponse;
        if (!disposed && Array.isArray(feed.quotes) && feed.quotes.length > 0) {
          setQuotes(mergeQuoteFallbacks(feed.quotes));
        }
      } catch {
        // Keep the static fallback already rendered.
      }
    }

    loadQuotes();
    const interval = window.setInterval(loadQuotes, 15 * 60 * 1000);
    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || window.location.hash !== "#position-entry") return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("position-entry")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hydrated]);

  const quotesByTicker = useMemo(
    () => new Map(quotes.map((quote) => [quote.ticker, quote])),
    [quotes]
  );

  const metrics = useMemo(() => {
    const lotsByTicker = new Map<string, PurchaseLot[]>();
    for (const trade of [...state.trades].reverse()) {
      if (trade.type !== "buy" || trade.shares <= 0) continue;
      const ticker = trade.ticker.toUpperCase();
      const totalInvested = trade.netAmount ?? trade.shares * trade.price;
      const lot: PurchaseLot = {
        id: trade.id,
        date: trade.date,
        shares: trade.shares,
        buyPrice: trade.price,
        buyCost: trade.shares > 0 ? totalInvested / trade.shares : trade.price,
        brokerFee: trade.commissionAmount ?? 0,
        totalInvested,
      };
      lotsByTicker.set(ticker, [...(lotsByTicker.get(ticker) ?? []), lot]);
    }

    const enriched = state.holdings.map((h) => {
      const quote = quotesByTicker.get(h.ticker) ?? getQuote(h.ticker);
      const livePrice = quote?.price ?? h.avgPrice;
      const purchasePriceInclCommission = h.avgPrice;
      const grossCurrentValue = h.shares * livePrice;
      const estimatedSellCommission =
        grossCurrentValue * FIXED_BROKER_COMMISSION_RATE;
      const estimatedNetSellBeforeTax =
        grossCurrentValue - estimatedSellCommission;
      const costBasis = h.shares * h.avgPrice;
      const estimatedGrossProfit = estimatedNetSellBeforeTax - costBasis;
      const estimatedTax = Math.max(estimatedGrossProfit, 0) * FIXED_TAX_RATE;
      const totalNet = estimatedNetSellBeforeTax - estimatedTax;
      const unrealizedPL = totalNet - costBasis;
      const unrealizedPLPercent =
        costBasis > 0 ? (unrealizedPL / costBasis) * 100 : 0;
      const sharia =
        quote?.shariaStatus ??
        (companyScreeningData[h.ticker]
          ? companyScreeningData[h.ticker].aaoifi.status === "sharia_compliant"
            ? "Sharia-compliant"
            : companyScreeningData[h.ticker].aaoifi.status ===
              "not_sharia_compliant"
            ? "Not Sharia-compliant"
            : "Under review"
          : "Under review");
      const sector = quote?.sector ?? companyScreeningData[h.ticker]?.sector ?? "Other";
      return {
        h,
        quote,
        livePrice,
        purchasePriceInclCommission,
        grossCurrentValue,
        estimatedSellCommission,
        estimatedNetSellBeforeTax,
        costBasis,
        estimatedGrossProfit,
        estimatedTax,
        totalNet,
        unrealizedPL,
        unrealizedPLPercent,
        sharia,
        sector,
        lots: lotsByTicker.get(h.ticker) ?? [],
      };
    });

    const holdingsValue = enriched.reduce((sum, x) => sum + x.totalNet, 0);
    const costBasis = enriched.reduce((sum, x) => sum + x.costBasis, 0);
    const unrealized = holdingsValue - costBasis;
    const totalValue = holdingsValue + state.reinvestmentPot;
    const invested = state.externalCashInvested;
    const gainLoss = totalValue - invested;
    const growthPct = invested > 0 ? (gainLoss / invested) * 100 : 0;
    const realizedPL = state.trades.reduce(
      (sum, trade) => sum + (trade.type === "sell" ? trade.realizedPL ?? 0 : 0),
      0
    );

    const compliantValue = enriched
      .filter((x) => x.sharia === "Sharia-compliant")
      .reduce((sum, x) => sum + x.totalNet, 0);
    const nonCompliantValue = enriched
      .filter((x) => x.sharia === "Not Sharia-compliant")
      .reduce((sum, x) => sum + x.totalNet, 0);
    const underReviewValue = enriched
      .filter((x) => x.sharia === "Under review")
      .reduce((sum, x) => sum + x.totalNet, 0);

    const totalPurified = state.dividends.reduce((s, d) => s + d.purifiedAmount, 0);
    const totalDividends = state.dividends.reduce((s, d) => s + d.amount, 0);

    const zakatable = compliantValue + state.reinvestmentPot;
    const zakatDue = zakatable >= nisab ? zakatable * (zakatRate / 100) : 0;

    // Sector allocation
    const bySector = new Map<string, number>();
    for (const x of enriched) {
      bySector.set(x.sector, (bySector.get(x.sector) ?? 0) + x.totalNet);
    }
    const sectorData = Array.from(bySector.entries())
      .map(([sector, value]) => ({ sector, value }))
      .sort((a, b) => b.value - a.value);

    return {
      enriched,
      holdingsValue,
      costBasis,
      unrealized,
      totalValue,
      invested,
      gainLoss,
      growthPct,
      realizedPL,
      compliantValue,
      nonCompliantValue,
      underReviewValue,
      totalPurified,
      totalDividends,
      zakatable,
      zakatDue,
      sectorData,
    };
  }, [state, nisab, zakatRate, quotesByTicker]);

  if (!hydrated) {
    return <div className="surface-card">Loading your portfolio…</div>;
  }

  const hasHoldings = state.holdings.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <style>{`
        @keyframes entryGuideGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(245,158,11,0.30); }
          35% { box-shadow: 0 0 0 3px rgba(245,158,11,0.28), 0 0 26px rgba(245,158,11,0.16); }
        }
        #position-entry:target .entry-guidance-card,
        .entry-guidance-card.entry-guidance-highlight {
          animation: entryGuideGlow 1.8s ease-out 1;
        }
      `}</style>
      {/* Top dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total portfolio value"
          value={formatMad(metrics.totalValue)}
          sub={`${formatMad(metrics.holdingsValue)} in stocks`}
          tone="up"
        />
        <MetricCard
          label="External cash invested"
          value={formatMad(metrics.invested)}
          sub="Money you brought in from outside"
          tone="neutral"
        />
        <MetricCard
          label="Total growth"
          value={formatPct(metrics.growthPct)}
          sub={`${metrics.gainLoss >= 0 ? "+" : ""}${formatMad(metrics.gainLoss)}`}
          tone={metrics.gainLoss >= 0 ? "up" : "down"}
        />
        <MetricCard
          label="Reinvestment pot"
          value={formatMad(state.reinvestmentPot)}
          sub="Cash from sells, ready to redeploy"
          tone="warn"
        />
      </div>

      {/* Portfolio insight */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.65fr_1fr]">
        <div className="surface-card">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="section-label">Portfolio value</p>
            <p
              className="text-[11px]"
              style={{ color: "var(--text-mute)" }}
            >
              Net value replayed from your trade log and current holdings
            </p>
          </div>
          <div className="mt-4">
            <EquityCurve
              trades={state.trades}
              reinvestmentPot={state.reinvestmentPot}
              currentNetValue={metrics.totalValue}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="surface-card">
            <p className="section-label">Invested vs current value</p>
            <InvestedCurrentComparison
              invested={metrics.invested}
              current={metrics.totalValue}
            />
          </div>
          <PerformanceSummary metrics={metrics} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="surface-card">
          <p className="section-label">Allocation by Sharia status</p>
          <div className="mt-4">
            <ShariaDonut
              compliant={metrics.compliantValue}
              notCompliant={metrics.nonCompliantValue}
              underReview={metrics.underReviewValue}
            />
          </div>
        </div>

        <div className="surface-card">
          <p className="section-label">Allocation by sector</p>
          <div className="mt-4">
            <SectorDonut data={metrics.sectorData} />
          </div>
        </div>

        <ReinvestmentPot pot={state.reinvestmentPot} onWithdraw={withdrawPot} />
      </div>

      {/* Transaction entry forms */}
      <div
        id="position-entry"
        className="scroll-mt-24"
      >
        <div
          className={
            "entry-guidance-card mb-4 rounded-lg border px-4 py-3 " +
            (highlightEntryGuide ? "entry-guidance-highlight" : "")
          }
          style={{
            borderColor: "rgba(245,158,11,0.34)",
            background:
              "linear-gradient(180deg, rgba(245,158,11,0.10), rgba(245,158,11,0.05))",
          }}
        >
          <p
            className="text-[12.5px] leading-6"
            style={{ color: "#fcd34d" }}
          >
            Use this section to record trades you made outside EinveX. EinveX
            does not execute trades.
          </p>
          <ol
            className="mt-2 grid gap-1 text-[12px] leading-5 sm:grid-cols-3"
            style={{ color: "var(--text-dim)" }}
          >
            <li>1. Select the stock you already bought or sold.</li>
            <li>2. Enter the quantity and price from your broker.</li>
            <li>3. Save it to track your portfolio performance.</li>
          </ol>
        </div>
        <div
          className="mb-4 rounded-lg border px-4 py-3"
          style={{
            borderColor: "rgba(34,197,94,0.22)",
            background: "rgba(34,197,94,0.06)",
          }}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className="text-[13px] font-semibold"
                style={{ color: "var(--text)" }}
              >
                Broker commission included
              </p>
              <p
                className="mt-1 text-[12.5px] leading-6"
                style={{ color: "var(--text-dim)" }}
              >
                EinveX automatically includes broker commission and applicable
                tax treatment in portfolio calculations, so your performance
                reflects net values rather than only gross trade prices.
              </p>
            </div>
            <div
              className="grid min-w-[220px] grid-cols-1 gap-2 text-[11.5px] sm:grid-cols-2 lg:grid-cols-1"
              style={{ color: "var(--text-dim)" }}
            >
              <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                <span>Broker commission</span>
                <span className="chip chip-up">Included</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                <span>Tax handling</span>
                <span className="chip chip-neutral">Positive gains</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BuyForm
          locked={!isSignedIn}
          prefillTicker={prefillTicker}
          reinvestmentPot={state.reinvestmentPot}
          quotes={quotes}
          quotesByTicker={quotesByTicker}
          onSubmit={buy}
        />
        <SellForm
          locked={!isSignedIn}
          holdings={state.holdings}
          quotesByTicker={quotesByTicker}
          onSubmit={sell}
        />
        <DividendForm locked={!isSignedIn} holdings={state.holdings} onSubmit={recordDividend} />
        </div>
        {!isSignedIn && <UnlockPortfolioCta />}
      </div>

      {/* Holdings */}
      <HoldingsTable enriched={metrics.enriched} hasHoldings={hasHoldings} />

      {/* Sharia: purification + zakat */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PurificationCard
          totalDividends={metrics.totalDividends}
          totalPurified={metrics.totalPurified}
          dividends={state.dividends}
          onDelete={deleteDividend}
        />
        <ZakatCard
          compliantValue={metrics.compliantValue}
          nonCompliantValue={metrics.nonCompliantValue}
          reinvestmentPot={state.reinvestmentPot}
          zakatable={metrics.zakatable}
          zakatDue={metrics.zakatDue}
          nisab={nisab}
          zakatRate={zakatRate}
          onNisabChange={setNisab}
          onRateChange={setZakatRate}
        />
      </div>

      {/* Trade history */}
      <TradeHistory trades={state.trades} onDelete={deleteTrade} />

      {/* Danger zone */}
      <div
        className="surface-subtle flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "rgba(239,68,68,0.15)" }}
      >
        <p className="text-[12px]" style={{ color: "var(--text-dim)" }}>
          Data is stored only in this browser. Clearing storage will erase it.
        </p>
        <button
          type="button"
          className="rounded-md border px-3 py-1.5 text-[11.5px] font-semibold transition"
          style={{
            borderColor: "rgba(239,68,68,0.30)",
            color: "#fca5a5",
            background: "rgba(239,68,68,0.06)",
          }}
          onClick={() => {
            if (confirm("Erase all portfolio data? This cannot be undone.")) reset();
          }}
        >
          Reset portfolio
        </button>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function MetricCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone: "up" | "down" | "neutral" | "warn";
}) {
  const valueColor =
    tone === "up"
      ? "#4ade80"
      : tone === "down"
      ? "#f87171"
      : tone === "warn"
      ? "#fcd34d"
      : "var(--text)";
  return (
    <div className="surface-card">
      <p className="section-label">{label}</p>
      <p
        className="mt-2 num text-2xl font-semibold tracking-tight"
        style={{ color: valueColor }}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[11.5px]" style={{ color: "var(--text-mute)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function InvestedCurrentComparison({
  invested,
  current,
}: {
  invested: number;
  current: number;
}) {
  const max = Math.max(invested, current, 1);
  const rows = [
    { label: "Total invested", value: invested, color: "#9ba3ad" },
    { label: "Current net value", value: current, color: "#22c55e" },
  ];

  return (
    <div className="mt-4 flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-center justify-between gap-3 text-[12px]">
            <span style={{ color: "var(--text-dim)" }}>{row.label}</span>
            <span className="num font-semibold" style={{ color: row.color }}>
              {formatMad(row.value)}
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(2, (row.value / max) * 100)}%`,
                background: row.color,
              }}
            />
          </div>
        </div>
      ))}
      <p className="text-[11px] leading-5" style={{ color: "var(--text-mute)" }}>
        Current value uses net holding value plus cash in the reinvestment pot.
      </p>
    </div>
  );
}

function PerformanceSummary({
  metrics,
}: {
  metrics: {
    invested: number;
    totalValue: number;
    gainLoss: number;
    growthPct: number;
    realizedPL: number;
    unrealized: number;
  };
}) {
  const rows = [
    { label: "Total invested", value: formatMad(metrics.invested), tone: "neutral" },
    { label: "Current net value", value: formatMad(metrics.totalValue), tone: "up" },
    { label: "Net gain/loss", value: formatMad(metrics.gainLoss), raw: metrics.gainLoss },
    { label: "Net return %", value: formatPct(metrics.growthPct), raw: metrics.growthPct },
    { label: "Realized P/L", value: formatMad(metrics.realizedPL), raw: metrics.realizedPL },
    { label: "Unrealized P/L", value: formatMad(metrics.unrealized), raw: metrics.unrealized },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {rows.map((row) => {
        const tone =
          row.raw === undefined
            ? row.tone
            : row.raw > 0
              ? "up"
              : row.raw < 0
                ? "down"
                : "neutral";
        const color =
          tone === "up"
            ? "#4ade80"
            : tone === "down"
              ? "#f87171"
              : "var(--text)";
        return (
          <div
            key={row.label}
            className="rounded-lg border px-3 py-3"
            style={{
              borderColor: "var(--line)",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <p className="section-label">{row.label}</p>
            <p className="mt-2 num text-[15px] font-semibold" style={{ color }}>
              {row.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

type PurchaseLot = {
  id: string;
  date: string;
  shares: number;
  buyPrice: number;
  buyCost: number;
  brokerFee: number;
  totalInvested: number;
};

type EnrichedHolding = {
  h: Holding;
  quote?: MarketQuote;
  livePrice: number;
  purchasePriceInclCommission: number;
  grossCurrentValue: number;
  estimatedSellCommission: number;
  estimatedNetSellBeforeTax: number;
  costBasis: number;
  estimatedGrossProfit: number;
  estimatedTax: number;
  totalNet: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  sharia: string;
  sector: string;
  lots: PurchaseLot[];
};

function HoldingsTable({
  enriched,
  hasHoldings,
}: {
  enriched: EnrichedHolding[];
  hasHoldings: boolean;
}) {
  const [expandedTickers, setExpandedTickers] = useState<Record<string, boolean>>({});

  if (!hasHoldings) {
    return (
      <div className="surface-card text-center">
        <p className="text-[13px]" style={{ color: "var(--text-dim)" }}>
          No positions yet. Use the <strong style={{ color: "#a7f3d0" }}>purchase</strong> form above
          or browse the{" "}
          <Link
            href="/marche"
            style={{ color: "#6ee7a7", textDecoration: "underline" }}
          >
            Market
          </Link>{" "}
          to add your first stock.
        </p>
      </div>
    );
  }
  return (
    <div className="surface-card overflow-x-auto p-0">
      <table className="data-table min-w-full">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Shares</th>
            <HoldingsHeader align="right" label="Buy cost" sub="incl. broker fee" />
            <th className="text-right">Live price</th>
            <th className="text-right">Trend</th>
            <HoldingsHeader align="right" label="Net value" sub="after sell fee & tax" />
            <HoldingsHeader align="right" label="Net P/L" sub="after sell fee & tax" />
            <th>Sharia</th>
          </tr>
        </thead>
        <tbody>
          {enriched.map((row) => {
            const hasMultipleLots = row.lots.length > 1;
            const isExpanded = !!expandedTickers[row.h.ticker];
            const cls =
              row.unrealizedPL > 0
                ? "num-up"
                : row.unrealizedPL < 0
                ? "num-down"
                : "num-flat";
            const pillCls =
              row.sharia === "Sharia-compliant"
                ? "pill-compliant"
                : row.sharia === "Not Sharia-compliant"
                ? "pill-not-compliant"
                : "pill-review";
            return (
              <Fragment key={row.h.ticker}>
                <tr>
                  <td>
                    <div className="flex items-start gap-2">
                      {hasMultipleLots ? (
                        <button
                          type="button"
                          aria-label={
                            isExpanded
                              ? `Hide ${row.h.ticker} purchase lots`
                              : `Show ${row.h.ticker} purchase lots`
                          }
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedTickers((current) => ({
                              ...current,
                              [row.h.ticker]: !current[row.h.ticker],
                            }))
                          }
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[12px] font-semibold"
                          style={{
                            borderColor: "var(--line-strong)",
                            color: "#6ee7a7",
                            background: "var(--bg-elev)",
                          }}
                        >
                          {isExpanded ? "-" : "+"}
                        </button>
                      ) : (
                        <span className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/marche/${row.h.ticker}`}
                          className="ticker-cell hover:underline"
                          style={{ textDecoration: "none" }}
                        >
                          {row.h.ticker}
                        </Link>
                        <div
                          className="truncate text-[11.5px]"
                          style={{ color: "var(--text-mute)" }}
                        >
                          {row.quote?.name ?? ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="num text-[13px]">
                    {formatNumber(row.h.shares, 4)}
                  </td>
                  <td
                    className="text-right num text-[13px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {formatMadFixed(row.purchasePriceInclCommission)}
                  </td>
                  <td className="text-right num text-[13px]">
                    {formatMadFixed(row.livePrice)}
                  </td>
                  <td className="text-right">
                    <Sparkline ticker={row.h.ticker} width={64} height={20} days={60} />
                  </td>
                  <td className="text-right num text-[13px]">
                    {formatMadFixed(row.totalNet)}
                  </td>
                  <td className={`text-right num text-[13px] ${cls}`}>
                    {formatMadFixed(row.unrealizedPL)}{" "}
                    <span className="text-[11px]">
                      ({formatPct(row.unrealizedPLPercent)})
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        "inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-medium " +
                        pillCls +
                        " " +
                        getStatusStyle(
                          row.sharia as
                            | "Sharia-compliant"
                            | "Not Sharia-compliant"
                            | "Under review"
                        )
                      }
                    >
                      {row.sharia}
                    </span>
                  </td>
                </tr>
                {hasMultipleLots && isExpanded && (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <PurchaseLotsTable lots={row.lots} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function HoldingsHeader({
  label,
  sub,
  align = "left",
}: {
  label: string;
  sub?: string;
  align?: "left" | "right";
}) {
  return (
    <th className={align === "right" ? "text-right" : undefined}>
      <span className="block">{label}</span>
      {sub && (
        <span
          className="mt-0.5 block text-[9.5px] font-medium leading-tight"
          style={{
            color: "var(--text-mute)",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          {sub}
        </span>
      )}
    </th>
  );
}

function PurchaseLotsTable({ lots }: { lots: PurchaseLot[] }) {
  return (
    <div
      className="border-t px-4 py-3"
      style={{
        borderColor: "var(--line)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr style={{ color: "var(--text-mute)" }}>
              <th className="px-2 py-1.5 font-semibold uppercase tracking-[0.12em]">Buy date</th>
              <th className="px-2 py-1.5 text-right font-semibold uppercase tracking-[0.12em]">Shares bought</th>
              <th className="px-2 py-1.5 text-right font-semibold uppercase tracking-[0.12em]">Buy price</th>
              <th className="px-2 py-1.5 text-right font-semibold uppercase tracking-[0.12em]">Buy cost</th>
              <th className="px-2 py-1.5 text-right font-semibold uppercase tracking-[0.12em]">Broker fee</th>
              <th className="px-2 py-1.5 text-right font-semibold uppercase tracking-[0.12em]">Total invested</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td className="px-2 py-2 num" style={{ color: "var(--text-dim)" }}>
                  {lot.date}
                </td>
                <td className="px-2 py-2 text-right num">
                  {formatNumber(lot.shares, 4)}
                </td>
                <td className="px-2 py-2 text-right num">
                  {formatMadFixed(lot.buyPrice)}
                </td>
                <td className="px-2 py-2 text-right num">
                  {formatMadFixed(lot.buyCost)}
                </td>
                <td className="px-2 py-2 text-right num" style={{ color: "var(--text-dim)" }}>
                  {formatMadFixed(lot.brokerFee)}
                </td>
                <td className="px-2 py-2 text-right num">
                  {formatMadFixed(lot.totalInvested)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] leading-5" style={{ color: "var(--text-mute)" }}>
        Lot details show recorded purchase entries. Sold quantities are
        reflected in the aggregated position.
      </p>
    </div>
  );
}

function formatMadFixed(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function UnlockPortfolioCta() {
  return (
    <div
      className="mt-4 rounded-lg border px-4 py-3"
      style={{
        borderColor: "rgba(34,197,94,0.26)",
        background: "rgba(34,197,94,0.07)",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px]" style={{ color: "var(--text-dim)" }}>
          Create a free account to unlock full access.
        </p>
        <SignUpButton mode="redirect" forceRedirectUrl="/portfolio">
          <button type="button" className="btn-primary">
            Create free account
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}

function BuyForm({
  locked,
  prefillTicker,
  reinvestmentPot,
  quotes,
  quotesByTicker,
  onSubmit,
}: {
  locked: boolean;
  prefillTicker: string;
  reinvestmentPot: number;
  quotes: MarketQuote[];
  quotesByTicker: QuoteLookup;
  onSubmit: (x: {
    ticker: string;
    shares: number;
    price: number;
    date?: string;
    useReinvestmentPot?: boolean;
    note?: string;
  }) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [ticker, setTicker] = useState(prefillTicker);
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState(() => {
    const q = prefillTicker
      ? quotesByTicker.get(prefillTicker.toUpperCase()) ?? getQuote(prefillTicker)
      : null;
    return q ? String(q.price) : "";
  });
  const [date, setDate] = useState(today);
  const [usePot, setUsePot] = useState(false);
  const [note, setNote] = useState("");

  function onTickerChange(value: string) {
    const upper = value.toUpperCase();
    setTicker(upper);
    const q = quotesByTicker.get(upper) ?? getQuote(upper);
    if (q) setPrice(String(q.price));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    const s = Number(shares);
    const p = Number(price);
    if (
      !ticker ||
      !Number.isFinite(s) ||
      s <= 0 ||
      !Number.isFinite(p) ||
      p <= 0
    ) return;
    onSubmit({
      ticker,
      shares: s,
      price: p,
      date,
      useReinvestmentPot: usePot,
      note: note.trim() || undefined,
    });
    setShares("");
    setNote("");
    setDate(today);
  }

  return (
    <form className="surface-card flex flex-col gap-3" onSubmit={submit}>
      <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
        Record a purchase
      </h3>

      <TickerSelect
        value={ticker}
        onChange={onTickerChange}
        idSuffix="buy"
        quotes={quotes}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="buy-shares">Shares</label>
          <input
            id="buy-shares"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="buy-price">Price (MAD)</label>
          <input
            id="buy-price"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="field-label" htmlFor="buy-date">Date</label>
          <input
            id="buy-date"
            className="field-control num"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <label
        className="flex items-start gap-2 text-[12px]"
        style={{ color: "var(--text-dim)" }}
      >
        <input
          type="checkbox"
          className="mt-0.5"
          checked={usePot}
          onChange={(e) => setUsePot(e.target.checked)}
        />
        <span>
          Fund this buy from my Reinvestment Pot first
          <span className="block text-[11px]" style={{ color: "var(--text-mute)" }}>
            ({formatMad(reinvestmentPot)} available)
          </span>
        </span>
      </label>

      <input
        className="field-control"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" className="btn-primary" disabled={locked}>
        Add purchase
      </button>
    </form>
  );
}

function SellForm({
  locked,
  holdings,
  quotesByTicker,
  onSubmit,
}: {
  locked: boolean;
  holdings: Holding[];
  quotesByTicker: QuoteLookup;
  onSubmit: (x: {
    ticker: string;
    shares: number;
    price: number;
    date?: string;
    note?: string;
  }) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(today);

  function onTickerChange(value: string) {
    setTicker(value);
    const q = quotesByTicker.get(value) ?? getQuote(value);
    if (q) setPrice(String(q.price));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    const s = Number(shares);
    const p = Number(price);
    if (
      !ticker ||
      !Number.isFinite(s) ||
      s <= 0 ||
      !Number.isFinite(p) ||
      p <= 0
    ) return;
    onSubmit({
      ticker,
      shares: s,
      price: p,
      date,
    });
    setShares("");
    setDate(today);
  }

  return (
    <form className="surface-card flex flex-col gap-3" onSubmit={submit}>
      <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
        Record a sale
      </h3>

      <div>
        <label className="field-label" htmlFor="sell-ticker">Ticker</label>
        <select
          id="sell-ticker"
          className="field-control"
          value={ticker}
          onChange={(e) => onTickerChange(e.target.value)}
          required
        >
          <option value="">Select a position…</option>
          {holdings.map((h) => (
            <option key={h.ticker} value={h.ticker}>
              {h.ticker} — {formatNumber(h.shares, 4)} shares
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="sell-shares">Shares</label>
          <input
            id="sell-shares"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="sell-price">Price (MAD)</label>
          <input
            id="sell-price"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="field-label" htmlFor="sell-date">Date</label>
          <input
            id="sell-date"
            className="field-control num"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <p className="text-[11.5px]" style={{ color: "var(--text-mute)" }}>
        Proceeds land in your Reinvestment Pot.
      </p>

      <button
        type="submit"
        disabled={locked || holdings.length === 0}
        className="btn-ghost"
      >
        Add sale
      </button>
    </form>
  );
}

function DividendForm({
  locked,
  holdings,
  onSubmit,
}: {
  locked: boolean;
  holdings: Holding[];
  onSubmit: (x: {
    ticker: string;
    amount: number;
    purifyPct: number;
    date?: string;
    note?: string;
  }) => void;
}) {
  const [ticker, setTicker] = useState("");
  const [amount, setAmount] = useState("");
  const [purifyPct, setPurifyPct] = useState("5");

  function onTickerChange(value: string) {
    setTicker(value);
    const company = companyScreeningData[value];
    if (company) {
      setPurifyPct(
        company.aaoifi.status === "not_sharia_compliant" ? "100" : "5"
      );
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    const a = Number(amount);
    const p = Number(purifyPct);
    if (!ticker || !Number.isFinite(a) || a <= 0 || !Number.isFinite(p) || p < 0) return;
    onSubmit({ ticker, amount: a, purifyPct: p });
    setAmount("");
  }

  return (
    <form className="surface-card flex flex-col gap-3" onSubmit={submit}>
      <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
        Log dividend
      </h3>

      <div>
        <label className="field-label" htmlFor="div-ticker">Ticker</label>
        <select
          id="div-ticker"
          className="field-control"
          value={ticker}
          onChange={(e) => onTickerChange(e.target.value)}
          required
        >
          <option value="">Select a position…</option>
          {holdings.map((h) => (
            <option key={h.ticker} value={h.ticker}>
              {h.ticker}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="div-amount">Amount (MAD)</label>
          <input
            id="div-amount"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="div-purify">Purify %</label>
          <input
            id="div-purify"
            className="field-control num"
            type="number"
            min="0"
            max="100"
            step="any"
            value={purifyPct}
            onChange={(e) => setPurifyPct(e.target.value)}
            required
          />
        </div>
      </div>

      <p className="text-[11.5px]" style={{ color: "var(--text-mute)" }}>
        Purified portion → charity. Rest → Reinvestment Pot.
      </p>

      <button
        type="submit"
        disabled={locked || holdings.length === 0}
        className="btn-primary"
      >
        Log dividend
      </button>
    </form>
  );
}

function TickerSelect({
  value,
  onChange,
  idSuffix,
  quotes,
}: {
  value: string;
  onChange: (value: string) => void;
  idSuffix: string;
  quotes: MarketQuote[];
}) {
  return (
    <div>
      <label className="field-label" htmlFor={`ticker-${idSuffix}`}>Ticker</label>
      <input
        id={`ticker-${idSuffix}`}
        className="field-control mono"
        list="tickers"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. ATW, IAM, CSR"
        required
      />
      <datalist id="tickers">
        {quotes.map((q) => (
          <option key={q.ticker} value={q.ticker}>
            {q.name}
          </option>
        ))}
      </datalist>
    </div>
  );
}

function ReinvestmentPot({
  pot,
  onWithdraw,
}: {
  pot: number;
  onWithdraw: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  return (
    <div className="surface-card flex flex-col gap-3">
      <p className="section-label">Reinvestment pot</p>
      <p
        className="num text-3xl font-semibold tracking-tight"
        style={{ color: "#fcd34d" }}
      >
        {formatMad(pot)}
      </p>
      <p className="text-[12.5px] leading-6" style={{ color: "var(--text-dim)" }}>
        Every recorded sale lands here. Tick <em>Fund from pot</em> in the
        purchase form to roll proceeds into a new position, or withdraw cash out of the
        portfolio entirely.
      </p>
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(amount);
          if (!Number.isFinite(n) || n <= 0) return;
          onWithdraw(n);
          setAmount("");
        }}
      >
        <div className="flex-1">
          <label className="field-label" htmlFor="pot-amount">Withdraw (MAD)</label>
          <input
            id="pot-amount"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-ghost">
          Withdraw
        </button>
      </form>
    </div>
  );
}

function ComingSoonNotice() {
  return (
    <div
      className="mt-3 rounded-lg border px-3 py-2"
      style={{
        borderColor: "rgba(245,158,11,0.28)",
        background: "rgba(245,158,11,0.08)",
      }}
    >
      <p className="text-[12px] font-semibold" style={{ color: "#fcd34d" }}>
        Coming soon
      </p>
      <p className="mt-1 text-[11.5px]" style={{ color: "var(--text-dim)" }}>
        This feature is being refined and will be available soon.
      </p>
    </div>
  );
}

function PurificationCard({
  totalDividends,
  totalPurified,
  dividends,
  onDelete,
}: {
  totalDividends: number;
  totalPurified: number;
  dividends: {
    id: string;
    date: string;
    ticker: string;
    amount: number;
    purifyPct: number;
    purifiedAmount: number;
  }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="surface-card">
      <p className="section-label">Sharia · Purification</p>
      <ComingSoonNotice />
      <div
        aria-disabled="true"
        style={{ opacity: 0.42, filter: "blur(1px)", pointerEvents: "none" }}
      >
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-mute)" }}>
            Total dividends received
          </p>
          <p className="num text-[18px] font-semibold mt-1">
            {formatMad(totalDividends)}
          </p>
        </div>
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-mute)" }}>
            To purify (donate)
          </p>
          <p
            className="num text-[18px] font-semibold mt-1"
            style={{ color: "#4ade80" }}
          >
            {formatMad(totalPurified)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11.5px] leading-6" style={{ color: "var(--text-mute)" }}>
        Default 5% for compliant companies, 100% for non-compliant. Adjust per entry.
      </p>

      {dividends.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Ticker</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Purify %</th>
                <th className="text-right">To donate</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dividends.map((d) => (
                <tr key={d.id}>
                  <td className="num text-[12px]" style={{ color: "var(--text-dim)" }}>
                    {d.date}
                  </td>
                  <td className="ticker-cell">{d.ticker}</td>
                  <td className="text-right num text-[12.5px]">{formatMad(d.amount)}</td>
                  <td className="text-right num text-[12px]" style={{ color: "var(--text-dim)" }}>
                    {d.purifyPct.toFixed(0)}%
                  </td>
                  <td className="text-right num text-[12.5px]" style={{ color: "#4ade80" }}>
                    {formatMad(d.purifiedAmount)}
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      disabled
                      className="text-[11px]"
                      style={{ color: "var(--text-mute)", cursor: "not-allowed" }}
                      onClick={() => onDelete(d.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

function ZakatCard({
  compliantValue,
  nonCompliantValue,
  reinvestmentPot,
  zakatable,
  zakatDue,
  nisab,
  zakatRate,
  onNisabChange,
  onRateChange,
}: {
  compliantValue: number;
  nonCompliantValue: number;
  reinvestmentPot: number;
  zakatable: number;
  zakatDue: number;
  nisab: number;
  zakatRate: number;
  onNisabChange: (n: number) => void;
  onRateChange: (n: number) => void;
}) {
  return (
    <div className="surface-card">
      <p className="section-label">Zakat</p>
      <ComingSoonNotice />

      <div
        aria-disabled="true"
        style={{ opacity: 0.42, filter: "blur(1px)", pointerEvents: "none" }}
      >
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-mute)" }}>
            Zakatable holdings
          </p>
          <p className="num text-[18px] font-semibold mt-1">
            {formatMad(zakatable)}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-mute)" }}>
            Compliant {formatMad(compliantValue)} + pot {formatMad(reinvestmentPot)}
          </p>
        </div>
        <div>
          <p className="text-[11px]" style={{ color: "var(--text-mute)" }}>
            Zakat due
          </p>
          <p
            className="num text-[18px] font-semibold mt-1"
            style={{ color: "#4ade80" }}
          >
            {formatMad(zakatDue)}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-mute)" }}>
            {zakatable >= nisab
              ? `Above nisab — ${zakatRate}% of zakatable`
              : "Below nisab — none due"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="nisab">Nisab (MAD)</label>
          <input
            id="nisab"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={nisab}
            disabled
            onChange={(e) => onNisabChange(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="zakat-rate">Rate (%)</label>
          <input
            id="zakat-rate"
            className="field-control num"
            type="number"
            min="0"
            step="any"
            value={zakatRate}
            disabled
            onChange={(e) => onRateChange(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      {nonCompliantValue > 0 && (
        <p
          className="mt-3 rounded-lg border px-3 py-2 text-[11.5px] leading-5"
          style={{
            borderColor: "rgba(245,158,11,0.30)",
            background: "rgba(245,158,11,0.08)",
            color: "#fcd34d",
          }}
        >
          You also hold {formatMad(nonCompliantValue)} in non-compliant stocks —
          scholars differ on whether these count as zakatable. The calculator
          excludes them by default.
        </p>
      )}
      </div>
    </div>
  );
}

function TradeHistory({
  trades,
  onDelete,
}: {
  trades: Trade[];
  onDelete: (id: string) => void;
}) {
  if (trades.length === 0) return null;
  return (
    <div className="surface-card">
      <p className="section-label">Trade history</p>
      <div className="mt-3 overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Ticker</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Price</th>
              <th className="text-right">Gross Amount</th>
              <th className="text-right">Broker Commission</th>
              <th className="text-right">Taxes</th>
              <th className="text-right">Net Amount</th>
              <th className="text-right">Realized P/L</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => {
              const grossAmount = getTradeGrossAmount(t);
              const commissionAmount = t.commissionAmount ?? 0;
              const taxAmount = t.taxAmount ?? 0;
              const netAmount = getTradeNetAmount(t);
              const realizedPL = t.type === "sell" ? t.realizedPL : undefined;
              const realizedClass =
                realizedPL === undefined
                  ? "num-flat"
                  : realizedPL > 0
                    ? "num-up"
                    : realizedPL < 0
                      ? "num-down"
                      : "num-flat";

              return (
                <tr key={t.id}>
                  <td>
                    <span
                      title={t.date}
                      className={
                        "inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-medium " +
                        (t.type === "buy" ? "chip-up" : "chip-neutral")
                      }
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="ticker-cell">{t.ticker}</td>
                  <td className="text-right num text-[12.5px]">
                    {formatNumber(t.shares, 4)}
                  </td>
                  <td className="text-right num text-[12.5px]">{formatMad(t.price)}</td>
                  <td className="text-right num text-[12.5px]">
                    {formatMad(grossAmount)}
                  </td>
                  <td className="text-right num text-[12.5px]" style={{ color: "var(--text-dim)" }}>
                    {formatMad(commissionAmount)}
                  </td>
                  <td className="text-right num text-[12.5px]" style={{ color: "var(--text-dim)" }}>
                    {formatMad(taxAmount)}
                  </td>
                  <td className="text-right num text-[12.5px]">
                    {formatMad(netAmount)}
                  </td>
                  <td className={`text-right num text-[12.5px] ${realizedClass}`}>
                    {realizedPL === undefined ? "—" : formatMadFixed(realizedPL)}
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="text-[11px] hover:underline"
                      style={{ color: "#f87171" }}
                      onClick={() => onDelete(t.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px]" style={{ color: "var(--text-mute)" }}>
        Deleting a trade rebuilds holdings and cash from the remaining trade log.
      </p>
    </div>
  );
}

function getTradeGrossAmount(trade: Trade): number {
  return trade.grossAmount ?? trade.shares * trade.price;
}

function getTradeNetAmount(trade: Trade): number {
  if (trade.netAmount !== undefined) return trade.netAmount;
  return trade.shares * trade.price;
}
