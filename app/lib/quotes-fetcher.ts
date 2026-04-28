/**
 * Live-quotes fetcher.
 *
 * TradingView is the preferred source. If this throws, quotes-source falls
 * back to deterministic mock data, so the app always renders something.
 */

import { marketQuotes } from "../market-data";
import { fetchTradingViewQuotes } from "./tradingview-quotes";

export interface LiveQuote {
  ticker: string;
  price: number;
  changePct?: number;
  changeAbs?: number;
  volume?: number;
  dayHigh?: number;
  dayLow?: number;
  tradingViewSymbol?: string;
}

export async function fetchLiveQuotes(): Promise<LiveQuote[]> {
  return fetchTradingViewQuotes(marketQuotes.map((quote) => quote.ticker));
}

