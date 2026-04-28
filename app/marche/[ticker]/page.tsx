import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCompany,
  getQuote,
  marketQuotes,
  type MarketQuote,
} from "../../market-data";
import { buildSnapshot } from "../../market-history";
import { getMarketFeed } from "../../lib/quotes-source";
import { formatPostDate, getAllPosts, type Post } from "../../lib/posts";
import { toTradingViewSymbol } from "../../lib/tradingview-symbols";
import StockDetailClient from "./stock-detail-client";

export const revalidate = 900;

type RenderableQuote = MarketQuote & {
  changeAbs?: number;
  dayHigh?: number;
  dayLow?: number;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function findRelatedPosts(posts: Post[], ticker: string, companyName: string) {
  const tickerPattern = new RegExp(
    `(^|[^A-Z0-9])${escapeRegExp(ticker.toUpperCase())}([^A-Z0-9]|$)`,
    "i"
  );
  const normalizedCompanyName = normalizeText(companyName);

  return posts.filter((post) => {
    const content = post.content;
    return (
      tickerPattern.test(content) ||
      normalizeText(content).includes(normalizedCompanyName)
    );
  });
}

export function generateStaticParams() {
  return marketQuotes.map((q) => ({ ticker: q.ticker }));
}

export async function generateMetadata(props: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await props.params;
  const t = ticker.toUpperCase();
  const q = getQuote(t);
  return {
    title: q
      ? `${q.ticker} · ${q.name} - EinveX Market`
      : "Stock - EinveX",
    description: q
      ? `${q.name} (${q.ticker}) on the Casablanca Stock Exchange — price, momentum, volatility, AAOIFI Sharia screening.`
      : "Casablanca Stock Exchange detail",
  };
}

export default async function StockDetailPage(props: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: rawTicker } = await props.params;
  const ticker = rawTicker.toUpperCase();
  const company = getCompany(ticker);
  const fallbackQuote = getQuote(ticker);
  const feed = await getMarketFeed();
  const quote: RenderableQuote | undefined =
    feed.quotes.find((item) => item.ticker.toUpperCase() === ticker) ??
    fallbackQuote;
  const tradingViewSymbol =
    quote?.tradingViewSymbol ?? toTradingViewSymbol(ticker);

  if (!quote || !company) {
    notFound();
  }

  const snapshot = buildSnapshot(quote);
  const prevClose =
    quote.changeAbs !== undefined ? quote.price - quote.changeAbs : snapshot.prevClose;
  const relatedPosts = findRelatedPosts(getAllPosts(), ticker, quote.name);

  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container py-6 md:py-8">
        <div className="mb-4 flex items-center gap-2 text-[12px]">
          <Link
            href="/marche"
            style={{
              color: "var(--text-mute)",
              textDecoration: "none",
            }}
            className="hover:underline"
          >
            ← Market
          </Link>
          <span style={{ color: "var(--text-mute)" }}>/</span>
          <span style={{ color: "var(--text-dim)" }}>{quote.ticker}</span>
        </div>

        <StockDetailClient
          ticker={ticker}
          name={quote.name}
          sector={quote.sector}
          market={quote.market}
          tradingViewSymbol={tradingViewSymbol}
          description={company.description}
          note={company.note}
          shariaStatus={quote.shariaStatus}
          aaoifi={company.aaoifi}
          snapshot={{
            candles: snapshot.candles,
            sma20: snapshot.sma20,
            sma50: snapshot.sma50,
            last: snapshot.last,
            prevClose,
            changeAbs: quote.changeAbs ?? snapshot.changeAbs,
            changePct: quote.changePct,
            dayHigh: quote.dayHigh ?? snapshot.dayHigh,
            dayLow: quote.dayLow ?? snapshot.dayLow,
            high52w: snapshot.high52w,
            low52w: snapshot.low52w,
            avgVolume: quote.volume,
            volatilityPct: snapshot.volatilityPct,
            momentumPct: snapshot.momentumPct,
            trend: snapshot.trend,
          }}
        />

        <section className="mt-6 surface-card">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2
              className="text-[18px] font-semibold"
              style={{
                color: "var(--text)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Related News
            </h2>
            <Link
              href="/blog"
              className="text-[12px] font-medium"
              style={{ color: "#6ee7a7", textDecoration: "none" }}
            >
              View all news
            </Link>
          </div>

          {relatedPosts.length === 0 ? (
            <p
              className="mt-4 text-[13px]"
              style={{ color: "var(--text-dim)" }}
            >
              No related news yet.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-lg border p-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-mute)" }}
                  >
                    {formatPostDate(post.date)} · {post.readingMinutes} min read
                  </p>
                  <h3
                    className="mt-2 text-[15px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p
                    className="mt-2 text-[12.5px] leading-6"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {post.summary}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-3 inline-flex text-[12px] font-medium"
                    style={{ color: "#6ee7a7", textDecoration: "none" }}
                  >
                    Read news →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
