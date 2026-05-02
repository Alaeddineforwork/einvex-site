"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatMad, formatNumber, formatPct } from "../../market-data";
import type { Candle, SeriesPoint } from "../../market-history";

import {
  getStatusStyle,
  type AaoifiScreening,
  type FinalStatus,
} from "../../screening-data";
import {
  buildRatioRows,
  getShariaRatios,
  type RatioRow,
} from "../../sharia-ratios";
import TradingViewChart from "../../components/tradingview-chart";

interface SnapshotPayload {
  candles: Candle[];
  sma20: SeriesPoint[];
  sma50: SeriesPoint[];
  last: number;
  prevClose: number;
  changeAbs: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  high52w: number;
  low52w: number;
  avgVolume: number;
  volatilityPct: number;
  momentumPct: number;
  trend: "up" | "down" | "flat";
}

interface StockDetailProps {
  ticker: string;
  name: string;
  sector: string;
  market: string;
  tradingViewSymbol: string;
  description: string;
  note: string;
  shariaStatus: FinalStatus;
  aaoifi: AaoifiScreening;
  snapshot: SnapshotPayload;
}

export default function StockDetailClient(props: StockDetailProps) {
  const {
    ticker,
    name,
    sector,
    market,
    tradingViewSymbol,
    description,
    note,
    shariaStatus,
    aaoifi,
    snapshot,
  } = props;

  const ratioRows = useMemo(
    () => buildRatioRows(getShariaRatios(ticker)),
    [ticker]
  );
  const ratiosMeta = useMemo(() => getShariaRatios(ticker), [ticker]);

  const isUp = snapshot.changeAbs >= 0;
  const cls = isUp ? "num-up" : "num-down";

  const trendPosition =
    ((snapshot.last - snapshot.low52w) /
      Math.max(snapshot.high52w - snapshot.low52w, 0.01)) *
    100;

  return (
    <div className="flex flex-col gap-5">
      {/* Header strip */}
      <div className="surface-card flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span className="font-mono">{ticker}</span>
              <span
                className="ml-3 text-base font-normal"
                style={{ color: "var(--text-dim)" }}
              >
                {name}
              </span>
            </h1>
            <span
              className={
                "inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-medium " +
                shariaPillClass(shariaStatus) +
                " " +
                getStatusStyle(shariaStatus)
              }
            >
              {shariaStatus}
            </span>
            <span className="chip">{sector}</span>
            <span className="chip">{market}</span>
            <span
              className={
                "chip " +
                (snapshot.trend === "up"
                  ? "chip-up"
                  : snapshot.trend === "down"
                    ? "chip-down"
                    : "chip-neutral")
              }
            >
              Trend · {snapshot.trend.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="text-right">
            <p
              className="num text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {formatMad(snapshot.last)}
            </p>
            <p className={"num text-[13px] " + cls}>
              {snapshot.changeAbs >= 0 ? "+" : ""}
              {formatMad(snapshot.changeAbs)} · {formatPct(snapshot.changePct)}
            </p>
          </div>
          <Link
            href={`/portfolio?add=${ticker}#position-entry`}
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Track in Portfolio
          </Link>
        </div>
      </div>

      {/* Live TradingView chart */}
      <div className="surface-card">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="section-label">Live chart · TradingView</p>
          <span className="chip chip-up">15-min delayed CSE feed</span>
        </div>
        <TradingViewChart
          ticker={ticker}
          tradingViewSymbol={tradingViewSymbol}
          height={500}
        />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPI
          label="Day range"
          value={formatMad(snapshot.dayLow) + " – " + formatMad(snapshot.dayHigh)}
        />
        <KPI
          label="52w range"
          value={formatMad(snapshot.low52w) + " – " + formatMad(snapshot.high52w)}
        />
        <KPI
          label="Avg volume (20d)"
          value={formatNumber(snapshot.avgVolume, 0)}
        />
        <KPI
          label="Momentum (1M)"
          value={formatPct(snapshot.momentumPct)}
          tone={snapshot.momentumPct >= 0 ? "up" : "down"}
        />
        <KPI
          label="Volatility (annualised)"
          value={snapshot.volatilityPct.toFixed(1) + "%"}
        />
        <KPI label="Prev close" value={formatMad(snapshot.prevClose)} />
        <KPI
          label="Position vs 52w"
          value={trendPosition.toFixed(0) + "%"}
        />
        <KPI
          label="Trend signal (SMA20 vs 50)"
          value={snapshot.trend.toUpperCase()}
          tone={
            snapshot.trend === "up"
              ? "up"
              : snapshot.trend === "down"
                ? "down"
                : "neutral"
          }
        />
      </div>

      {/* Company info */}
      <div className="surface-card">
        <p className="section-label">About the company</p>
        <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-3">
            <p
              className="text-[14px] leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              {description}
            </p>
            <p
              className="text-[12.5px] leading-6"
              style={{ color: "var(--text-mute)" }}
            >
              {note}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px] md:grid-cols-1">
            <InfoRow label="Ticker" value={ticker} mono />
            <InfoRow label="Legal name" value={name} />
            <InfoRow label="Sector" value={sector} />
            <InfoRow label="Listing" value={market} />
            <InfoRow
              label="Sharia status"
              value={shariaStatus}
              tone={
                shariaStatus === "Sharia-compliant"
                  ? "up"
                  : shariaStatus === "Not Sharia-compliant"
                    ? "down"
                    : "neutral"
              }
            />
          </dl>
        </div>
      </div>

      {/* Sharia ratios table */}
      <div className="surface-card overflow-x-auto">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Sharia screening · AAOIFI ratios</p>
            <p
              className="mt-1 text-[12.5px] leading-6"
              style={{ color: "var(--text-mute)" }}
            >
              Each row applies one of the four AAOIFI filters. Rows show
              pass/fail where a ratio applies, or N/A when the filter is not
              decisive for the current verdict.
            </p>
          </div>
          {ratiosMeta.asOfDate && (
            <span className="chip" title={ratiosMeta.source ?? undefined}>
              As of {ratiosMeta.asOfDate}
            </span>
          )}
        </div>

        <table className="data-table mt-4 min-w-full">
          <thead>
            <tr>
              <th>Filter</th>
              <th>Formula</th>
              <th>Limit</th>
              <th className="text-right">Value</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {ratioRows.map((row) => (
              <RatioRowView key={row.key} row={row} />
            ))}
          </tbody>
        </table>
      </div>

      {/* AAOIFI plain-language verdict */}
      <div className="surface-card">
        <p className="section-label">AAOIFI verdict</p>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex items-center justify-center md:justify-start">
            <span
              className={
                "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold " +
                shariaPillClass(shariaStatus) +
                " " +
                getStatusStyle(shariaStatus)
              }
            >
              {shariaStatus}
            </span>
          </div>
          <p
            className="text-[14px] leading-7"
            style={{ color: "var(--text-dim)" }}
          >
            {aaoifi.comment}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow(props: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "up" | "down" | "neutral";
}) {
  const tone = props.tone ?? "neutral";
  const valueColor =
    tone === "up"
      ? "#4ade80"
      : tone === "down"
        ? "#f87171"
        : "var(--text)";
  return (
    <div className="flex flex-col gap-1">
      <dt className="section-label">{props.label}</dt>
      <dd
        className={props.mono ? "ticker-cell" : "text-[13px]"}
        style={{ color: valueColor }}
      >
        {props.value}
      </dd>
    </div>
  );
}

function RatioRowView({ row }: { row: RatioRow }) {
  const statusChip =
    row.verdict === "pending"
      ? "chip chip-neutral"
      : row.verdict === "not_applicable"
        ? "chip chip-neutral"
      : row.verdict === "pass"
        ? "chip chip-up"
        : "chip chip-down";
  const statusLabel =
    row.verdict === "pending"
      ? "N/A"
      : row.statusLabel
        ? row.statusLabel
      : row.verdict === "pass"
        ? "Pass"
        : "Fail";
  return (
    <tr>
      <td className="text-[13px]" style={{ color: "var(--text)" }}>
        {row.filter}
      </td>
      <td className="text-[12.5px]" style={{ color: "var(--text-dim)" }}>
        {row.formula}
      </td>
      <td className="num text-[12.5px]" style={{ color: "var(--text-dim)" }}>
        {row.limit}
      </td>
      <td className="text-right num text-[13px]">
        {row.value === null ? (
          <span
            className="text-[11.5px] italic"
            style={{ color: "var(--text-mute)" }}
          >
            N/A
          </span>
        ) : (
          row.value
        )}
      </td>
      <td className="text-right">
        <span className={statusChip}>{statusLabel}</span>
      </td>
    </tr>
  );
}

function KPI(props: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
}) {
  const tone = props.tone ?? "neutral";
  const color =
    tone === "up" ? "#4ade80" : tone === "down" ? "#f87171" : "var(--text)";
  return (
    <div className="surface-subtle">
      <p className="section-label">{props.label}</p>
      <p
        className="mt-2 num text-[18px] font-semibold tracking-tight"
        style={{ color }}
      >
        {props.value}
      </p>
    </div>
  );
}

function shariaPillClass(s: FinalStatus) {
  if (s === "Sharia-compliant") return "pill-compliant";
  if (s === "Not Sharia-compliant") return "pill-not-compliant";
  return "pill-not-compliant";
}
