"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Sparkline from "../components/sparkline";
import {
  formatMad,
  formatNumber,
  formatPct,
  marketQuotes,
  type MarketQuote,
} from "../market-data";
import {
  getStatusStyle,
  type FinalStatus,
} from "../screening-data";

type SortKey = "ticker" | "name" | "sector" | "price" | "changePct" | "volume";
type SortDir = "asc" | "desc";

const STATUS_TABS: Array<"All" | FinalStatus> = [
  "All",
  "Sharia-compliant",
  "Not Sharia-compliant",
];

type QuoteFeedResponse = {
  quotes?: MarketQuote[];
  indices?: MarketIndexQuote[];
};

type MarketIndexQuote = {
  symbol: "MASI" | "MASI20";
  name: string;
  price?: number;
  changeAbs?: number;
  changePct?: number;
  quoteSource: "tradingview";
};

function mergeQuoteFallbacks(liveQuotes: MarketQuote[]): MarketQuote[] {
  const liveByTicker = new Map(
    liveQuotes.map((quote) => [quote.ticker.toUpperCase(), quote])
  );

  return marketQuotes.map((fallback) => {
    const live = liveByTicker.get(fallback.ticker);
    return live ? { ...fallback, ...live } : fallback;
  });
}

export default function MarcheClient() {
  const [quotes, setQuotes] = useState<MarketQuote[]>(marketQuotes);
  const [indices, setIndices] = useState<MarketIndexQuote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [statusFilter, setStatusFilter] =
    useState<"All" | FinalStatus>("All");
  const [sortKey, setSortKey] = useState<SortKey>("changePct");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    let disposed = false;

    async function loadQuotes() {
      try {
        const res = await fetch("/api/quotes", { cache: "no-store" });
        if (!res.ok) return;
        const feed = (await res.json()) as QuoteFeedResponse;
        if (!disposed && Array.isArray(feed.quotes) && feed.quotes.length > 0) {
          setQuotes(mergeQuoteFallbacks(feed.quotes));
          setIndices(Array.isArray(feed.indices) ? feed.indices : []);
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

  /* ------- Sectors with counts (for left rail) ------- */
  const sectors = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of quotes) {
      map.set(q.sector, (map.get(q.sector) ?? 0) + 1);
    }
    const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return [{ name: "All", count: quotes.length }, ...arr.map(([name, count]) => ({ name, count }))];
  }, [quotes]);

  /* ------- Top movers ------- */
  const { topGainers, topLosers, mostActive } = useMemo(() => {
    const sortedByChange = [...quotes].sort(
      (a, b) => b.changePct - a.changePct
    );
    const gainers = sortedByChange.slice(0, 3);
    const losers = [...sortedByChange].reverse().slice(0, 3);
    const active = [...quotes]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 3);
    return { topGainers: gainers, topLosers: losers, mostActive: active };
  }, [quotes]);

  /* ------- Filter + sort table ------- */
  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return quotes
      .filter((q) => {
        const matchesSearch =
          needle.length === 0 ||
          q.name.toLowerCase().includes(needle) ||
          q.ticker.toLowerCase().includes(needle) ||
          q.sector.toLowerCase().includes(needle);
        const matchesSector =
          sectorFilter === "All" || q.sector === sectorFilter;
        const matchesStatus =
          statusFilter === "All" || q.shariaStatus === statusFilter;
        return matchesSearch && matchesSector && matchesStatus;
      })
      .sort((a, b) => {
        const mult = sortDir === "asc" ? 1 : -1;
        switch (sortKey) {
          case "price":
            return (a.price - b.price) * mult;
          case "changePct":
            return (a.changePct - b.changePct) * mult;
          case "volume":
            return (a.volume - b.volume) * mult;
          case "name":
            return a.name.localeCompare(b.name) * mult;
          case "sector":
            return a.sector.localeCompare(b.sector) * mult;
          case "ticker":
          default:
            return a.ticker.localeCompare(b.ticker) * mult;
        }
      });
  }, [quotes, searchQuery, sectorFilter, statusFilter, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(
        key === "price" || key === "volume" || key === "changePct"
          ? "desc"
          : "asc"
      );
    }
  }

  const compliantCount = quotes.filter(
    (q) => q.shariaStatus === "Sharia-compliant"
  ).length;
  const notCompliantCount = quotes.filter(
    (q) => q.shariaStatus === "Not Sharia-compliant"
  ).length;
  const compliantPct = formatDecimalPct(compliantCount, quotes.length);
  const notCompliantPct = formatDecimalPct(notCompliantCount, quotes.length);
  return (
    <div className="flex flex-col gap-5">
      <TradingViewMarketOverview indices={indices} />

      {/* ------ Market summary ------ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryStat label="Listed" value={formatNumber(quotes.length, 0)} tone="neutral" />
        <SummaryStat
          label="Sharia-compliant"
          value={formatNumber(compliantCount, 0)}
          tone="up"
          sub={`${compliantPct} of universe`}
        />
        <SummaryStat
          label="Not Sharia-compliant"
          value={formatNumber(notCompliantCount, 0)}
          tone="down"
          sub={`${notCompliantPct} of universe`}
        />
      </div>

      {/* ------ Movers strip ------ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MoverCard title="Top gainers" icon="▲" tone="up" quotes={topGainers} />
        <MoverCard title="Top losers" icon="▼" tone="down" quotes={topLosers} />
        <MoverCard title="Most active" icon="●" tone="neutral" quotes={mostActive} />
      </div>

      {/* ------ Filters + table ------ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        {/* Sector rail */}
        <aside className="surface-card hidden flex-col gap-1 p-3 lg:flex lg:p-4 lg:max-h-[640px] lg:overflow-auto">
          <p className="section-label mb-2">Sectors</p>
          {sectors.map((s) => {
            const active = sectorFilter === s.name;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setSectorFilter(s.name)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-[12.5px] transition"
                style={{
                  background: active ? "var(--accent-soft)" : "transparent",
                  color: active ? "#a7f3d0" : "var(--text-dim)",
                  fontWeight: active ? 600 : 500,
                  textAlign: "left",
                  border: active
                    ? "1px solid rgba(34,197,94,0.30)"
                    : "1px solid transparent",
                }}
              >
                <span className="truncate">{s.name}</span>
                <span
                  className="num text-[11px]"
                  style={{ color: active ? "#a7f3d0" : "var(--text-mute)" }}
                >
                  {s.count}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Right: filters + table */}
        <div className="flex flex-col gap-4">
          <div className="surface-card flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-3">
              <div className="flex-1">
                <label className="field-label" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  className="field-control"
                  placeholder="Ticker, company or sector…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid gap-3 lg:hidden">
                <div>
                  <label className="field-label" htmlFor="sector-filter">
                    Sector
                  </label>
                  <select
                    id="sector-filter"
                    className="field-control"
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                  >
                    {sectors.map((sector) => (
                      <option key={sector.name} value={sector.name}>
                        {sector.name === "All"
                          ? `All sectors (${sector.count})`
                          : `${sector.name} (${sector.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label" htmlFor="status-filter">
                    Sharia status
                  </label>
                  <select
                    id="status-filter"
                    className="field-control"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "All" | FinalStatus)
                    }
                  >
                    {STATUS_TABS.map((tab) => (
                      <option key={tab} value={tab}>
                        {tab === "All" ? "All statuses" : tab}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hidden flex-wrap gap-2 lg:flex">
                {STATUS_TABS.map((tab) => {
                  const active = statusFilter === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className="rounded-lg px-3 py-2 text-[12px] font-medium transition"
                      style={{
                        border: active
                          ? "1px solid rgba(34,197,94,0.40)"
                          : "1px solid var(--line-strong)",
                        background: active
                          ? "var(--accent-soft)"
                          : "var(--bg-elev)",
                        color: active ? "#a7f3d0" : "var(--text-dim)",
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="flex flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:justify-between"
              style={{ color: "var(--text-mute)" }}
            >
              <span className="section-label">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </span>
              <span>Click any ticker for the full chart and screening detail</span>
            </div>
          </div>

          <div
            className="lg:hidden"
            style={{
              color: "var(--text-mute)",
              fontSize: "11.5px",
              padding: "0 0.25rem",
            }}
          >
            Swipe horizontally to see price, status, and more <span aria-hidden>→</span>
          </div>

          <div
            className="surface-card overflow-x-auto p-0"
            style={{ paddingTop: 0 }}
          >
            <table className="data-table min-w-full">
              <thead>
                <tr>
                  <Th label="Ticker" active={sortKey === "ticker"} dir={sortDir} onClick={() => onSort("ticker")} />
                  <Th label="Company" active={sortKey === "name"} dir={sortDir} onClick={() => onSort("name")} />
                  <Th label="Sector" active={sortKey === "sector"} dir={sortDir} onClick={() => onSort("sector")} />
                  <th className="text-right" style={{ minWidth: 100 }}>Trend (3M)</th>
                  <Th label="Price" active={sortKey === "price"} dir={sortDir} onClick={() => onSort("price")} align="right" />
                  <Th label="Change" active={sortKey === "changePct"} dir={sortDir} onClick={() => onSort("changePct")} align="right" />
                  <Th label="Volume" active={sortKey === "volume"} dir={sortDir} onClick={() => onSort("volume")} align="right" />
                  <th>Sharia</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <Row key={q.ticker} quote={q} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-sm"
                      style={{ color: "var(--text-mute)" }}
                    >
                      No companies match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDecimalPct(count: number, total: number): string {
  if (total <= 0) return "0,0%";
  return `${((count / total) * 100).toFixed(1).replace(".", ",")}%`;
}

/* -------------------- Sub-components -------------------- */

function TradingViewMarketOverview({ indices }: { indices: MarketIndexQuote[] }) {
  const masi = indices.find((index) => index.symbol === "MASI");
  const masi20 = indices.find((index) => index.symbol === "MASI20");

  return (
    <section className="surface-card">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <IndexCard title="MASI" index={masi} />
        <IndexCard title="MASI 20" index={masi20} />
      </div>
      <p className="section-label mt-5">MASI Index</p>
      <TradingViewWidget
        scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
        config={{
          autosize: true,
          symbol: "CSEMA:MASI",
          interval: "D",
          timezone: "Africa/Casablanca",
          theme: "dark",
          style: "2",
          locale: "en",
          backgroundColor: "rgba(0, 0, 0, 0)",
          gridColor: "rgba(255, 255, 255, 0.06)",
          hide_top_toolbar: false,
          hide_legend: false,
          allow_symbol_change: false,
          save_image: false,
          calendar: false,
          support_host: "https://www.tradingview.com",
        }}
      />
    </section>
  );
}

function IndexCard({
  title,
  index,
}: {
  title: string;
  index?: MarketIndexQuote;
}) {
  const hasPrice = typeof index?.price === "number";
  const changePct = index?.changePct;
  const changeAbs = index?.changeAbs;
  const tone =
    typeof changePct === "number" && changePct > 0
      ? "up"
      : typeof changePct === "number" && changePct < 0
        ? "down"
        : "neutral";
  const valueColor =
    tone === "up" ? "#4ade80" : tone === "down" ? "#f87171" : "var(--text)";
  const arrow = tone === "up" ? "▲" : tone === "down" ? "▼" : "•";

  return (
    <div
      className="min-h-[132px] rounded-lg border p-4"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background: "#05070a",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="section-label">{title}</p>
        <span
          className={
            "num text-[12px] " +
            (tone === "up" ? "num-up" : tone === "down" ? "num-down" : "num-flat")
          }
        >
          {arrow}
        </span>
      </div>
      <p
        className="mt-4 num text-2xl font-semibold tracking-tight"
        style={{ color: valueColor }}
      >
        {hasPrice ? formatNumber(index.price ?? 0, 2) : "—"}
      </p>
      <p
        className={
          "mt-2 num text-[12.5px] " +
          (tone === "up" ? "num-up" : tone === "down" ? "num-down" : "num-flat")
        }
      >
        {typeof changeAbs === "number" && typeof changePct === "number"
          ? `${changeAbs > 0 ? "+" : ""}${formatNumber(changeAbs, 2)} (${formatPct(changePct)})`
          : "—"}
      </p>
    </div>
  );
}

function TradingViewWidget({
  scriptUrl,
  config,
}: {
  scriptUrl: string;
  config: Record<string, unknown>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.width = "100%";
    widget.style.height = "100%";
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.type = "text/javascript";
    script.text = JSON.stringify(config);
    container.append(widget, script);

    return () => {
      container.replaceChildren();
    };
  }, [config, scriptUrl]);

  return (
    <div
      className="relative mt-4 h-[300px] overflow-hidden rounded-lg border sm:h-[420px] lg:h-[460px]"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background: "#05070a",
      }}
    >
      <div
        ref={containerRef}
        className="tradingview-widget-container absolute inset-0 h-full w-full overflow-hidden"
        style={{
          background: "#05070a",
          colorScheme: "dark",
        }}
      />
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: string;
  tone: "up" | "down" | "neutral";
  sub?: string;
}) {
  const valueColor =
    tone === "up" ? "#4ade80" : tone === "down" ? "#f87171" : "var(--text)";
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

function MoverCard({
  title,
  icon,
  tone,
  quotes,
}: {
  title: string;
  icon: string;
  tone: "up" | "down" | "neutral";
  quotes: MarketQuote[];
}) {
  const accent =
    tone === "up" ? "#4ade80" : tone === "down" ? "#f87171" : "var(--text-dim)";
  return (
    <div className="surface-card">
      <div className="flex items-center justify-between">
        <p className="section-label">{title}</p>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {quotes.map((q) => {
          const cls =
            tone === "neutral"
              ? "num-flat"
              : q.changePct >= 0
              ? "num-up"
              : "num-down";
          return (
            <li key={q.ticker}>
              <Link
                href={`/marche/${q.ticker}`}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition"
                style={{
                  textDecoration: "none",
                  color: "var(--text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div className="min-w-0">
                  <p className="ticker-cell">{q.ticker}</p>
                  <p
                    className="truncate text-[11.5px]"
                    style={{ color: "var(--text-mute)" }}
                  >
                    {q.name}
                  </p>
                </div>
                <Sparkline ticker={q.ticker} width={64} height={20} days={30} />
                <div className="text-right">
                  <p className="num text-[13px]">{formatMad(q.price)}</p>
                  <p className={`num text-[11.5px] ${cls}`}>
                    {tone === "neutral"
                      ? formatNumber(q.volume, 0)
                      : formatPct(q.changePct)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Th({
  label,
  active,
  dir,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th className={align === "right" ? "text-right" : "text-left"}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 transition"
        style={{
          color: active ? "var(--text)" : "var(--text-mute)",
        }}
      >
        {label}
        {active && <span aria-hidden>{dir === "asc" ? "▲" : "▼"}</span>}
      </button>
    </th>
  );
}

function Row({ quote }: { quote: MarketQuote }) {
  const cls =
    quote.changePct > 0
      ? "num-up"
      : quote.changePct < 0
      ? "num-down"
      : "num-flat";

  const pillCls =
    quote.shariaStatus === "Sharia-compliant"
      ? "pill-compliant"
      : "pill-not-compliant";

  return (
    <tr>
      <td>
        <Link
          href={`/marche/${quote.ticker}`}
          className="ticker-cell hover:underline"
          style={{ textDecoration: "none" }}
        >
          {quote.ticker}
        </Link>
      </td>
      <td className="text-[13px]" style={{ color: "var(--text)" }}>
        {quote.name}
      </td>
      <td
        className="text-[12.5px]"
        style={{ color: "var(--text-dim)" }}
      >
        {quote.sector}
      </td>
      <td className="text-right">
        <Sparkline ticker={quote.ticker} width={72} height={20} days={60} />
      </td>
      <td className="text-right num text-[13px]" style={{ color: "var(--text)" }}>
        {formatMad(quote.price)}
      </td>
      <td className={`text-right num text-[13px] ${cls}`}>
        {formatPct(quote.changePct)}
      </td>
      <td
        className="text-right num text-[12px]"
        style={{ color: "var(--text-mute)" }}
      >
        {formatNumber(quote.volume, 0)}
      </td>
      <td>
        <span
          className={
            "inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-medium " +
            pillCls +
            " " +
            getStatusStyle(quote.shariaStatus)
          }
        >
          {quote.shariaStatus}
        </span>
      </td>
      <td className="text-right">
        <Link
          href={`/portfolio?add=${quote.ticker}#position-entry`}
          className="inline-flex min-h-8 items-center justify-center rounded-md border px-3 py-1.5 text-[11.5px] font-semibold leading-none transition"
          style={{
            borderColor: "rgba(34,197,94,0.30)",
            color: "#6ee7a7",
            background: "rgba(34,197,94,0.06)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(34,197,94,0.16)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(34,197,94,0.06)";
          }}
        >
          Track
        </Link>
      </td>
    </tr>
  );
}

