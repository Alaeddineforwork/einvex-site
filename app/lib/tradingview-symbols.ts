const TRADINGVIEW_EXCHANGE = "CSEMA";

/**
 * Local EinveX tickers mostly match TradingView's Casablanca symbols.
 * Keep this map as the single place for exceptions if a local ticker differs.
 */
const SYMBOL_OVERRIDES: Record<string, string> = {};

export function toTradingViewSymbol(ticker: string): string {
  const normalized = ticker.toUpperCase().trim();
  return SYMBOL_OVERRIDES[normalized] ?? `${TRADINGVIEW_EXCHANGE}:${normalized}`;
}

export function fromTradingViewSymbol(symbol: string): string {
  return symbol.split(":").pop()?.toUpperCase().trim() ?? symbol.toUpperCase();
}

