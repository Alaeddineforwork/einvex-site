import { Agent } from "undici";

const BVC_ORIGIN = "https://www.casablanca-bourse.com";

/**
 * BVC's certificate chain isn't fully recognized by Node's bundled CA
 * store on some Windows / corporate networks (UNABLE_TO_VERIFY_LEAF_SIGNATURE).
 * We scope a relaxed-TLS dispatcher to BVC fetches only — every other
 * outbound HTTP (Clerk, Google fonts, etc.) keeps full TLS verification.
 */
const bvcDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

const COMMON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "sec-ch-ua":
    '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

async function bvcFetch(path: string): Promise<Response> {
  const url = `${BVC_ORIGIN}${path}`;
  return fetch(url, {
    headers: COMMON_HEADERS,
    redirect: "follow",
    // undici-specific: scope insecure TLS to this request only
    // @ts-expect-error - `dispatcher` is a Node/undici extension to fetch
    dispatcher: bvcDispatcher,
  });
}

interface NextData {
  props: { pageProps: unknown };
  buildId?: string;
}

function describeError(err: unknown): string {
  if (err instanceof Error) {
    const cause = (err as Error & { cause?: unknown }).cause;
    if (cause instanceof Error) {
      const code = (cause as Error & { code?: string }).code;
      return `${err.message} | cause: ${cause.name}: ${cause.message}` +
        (code ? ` (code=${code})` : "");
    }
    if (cause) return `${err.message} | cause: ${JSON.stringify(cause)}`;
    return `${err.name}: ${err.message}`;
  }
  return String(err);
}

async function fetchNextData(path: string): Promise<NextData> {
  let res: Response;
  try {
    res = await bvcFetch(path);
  } catch (err) {
    throw new Error(`fetch ${BVC_ORIGIN}${path} → ${describeError(err)}`);
  }
  if (!res.ok) {
    throw new Error(`fetch ${BVC_ORIGIN}${path} → HTTP ${res.status}`);
  }
  const html = await res.text();
  const cheerio = await import("cheerio");
  const $ = cheerio.load(html);
  const raw = $("script#__NEXT_DATA__").contents().first().text();
  if (!raw) {
    throw new Error(
      `fetch ${BVC_ORIGIN}${path} → no __NEXT_DATA__ script (got ${html.length} bytes)`
    );
  }
  return JSON.parse(raw) as NextData;
}

interface RawInstrument {
  ticker: string;
  price: number;
  changePct: number;
  volume: number;
  dayHigh?: number;
  dayLow?: number;
}

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v
      .replace(/\s/g, "")
      .replace(/[  ]/g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.\-]/g, "");
    const n = Number(cleaned);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function asString(v: unknown): string | undefined {
  if (typeof v === "string") return v.trim();
  return undefined;
}

const TICKER_KEYS = ["mnemo", "code", "symbol", "ticker", "Mnemo", "Code"];
const PRICE_KEYS = [
  "lastPrice", "cours", "price", "dernierCours", "last", "Cours",
];
const CHANGE_KEYS = [
  "variation", "change", "changePercent", "percentChange",
  "Variation", "var",
];
const VOLUME_KEYS = ["volume", "qte", "quantite", "Volume", "Quantite"];
const HIGH_KEYS = ["high", "plusHaut", "haut", "High", "PlusHaut"];
const LOW_KEYS = ["low", "plusBas", "bas", "Low", "PlusBas"];

function pick(obj: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    if (k in obj && obj[k] !== null && obj[k] !== undefined) return obj[k];
  }
  return undefined;
}

function asInstrument(obj: Record<string, unknown>): RawInstrument | null {
  const ticker = asString(pick(obj, TICKER_KEYS));
  const price = asNumber(pick(obj, PRICE_KEYS));
  if (!ticker || price === undefined) return null;
  const changePct = asNumber(pick(obj, CHANGE_KEYS)) ?? 0;
  const volume = asNumber(pick(obj, VOLUME_KEYS)) ?? 0;
  return {
    ticker: ticker.toUpperCase(),
    price,
    changePct,
    volume,
    dayHigh: asNumber(pick(obj, HIGH_KEYS)),
    dayLow: asNumber(pick(obj, LOW_KEYS)),
  };
}

function collectInstruments(node: unknown, out: RawInstrument[] = []): RawInstrument[] {
  if (Array.isArray(node)) {
    for (const item of node) collectInstruments(item, out);
    return out;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const inst = asInstrument(obj);
    if (inst) {
      out.push(inst);
    } else {
      for (const k of Object.keys(obj)) collectInstruments(obj[k], out);
    }
  }
  return out;
}

export async function fetchBvcInstrumentList(): Promise<RawInstrument[]> {
  const data = await fetchNextData("/fr/live-market/marche-actions-groupement");
  const found = collectInstruments(data.props.pageProps);
  const seen = new Map<string, RawInstrument>();
  for (const row of found) if (!seen.has(row.ticker)) seen.set(row.ticker, row);
  return Array.from(seen.values());
}

export async function fetchBvcInstrumentDetail(
  ticker: string
): Promise<RawInstrument | null> {
  const data = await fetchNextData(
    `/fr/live-market/instruments/${ticker.toUpperCase()}`
  );
  const found = collectInstruments(data.props.pageProps);
  return found.find((r) => r.ticker === ticker.toUpperCase()) ?? null;
}

export async function debugFetchPageProps(path: string): Promise<unknown> {
  const data = await fetchNextData(path);
  return data.props.pageProps;
}

export async function debugFetchRaw(path: string) {
  try {
    const res = await bvcFetch(path);
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      bytes: text.length,
      preview: text.slice(0, 500),
      hasNextData: text.includes("__NEXT_DATA__"),
    };
  } catch (err) {
    return { ok: false, error: describeError(err) };
  }
}

export type { RawInstrument };
