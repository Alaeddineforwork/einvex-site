import {
  companies,
  companyScreeningData,
  formatScreeningStatus,
  type CompanyScreeningData,
  type FinalStatus,
} from "./screening-data";
import { toTradingViewSymbol } from "./lib/tradingview-symbols";

export type MarketQuote = {
  ticker: string;
  name: string;
  sector: string;
  market: string;
  shariaStatus: FinalStatus;
  price: number; // MAD
  changePct: number; // today's change, %
  volume: number; // mock
  currency: "MAD";
  tradingViewSymbol: string;
};

// Deterministic pseudo-random generator seeded by ticker string.
// Stable across reloads — easy to swap for a real quotes API later.
function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mockQuoteFor(company: CompanyScreeningData): MarketQuote {
  const rng = mulberry32(hashString(company.ticker));
  // Price band 40 – 2000 MAD, log-distributed for realism
  const logMin = Math.log(40);
  const logMax = Math.log(2000);
  const price = Math.exp(logMin + rng() * (logMax - logMin));
  const changePct = (rng() - 0.5) * 6; // -3% .. +3%
  const volume = Math.round(500 + rng() * 250_000);

  return {
    ticker: company.ticker,
    name: company.name,
    sector: company.sector,
    market: company.market,
    shariaStatus: formatScreeningStatus(company.aaoifi.status),
    price: Math.round(price * 100) / 100,
    changePct: Math.round(changePct * 100) / 100,
    volume,
    currency: "MAD",
    tradingViewSymbol: toTradingViewSymbol(company.ticker),
  };
}

export const marketQuotes: MarketQuote[] = companies.map(mockQuoteFor);

export const quotesByTicker: Record<string, MarketQuote> = Object.fromEntries(
  marketQuotes.map((quote) => [quote.ticker, quote])
);

export function getQuote(ticker: string): MarketQuote | undefined {
  return quotesByTicker[ticker];
}

export function getCompany(ticker: string): CompanyScreeningData | undefined {
  return companyScreeningData[ticker];
}

export function formatMad(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPct(value: number, digits = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}
