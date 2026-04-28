import { unstable_cache } from "next/cache";
import { marketQuotes as mockQuotes } from "../market-data";
import { fetchLiveQuotes, type LiveQuote } from "./quotes-fetcher";
import { toTradingViewSymbol } from "./tradingview-symbols";

export const QUOTE_CACHE_SECONDS = 15 * 60;

export interface QuoteSnapshot {
  ticker: string;
  name: string;
  sector: string;
  market: string;
  shariaStatus: "Sharia-compliant" | "Not Sharia-compliant" | "Under review";
  price: number;
  changePct: number;
  changeAbs: number;
  volume: number;
  currency: "MAD";
  dayHigh?: number;
  dayLow?: number;
  tradingViewSymbol: string;
  quoteSource: "tradingview" | "mock";
}

export interface IndexSnapshot {
  symbol: "MASI" | "MASI20";
  name: string;
  tradingViewSymbol: "CSEMA:MASI" | "CSEMA:MSI20";
  price?: number;
  changeAbs?: number;
  changePct?: number;
  quoteSource: "tradingview";
}

export interface QuoteFeed {
  quotes: QuoteSnapshot[];
  indices?: IndexSnapshot[];
  source: "tradingview" | "mock";
  fetchedAt: string; // ISO timestamp
  cacheSeconds: number;
  refreshInterval: number;
  missingTickers?: string[];
  error?: string;
}

/**
 * Returns a cached snapshot of all market quotes.
 * - Tries live TradingView fetch.
 * - On any failure, falls back to deterministic mock data.
 * - Cached for 15 minutes (Next ISR).
 */
export const getMarketFeed = unstable_cache(
  async (): Promise<QuoteFeed> => {
    const fetchedAt = new Date().toISOString();
    try {
      const live = await fetchLiveQuotes();
      if (live.length === 0) {
        throw new Error("TradingView feed returned zero rows");
      }

      const liveTickers = new Set(live.map((row) => row.ticker.toUpperCase()));
      const missingTickers = mockQuotes
        .map((quote) => quote.ticker)
        .filter((ticker) => !liveTickers.has(ticker));

      return {
        quotes: mergeWithCompanyMeta(live),
        indices: await fetchTradingViewIndices(),
        source: "tradingview",
        fetchedAt,
        cacheSeconds: QUOTE_CACHE_SECONDS,
        refreshInterval: QUOTE_CACHE_SECONDS,
        missingTickers,
      };
    } catch (err) {
      return {
        quotes: mockFallback(),
        indices: [],
        source: "mock",
        fetchedAt,
        cacheSeconds: QUOTE_CACHE_SECONDS,
        refreshInterval: QUOTE_CACHE_SECONDS,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
  ["market-feed-v5-tradingview-symbols-indices"],
  { revalidate: 900, tags: ["market-feed"] }
);

const TRADINGVIEW_SCAN_URL = "https://scanner.tradingview.com/morocco/scan";
const INDEX_COLUMNS = ["close", "change", "change_abs"] as const;
const INDEX_SYMBOLS: IndexSnapshot[] = [
  {
    symbol: "MASI",
    name: "MASI",
    tradingViewSymbol: "CSEMA:MASI",
    quoteSource: "tradingview",
  },
  {
    symbol: "MASI20",
    name: "MASI 20",
    tradingViewSymbol: "CSEMA:MSI20",
    quoteSource: "tradingview",
  },
];

type TradingViewIndexRow = {
  s: string;
  d: unknown[];
};

type TradingViewIndexResponse = {
  data?: TradingViewIndexRow[];
};

async function fetchTradingViewIndices(): Promise<IndexSnapshot[]> {
  try {
    const res = await fetch(TRADINGVIEW_SCAN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://www.tradingview.com",
        Referer: "https://www.tradingview.com/chart/?symbol=CSEMA%3AMASI",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        symbols: {
          tickers: INDEX_SYMBOLS.map((index) => index.tradingViewSymbol),
          query: { types: [] },
        },
        columns: INDEX_COLUMNS,
      }),
      cache: "no-store",
    });

    if (!res.ok) return [];

    const payload = (await res.json()) as TradingViewIndexResponse;
    const rows = new Map((payload.data ?? []).map((row) => [row.s, row.d]));

    return INDEX_SYMBOLS.map((index) => {
      const row = rows.get(index.tradingViewSymbol);
      const [close, changePct, changeAbs] = row ?? [];
      return {
        ...index,
        price: asNumber(close),
        changePct: asNumber(changePct),
        changeAbs: asNumber(changeAbs),
      };
    });
  } catch {
    return [];
  }
}

function asNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value;
}

/**
 * Merge live quote fields with static company metadata.
 */
function mergeWithCompanyMeta(live: LiveQuote[]): QuoteSnapshot[] {
  const liveByTicker = new Map(live.map((row) => [row.ticker.toUpperCase(), row]));

  return mockQuotes.map((meta) => {
    const row = liveByTicker.get(meta.ticker);
    if (!row) {
      return {
        ticker: meta.ticker,
        name: meta.name,
        sector: meta.sector,
        market: meta.market,
        shariaStatus: meta.shariaStatus,
        price: meta.price,
        changePct: meta.changePct,
        changeAbs: deriveChangeAbs(meta.price, meta.changePct),
        volume: meta.volume,
        currency: "MAD",
        tradingViewSymbol: meta.tradingViewSymbol,
        quoteSource: "mock",
      };
    }

    const tradingViewSymbol =
      row.tradingViewSymbol ?? toTradingViewSymbol(meta.ticker);

    return {
      ticker: meta.ticker,
      name: meta.name,
      sector: meta.sector,
      market: meta.market,
      shariaStatus: meta.shariaStatus,
      price: row.price,
      changePct: row.changePct ?? meta.changePct,
      changeAbs:
        row.changeAbs ??
        deriveChangeAbs(row.price, row.changePct ?? meta.changePct),
      volume: row.volume ?? meta.volume,
      currency: "MAD",
      dayHigh: row.dayHigh,
      dayLow: row.dayLow,
      tradingViewSymbol,
      quoteSource: "tradingview",
    };
  });
}

function mockFallback(): QuoteSnapshot[] {
  return mockQuotes.map((q) => ({
    ticker: q.ticker,
    name: q.name,
    sector: q.sector,
    market: q.market,
    shariaStatus: q.shariaStatus,
    price: q.price,
    changePct: q.changePct,
    changeAbs: deriveChangeAbs(q.price, q.changePct),
    volume: q.volume,
    currency: "MAD",
    tradingViewSymbol: q.tradingViewSymbol,
    quoteSource: "mock",
  }));
}

function deriveChangeAbs(price: number, changePct: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(changePct)) return 0;
  const previous = price / (1 + changePct / 100);
  const changeAbs = price - previous;
  return Number.isFinite(changeAbs) ? changeAbs : 0;
}
