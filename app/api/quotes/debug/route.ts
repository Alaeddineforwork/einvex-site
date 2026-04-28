import { NextResponse } from "next/server";
import { Agent } from "undici";
import {
  debugFetchPageProps,
  debugFetchRaw,
  fetchBvcInstrumentList,
} from "../../../lib/bvc-scraper";

export const dynamic = "force-dynamic";

// Same relaxed-TLS dispatcher used by the scraper.
const tls = new Agent({ connect: { rejectUnauthorized: false } });
const ORIGIN = "https://www.casablanca-bourse.com";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

async function probe(path: string) {
  try {
    const res = await fetch(`${ORIGIN}${path}`, {
      headers: HEADERS,
      // @ts-expect-error undici dispatcher
      dispatcher: tls,
    });
    const text = await res.text();
    const isJson = res.headers.get("content-type")?.includes("json");
    return {
      path,
      status: res.status,
      contentType: res.headers.get("content-type"),
      bytes: text.length,
      preview: text.slice(0, 240),
      looksLikeData:
        isJson &&
        text.length > 100 &&
        /(ATW|IAM|cours|price|mnemo|ticker)/i.test(text),
    };
  } catch (err) {
    return { path, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  const mode = url.searchParams.get("mode");

  // mode=probe → run a battery of guesses against known Drupal patterns
  if (mode === "probe") {
    const ticker = (url.searchParams.get("ticker") ?? "ATW").toUpperCase();
    const nid = url.searchParams.get("nid"); // optional Drupal node id
    const candidates = [
      // Drupal REST + JSON:API patterns
      `/jsonapi/node/instrument`,
      `/jsonapi/node/instrument?filter[field_mnemonic]=${ticker}`,
      `/api/v1/instruments/${ticker}`,
      `/api/v1/instruments`,
      `/api/instruments/${ticker}`,
      `/api/instruments`,
      `/api/cours/${ticker}`,
      `/api/cours`,
      `/api/marche/actions`,
      // Drupal node REST
      ...(nid
        ? [
            `/node/${nid}?_format=json`,
            `/node/${nid}/json`,
            `/jsonapi/node/instrument/${nid}`,
          ]
        : []),
      // Probable backend gateway hosted as Drupal Custom routes
      `/fr/live-market/api/instruments/${ticker}`,
      `/api/cb/instruments/${ticker}`,
      // Search index
      `/jsonapi/index/instruments`,
    ];
    const results = await Promise.all(candidates.map(probe));
    return NextResponse.json({ ticker, nid, results });
  }

  if (mode === "raw" && path) {
    const result = await debugFetchRaw(path);
    return NextResponse.json(result);
  }

  if (path) {
    try {
      const pageProps = await debugFetchPageProps(path);
      return NextResponse.json({ ok: true, path, pageProps });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
  }

  try {
    const list = await fetchBvcInstrumentList();
    return NextResponse.json({ ok: true, count: list.length, list });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
