"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { marketQuotes, type MarketQuote } from "../market-data";

type TickerQuote = MarketQuote & {
  changeAbs?: number;
};

type QuoteFeedResponse = {
  quotes?: TickerQuote[];
};

function mergeQuoteFallbacks(liveQuotes: TickerQuote[]): TickerQuote[] {
  const liveByTicker = new Map(
    liveQuotes.map((quote) => [quote.ticker.toUpperCase(), quote])
  );

  return marketQuotes.map((fallback) => {
    const live = liveByTicker.get(fallback.ticker);
    return live ? { ...fallback, ...live } : fallback;
  });
}

/**
 * Scrolling ticker tape - duplicates the list once for a seamless loop
 * (CSS marquee animation in globals.css).
 *
 * Picks the most-active 24 tickers by volume so the tape doesn't get
 * too crowded.
 */
export default function TickerTape() {
  const [quotes, setQuotes] = useState<TickerQuote[]>(marketQuotes);

  useEffect(() => {
    let disposed = false;

    async function loadQuotes() {
      try {
        const res = await fetch("/api/quotes", { cache: "no-store" });
        if (!res.ok) return;
        const feed = (await res.json()) as QuoteFeedResponse;
        if (!disposed && Array.isArray(feed.quotes) && feed.quotes.length > 0) {
          setQuotes(mergeQuoteFallbacks(feed.quotes));
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

  const items = useMemo(() => {
    return [...quotes].sort((a, b) => b.volume - a.volume).slice(0, 24);
  }, [quotes]);

  const loop = [...items, ...items];

  return (
    <div className="ticker-tape" aria-label="Live ticker tape">
      <div className="ticker-tape-track">
        {loop.map((q, i) => {
          const cls = q.changePct >= 0 ? "ch-up" : "ch-down";
          const arrow = q.changePct >= 0 ? "▲" : "▼";
          const changeAbs = q.changeAbs ?? deriveChangeAbs(q.price, q.changePct);

          return (
            <Link
              key={`${q.ticker}-${i}`}
              href={`/marche/${q.ticker}`}
              className="ticker-item"
              style={{ textDecoration: "none" }}
            >
              <span className="tk">{q.ticker}</span>
              <span className="px">{q.price.toFixed(2)}</span>
              <span className={cls}>
                {arrow} {formatSigned(changeAbs)} ({formatSigned(q.changePct)}%)
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function deriveChangeAbs(price: number, changePct: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(changePct)) return 0;
  const previous = price / (1 + changePct / 100);
  const changeAbs = price - previous;
  return Number.isFinite(changeAbs) ? changeAbs : 0;
}

function formatSigned(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

