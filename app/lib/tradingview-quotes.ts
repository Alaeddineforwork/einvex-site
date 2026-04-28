import { fromTradingViewSymbol, toTradingViewSymbol } from "./tradingview-symbols";
import type { LiveQuote } from "./quotes-fetcher";

const TRADINGVIEW_SCAN_URL = "https://scanner.tradingview.com/morocco/scan";
const COLUMNS = ["name", "close", "change", "change_abs", "volume"] as const;

type TradingViewRow = {
  s: string;
  d: unknown[];
};

type TradingViewScanResponse = {
  totalCount?: number;
  data?: TradingViewRow[];
};

function asNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value;
}

export async function fetchTradingViewQuotes(
  tickers: string[]
): Promise<LiveQuote[]> {
  const uniqueTickers = Array.from(
    new Set(tickers.map((ticker) => ticker.toUpperCase().trim()).filter(Boolean))
  );
  if (uniqueTickers.length === 0) return [];

  const res = await fetch(TRADINGVIEW_SCAN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://www.tradingview.com",
      Referer: "https://www.tradingview.com/markets/stocks-morocco/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({
      symbols: {
        tickers: uniqueTickers.map(toTradingViewSymbol),
        query: { types: [] },
      },
      columns: COLUMNS,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`TradingView scanner returned HTTP ${res.status}`);
  }

  const payload = (await res.json()) as TradingViewScanResponse;
  const rows = payload.data ?? [];

  return rows
    .map((row): LiveQuote | null => {
      const [name, close, changePct, changeAbs, volume] = row.d;
      const price = asNumber(close);
      if (price === undefined) return null;
      const ticker =
        typeof name === "string" && name.trim()
          ? name.toUpperCase().trim()
          : fromTradingViewSymbol(row.s);
      const tradingViewSymbol = row.s || toTradingViewSymbol(ticker);

      return {
        ticker,
        price,
        changePct: asNumber(changePct),
        changeAbs: asNumber(changeAbs),
        volume: asNumber(volume),
        tradingViewSymbol,
      };
    })
    .filter((quote): quote is LiveQuote => quote !== null);
}
