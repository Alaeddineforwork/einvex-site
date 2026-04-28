import { getQuote, type MarketQuote } from "./market-data";

export type Candle = {
  /** UNIX seconds */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type SeriesPoint = {
  time: number; // UNIX seconds
  value: number;
};

export type StockSnapshot = {
  ticker: string;
  candles: Candle[];
  /** close-only series for sparklines / line charts */
  line: SeriesPoint[];
  /** running 20-day simple moving average */
  sma20: SeriesPoint[];
  /** running 50-day simple moving average */
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
  volatilityPct: number; // annualised stdev of daily log returns
  momentumPct: number; // 1-month price change %
  trend: "up" | "down" | "flat";
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

function gauss(rng: () => number): number {
  // Box-Muller
  const u1 = Math.max(rng(), 1e-9);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Generate a deterministic OHLC candle series ending at the most recent
 * full trading day (UTC). Uses geometric Brownian motion seeded by the
 * ticker so reloads stay stable until the codebase is regenerated.
 */
export function generateCandles(
  ticker: string,
  endPrice: number,
  days = 252
): Candle[] {
  const rng = mulberry32(hashString(ticker) ^ 0xa11ce);

  // Annualised drift + vol vary slightly per ticker for realism.
  const baseDrift = 0.06; // ~6% / yr
  const driftJitter = (rng() - 0.5) * 0.12; // -6% .. +6%
  const baseVol = 0.18 + rng() * 0.18; // 18% .. 36%
  const muDaily = (baseDrift + driftJitter) / 252;
  const sigmaDaily = baseVol / Math.sqrt(252);

  // Build by stepping FORWARD from a synthetic start price, then rescale
  // so the final close lands at endPrice. That way the latest candle
  // matches the marketQuote price exactly.
  const closes: number[] = [];
  let price = 1; // arbitrary; we'll rescale
  for (let i = 0; i < days; i += 1) {
    const z = gauss(rng);
    price = price * Math.exp(muDaily - 0.5 * sigmaDaily * sigmaDaily + sigmaDaily * z);
    closes.push(price);
  }

  // Rescale so final close = endPrice
  const scale = endPrice / closes[closes.length - 1];
  const scaledCloses = closes.map((c) => c * scale);

  // Build candles. Wick = close * sigmaDaily * 1..2.5 around each bar.
  const today = new Date();
  // Snap to most recent UTC midnight
  today.setUTCHours(0, 0, 0, 0);
  const candles: Candle[] = [];

  let prev = scaledCloses[0];
  for (let i = 0; i < scaledCloses.length; i += 1) {
    const close = scaledCloses[i];
    const open = i === 0 ? close * (1 - sigmaDaily * gauss(rng) * 0.5) : prev;
    const wickRange = Math.abs(close - open) + close * sigmaDaily * (0.5 + rng());
    const high = Math.max(open, close) + wickRange * (0.3 + rng() * 0.7);
    const low = Math.min(open, close) - wickRange * (0.3 + rng() * 0.7);
    const volume = Math.round(50_000 + rng() * 800_000);

    const dayOffset = scaledCloses.length - 1 - i;
    const time = Math.floor(
      (today.getTime() - dayOffset * MS_PER_DAY) / 1000
    );

    candles.push({
      time,
      open: round(open),
      high: round(Math.max(high, Math.max(open, close))),
      low: round(Math.max(0.01, Math.min(low, Math.min(open, close)))),
      close: round(close),
      volume,
    });

    prev = close;
  }

  return candles;
}

function round(v: number) {
  return Math.round(v * 100) / 100;
}

function sma(closes: number[], window: number): number[] {
  const out: number[] = new Array(closes.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < closes.length; i += 1) {
    sum += closes[i];
    if (i >= window) sum -= closes[i - window];
    if (i >= window - 1) out[i] = sum / window;
  }
  return out;
}

function annualisedVol(closes: number[]): number {
  if (closes.length < 5) return 0;
  const rets: number[] = [];
  for (let i = 1; i < closes.length; i += 1) {
    rets.push(Math.log(closes[i] / closes[i - 1]));
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance =
    rets.reduce((acc, r) => acc + (r - mean) * (r - mean), 0) / rets.length;
  return Math.sqrt(variance) * Math.sqrt(252);
}

export function buildSnapshot(quote: MarketQuote): StockSnapshot {
  const candles = generateCandles(quote.ticker, quote.price, 252);
  const closes = candles.map((c) => c.close);
  const last = closes[closes.length - 1];
  const prevClose = closes.length > 1 ? closes[closes.length - 2] : last;
  const sma20arr = sma(closes, 20);
  const sma50arr = sma(closes, 50);

  const high52w = Math.max(...candles.map((c) => c.high));
  const low52w = Math.min(...candles.map((c) => c.low));
  const lastCandle = candles[candles.length - 1];
  const avgVolume =
    candles.slice(-20).reduce((s, c) => s + c.volume, 0) / Math.min(candles.length, 20);

  const monthAgoIdx = Math.max(0, candles.length - 22);
  const monthAgoClose = closes[monthAgoIdx];
  const momentumPct = monthAgoClose > 0 ? ((last - monthAgoClose) / monthAgoClose) * 100 : 0;

  const volatilityPct = annualisedVol(closes) * 100;

  const sma20Last = sma20arr[sma20arr.length - 1];
  const sma50Last = sma50arr[sma50arr.length - 1];
  let trend: "up" | "down" | "flat" = "flat";
  if (Number.isFinite(sma20Last) && Number.isFinite(sma50Last)) {
    if (sma20Last > sma50Last * 1.01) trend = "up";
    else if (sma20Last < sma50Last * 0.99) trend = "down";
  }

  const line: SeriesPoint[] = candles.map((c) => ({ time: c.time, value: c.close }));
  const sma20: SeriesPoint[] = candles
    .map((c, i) => ({ time: c.time, value: sma20arr[i] }))
    .filter((p) => Number.isFinite(p.value));
  const sma50: SeriesPoint[] = candles
    .map((c, i) => ({ time: c.time, value: sma50arr[i] }))
    .filter((p) => Number.isFinite(p.value));

  return {
    ticker: quote.ticker,
    candles,
    line,
    sma20,
    sma50,
    last,
    prevClose,
    changeAbs: last - prevClose,
    changePct: prevClose > 0 ? ((last - prevClose) / prevClose) * 100 : 0,
    dayHigh: lastCandle.high,
    dayLow: lastCandle.low,
    high52w,
    low52w,
    avgVolume,
    volatilityPct,
    momentumPct,
    trend,
  };
}

const cache = new Map<string, StockSnapshot>();

export function getSnapshot(ticker: string): StockSnapshot | undefined {
  const key = ticker.toUpperCase().trim();
  if (cache.has(key)) return cache.get(key);
  const quote = getQuote(key);
  if (!quote) return undefined;
  const snap = buildSnapshot(quote);
  cache.set(key, snap);
  return snap;
}

/** Compact close-only series for sparklines (default last 60 trading days). */
export function getSparkline(ticker: string, days = 60): SeriesPoint[] {
  const snap = getSnapshot(ticker);
  if (!snap) return [];
  return snap.line.slice(-days);
}

/**
 * Return points (x: 0..1, y: 0..1) suitable for a small inline SVG sparkline.
 */
export function sparklinePath(values: number[], width = 80, height = 24): {
  d: string;
  up: boolean;
} {
  if (values.length === 0) return { d: "", up: true };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1e-9);
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const d = `M${pts.join(" L")}`;
  const up = values[values.length - 1] >= values[0];
  return { d, up };
}
