"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ColorType,
  createChart,
  type LineData,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import type { Trade } from "./portfolio-store";

let registered = false;
type ChartCtor = new (
  ctx: CanvasRenderingContext2D,
  config: Record<string, unknown>
) => { destroy: () => void };

async function ensureChart(): Promise<ChartCtor> {
  const mod = (await import("chart.js/auto")) as unknown as {
    default: ChartCtor;
  };
  if (!registered) registered = true;
  return mod.default;
}

const PALETTE = [
  "#22c55e",
  "#60a5fa",
  "#f59e0b",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fb7185",
  "#facc15",
  "#38bdf8",
  "#fbbf24",
];

type RangeKey = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "All";
const RANGES: RangeKey[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "All"];

export function EquityCurve({
  trades,
  reinvestmentPot,
  currentNetValue,
}: {
  trades: Trade[];
  reinvestmentPot: number;
  currentNetValue: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [range, setRange] = useState<RangeKey>("All");
  const [tooltip, setTooltip] = useState<ChartTooltip | null>(null);
  const series = useMemo(
    () => buildEquitySeries(trades, reinvestmentPot, currentNetValue),
    [trades, reinvestmentPot, currentNetValue]
  );
  const visibleSeries = useMemo(
    () => filterSeriesByRange(series, range),
    [series, range]
  );
  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    const chart = createChart(container, {
      autoSize: true,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ba3ad",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.045)" },
        horzLines: { color: "rgba(255,255,255,0.045)" },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
        scaleMargins: { top: 0.14, bottom: 0.14 },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: "rgba(167,243,208,0.35)",
          labelBackgroundColor: "#0d1218",
        },
        horzLine: {
          color: "rgba(167,243,208,0.20)",
          labelBackgroundColor: "#0d1218",
        },
      },
    });

    const totalSeries = chart.addLineSeries({
      color: "#22c55e",
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: true,
      pointMarkersVisible: true,
    });
    totalSeries.setData(visibleSeries.totalData);
    totalSeries.setMarkers(visibleSeries.markers.map((marker) => ({
      time: marker.time,
      position: marker.type === "buy" ? "belowBar" : "aboveBar",
      color: marker.type === "buy" ? "#22c55e" : "#ef4444",
      shape: marker.type === "buy" ? "arrowUp" : "arrowDown",
      text: marker.label,
      size: 1,
    })));

    chart.timeScale().fitContent();

    const onMove = (param: MouseEventParams<Time>) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }
      const date = String(param.time);
      const total = visibleSeries.totalByDate[date];
      if (total === undefined) {
        setTooltip(null);
        return;
      }
      setTooltip({
        x: Math.min(Math.max(param.point.x, 8), container.clientWidth - 260),
        y: Math.min(Math.max(param.point.y, 8), 188),
        date,
        total,
        invested: visibleSeries.investedByDate[date] ?? 0,
        event: visibleSeries.eventsByDate[date],
      });
    };
    chart.subscribeCrosshairMove(onMove);

    return () => {
      chart.unsubscribeCrosshairMove(onMove);
      chart.remove();
    };
  }, [visibleSeries]);

  if (series.labels.length === 0) {
    return (
      <div
        className="rounded-lg border p-8 text-center text-[12.5px]"
        style={{
          borderColor: "var(--line)",
          color: "var(--text-mute)",
          background: "var(--bg-elev)",
        }}
      >
        Your portfolio chart will appear after you add trades.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {RANGES.map((option) => {
          const active = range === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              className="rounded-md border px-2.5 py-1 text-[11px] font-semibold transition"
              style={{
                borderColor: active ? "rgba(34,197,94,0.45)" : "var(--line)",
                background: active ? "rgba(34,197,94,0.12)" : "transparent",
                color: active ? "#a7f3d0" : "var(--text-mute)",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div style={{ position: "relative", height: 280, width: "100%" }}>
        <div ref={ref} className="h-full w-full" />
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 min-w-[230px] rounded-lg border px-3 py-2 text-[11px]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              borderColor: "rgba(255,255,255,0.10)",
              background: "rgba(13,18,24,0.96)",
              color: "var(--text-dim)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
            }}
          >
            <p className="num font-semibold" style={{ color: "var(--text)" }}>
              {tooltip.date}
            </p>
            <p className="mt-1 num" style={{ color: "#4ade80" }}>
              Total value: {formatMad(tooltip.total)}
            </p>
            <p className="mt-0.5 num" style={{ color: "var(--text-mute)" }}>
              Cash invested: {formatMad(tooltip.invested)}
            </p>
            {tooltip.event && (
              <p className="mt-2 leading-5" style={{ color: "var(--text-mute)" }}>
                {tooltip.event}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SectorDonut({
  data,
}: {
  data: { sector: string; value: number }[];
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;
    let disposed = false;
    let chart: { destroy: () => void } | undefined;

    (async () => {
      const Chart = await ensureChart();
      if (disposed || !ref.current) return;
      const ctx = ref.current.getContext("2d");
      if (!ctx) return;

      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.map((d) => d.sector),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: data.map(
                (_, i) => PALETTE[i % PALETTE.length]
              ),
              borderColor: "#0d1218",
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: donutOptions("62%"),
      });
    })();

    return () => {
      disposed = true;
      if (chart) chart.destroy();
    };
  }, [data]);

  if (data.length === 0) return <EmptyDonut />;

  return (
    <div style={{ position: "relative", height: 200, width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}

export function ShariaDonut({
  compliant,
  notCompliant,
  underReview,
}: {
  compliant: number;
  notCompliant: number;
  underReview: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const total = compliant + notCompliant + underReview;

  useEffect(() => {
    if (!ref.current || total === 0) return;
    let disposed = false;
    let chart: { destroy: () => void } | undefined;

    (async () => {
      const Chart = await ensureChart();
      if (disposed || !ref.current) return;
      const ctx = ref.current.getContext("2d");
      if (!ctx) return;

      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Compliant", "Not compliant", "Under review"],
          datasets: [
            {
              data: [compliant, notCompliant, underReview],
              backgroundColor: ["#22c55e", "#ef4444", "#9ba3ad"],
              borderColor: "#0d1218",
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: donutOptions("65%"),
      });
    })();

    return () => {
      disposed = true;
      if (chart) chart.destroy();
    };
  }, [compliant, notCompliant, underReview, total]);

  if (total === 0) return <EmptyDonut />;

  return (
    <div style={{ position: "relative", height: 200, width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}

function EmptyDonut() {
  return (
    <div
      className="rounded-lg border p-6 text-center text-[12.5px]"
      style={{
        borderColor: "var(--line)",
        color: "var(--text-mute)",
        background: "var(--bg-elev)",
      }}
    >
      No holdings yet.
    </div>
  );
}

function donutOptions(cutout: string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#9ba3ad",
          font: { family: "Inter, sans-serif", size: 11 },
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#0d1218",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        titleColor: "#e6e8eb",
        bodyColor: "#e6e8eb",
        titleFont: { family: "JetBrains Mono, monospace", size: 11 },
        bodyFont: { family: "JetBrains Mono, monospace", size: 11 },
        padding: 10,
        callbacks: {
          label: (ctx: { label: string; parsed: number }) =>
            `${ctx.label}: ${formatMad(ctx.parsed)}`,
        },
      },
    },
  };
}

function formatMad(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

interface EquitySeries {
  dates: string[];
  labels: string[];
  value: number[];
  invested: number[];
  events: string[];
  eventKinds: Array<"buy" | "sell" | "current">;
  totalData: LineData[];
  investedData: LineData[];
  totalByDate: Record<string, number>;
  investedByDate: Record<string, number>;
  eventsByDate: Record<string, string>;
  markers: ChartMarker[];
}

type Position = {
  shares: number;
  avgPrice: number;
};

type ChartMarker = {
  time: Time;
  type: "buy" | "sell";
  ticker: string;
  label: string;
};

type ChartTooltip = {
  x: number;
  y: number;
  date: string;
  total: number;
  invested: number;
  event?: string;
};

type EquitySeriesSource = Pick<
  EquitySeries,
  | "dates"
  | "labels"
  | "value"
  | "invested"
  | "events"
  | "eventKinds"
  | "markers"
>;

function buildEquitySeries(
  trades: Trade[],
  reinvestmentPot: number,
  currentNetValue: number
): EquitySeries {
  if (trades.length === 0) {
    return emptySeries();
  }

  const sortedTrades = [...trades].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const positions = new Map<string, Position>();
  let pot = 0;
  let invested = 0;

  const dates: string[] = [];
  const labels: string[] = [];
  const valueSeries: number[] = [];
  const investedSeries: number[] = [];
  const events: string[] = [];
  const eventKinds: Array<"buy" | "sell" | "current"> = [];
  const markers: ChartMarker[] = [];

  for (const trade of sortedTrades) {
    const event = replayTrade(trade, positions, pot, invested);
    pot = event.pot;
    invested = event.invested;

    dates.push(trade.date);
    labels.push(formatDateLabel(trade.date));
    valueSeries.push(Math.round(portfolioBookValue(positions) + pot));
    investedSeries.push(Math.round(invested));
    events.push(event.label);
    eventKinds.push(trade.type);
    markers.push({
      time: trade.date as Time,
      type: trade.type,
      ticker: trade.ticker.toUpperCase(),
      label: `${trade.type.toUpperCase()} ${trade.ticker.toUpperCase()}`,
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  dates.push(today);
  labels.push("Current");
  valueSeries.push(Math.round(currentNetValue));
  investedSeries.push(Math.round(invested));
  events.push(
    `Current net value includes latest prices and ${formatMad(reinvestmentPot)} cash.`
  );
  eventKinds.push("current");

  return finalizeSeries({
    dates,
    labels,
    value: valueSeries,
    invested: investedSeries,
    events,
    eventKinds,
    markers,
  });
}

function replayTrade(
  trade: Trade,
  positions: Map<string, Position>,
  pot: number,
  invested: number
): { pot: number; invested: number; label: string } {
  const ticker = trade.ticker.toUpperCase();
  const current = positions.get(ticker);

  if (trade.type === "buy") {
    const netAmount = trade.netAmount ?? trade.shares * trade.price;
    const currentShares = current?.shares ?? 0;
    const currentCost = currentShares * (current?.avgPrice ?? 0);
    const nextShares = currentShares + trade.shares;
    if (nextShares > 0) {
      positions.set(ticker, {
        shares: nextShares,
        avgPrice: (currentCost + netAmount) / nextShares,
      });
    }
    const fundingFromPot = Math.min(trade.fundingFromPot ?? 0, pot, netAmount);
    return {
      pot: pot - fundingFromPot,
      invested: invested + netAmount - fundingFromPot,
      label: [
        `BUY ${ticker}`,
        `Shares: ${formatShares(trade.shares)}`,
        `Price: ${formatMad(trade.price)}`,
        `Total invested: ${formatMad(netAmount)}`,
      ].join("\n"),
    };
  }

  const currentShares = current?.shares ?? 0;
  const sellShares = Math.min(trade.shares, currentShares);
  const remaining = currentShares - sellShares;
  if (current && remaining > 0) {
    positions.set(ticker, { ...current, shares: remaining });
  } else {
    positions.delete(ticker);
  }

  const netReceived = trade.netAmount ?? sellShares * trade.price;
  const realized =
    trade.realizedPL === undefined
      ? "Realized P/L: unavailable"
      : `Realized P/L: ${formatMad(trade.realizedPL)}`;

  return {
    pot: pot + netReceived,
    invested,
    label: [
      `SELL ${ticker}`,
      `Shares: ${formatShares(sellShares)}`,
      `Net received: ${formatMad(netReceived)}`,
      realized,
    ].join("\n"),
  };
}

function portfolioBookValue(positions: Map<string, Position>): number {
  let value = 0;
  for (const position of positions.values()) {
    value += position.shares * position.avgPrice;
  }
  return value;
}

function emptySeries(): EquitySeries {
  return {
    dates: [],
    labels: [],
    value: [],
    invested: [],
    events: [],
    eventKinds: [],
    totalData: [],
    investedData: [],
    totalByDate: {},
    investedByDate: {},
    eventsByDate: {},
    markers: [],
  };
}

function filterSeriesByRange(series: EquitySeries, range: RangeKey): EquitySeries {
  if (range === "All" || series.dates.length === 0) return series;

  const now = new Date();
  const start = new Date(now);
  if (range === "1D") start.setDate(start.getDate() - 1);
  if (range === "1W") start.setDate(start.getDate() - 7);
  if (range === "1M") start.setMonth(start.getMonth() - 1);
  if (range === "3M") start.setMonth(start.getMonth() - 3);
  if (range === "6M") start.setMonth(start.getMonth() - 6);
  if (range === "1Y") start.setFullYear(start.getFullYear() - 1);
  start.setHours(0, 0, 0, 0);

  const firstKept = series.dates.findIndex(
    (date) => new Date(`${date}T00:00:00`).getTime() >= start.getTime()
  );
  if (firstKept < 0) return series;
  const startIndex = Math.max(0, firstKept - 1);

  return finalizeSeries({
    dates: series.dates.slice(startIndex),
    labels: series.labels.slice(startIndex),
    value: series.value.slice(startIndex),
    invested: series.invested.slice(startIndex),
    events: series.events.slice(startIndex),
    eventKinds: series.eventKinds.slice(startIndex),
    markers: series.markers.filter((marker) =>
      new Date(`${String(marker.time)}T00:00:00`).getTime() >= start.getTime()
    ),
  });
}

function finalizeSeries(source: EquitySeriesSource): EquitySeries {
  const totalData = pointSeries(latestByDate(source.dates, source.value));
  const investedData = pointSeries(latestByDate(source.dates, source.invested));
  const totalByDate = dataByDate(totalData);
  const investedByDate = dataByDate(investedData);
  const eventsByDate: Record<string, string> = {};
  source.events.forEach((event, index) => {
    const date = source.dates[index];
    if (!event) return;
    eventsByDate[date] = eventsByDate[date]
      ? `${eventsByDate[date]}\n${event}`
      : event;
  });

  return {
    ...source,
    totalData,
    investedData,
    totalByDate,
    investedByDate,
    eventsByDate,
    markers: source.markers,
  };
}

function latestByDate(
  dates: string[],
  values: Array<number | null>
): Record<string, number> {
  const byDate: Record<string, number> = {};
  dates.forEach((date, index) => {
    const value = values[index];
    if (typeof value === "number" && Number.isFinite(value)) {
      byDate[date] = value;
    }
  });
  return byDate;
}

function pointSeries(pointsByDate: Record<string, number>): LineData[] {
  const anchors = Object.entries(pointsByDate)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return anchors.map((point) => ({
    time: point.date as Time,
    value: point.value,
  }));
}

function dataByDate(data: LineData[]): Record<string, number> {
  return Object.fromEntries(
    data.map((point) => [String(point.time), point.value])
  );
}

function formatDateLabel(date: string): string {
  return date.slice(5);
}

function formatShares(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits: 4,
  }).format(value);
}
