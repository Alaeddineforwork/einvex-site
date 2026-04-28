"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * TradingView Advanced Chart embed - free, 15-min delayed CSE data.
 * Uses TradingView's official widget endpoint, which renders CSE symbols reliably in iframes.
 */
export default function TradingViewChart({
  ticker,
  tradingViewSymbol,
  height = 480,
}: {
  ticker: string;
  tradingViewSymbol?: string;
  height?: number;
}) {
  const normalizedSymbol = tradingViewSymbol?.toUpperCase().trim() ?? "";
  const hasValidSymbol = /^[A-Z0-9_]+:[A-Z0-9._-]+$/.test(normalizedSymbol);

  const tradingViewUrl = hasValidSymbol
    ? `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
        normalizedSymbol,
      )}`
    : "https://www.tradingview.com/markets/stocks-morocco/";

  if (!hasValidSymbol) {
    return (
      <ChartFallback
        height={height}
        symbol={normalizedSymbol || `${ticker.toUpperCase()} (unmapped)`}
        tradingViewUrl={tradingViewUrl}
      />
    );
  }

  return (
    <ChartFrame
      key={normalizedSymbol}
      ticker={ticker}
      height={height}
      tradingViewSymbol={normalizedSymbol}
      tradingViewUrl={tradingViewUrl}
    />
  );
}

function ChartFrame({
  ticker,
  height,
  tradingViewSymbol,
  tradingViewUrl,
}: {
  ticker: string;
  height: number;
  tradingViewSymbol: string;
  tradingViewUrl: string;
}) {
  const [timedOut, setTimedOut] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setTimedOut(true);
    }, 12_000);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const src = useMemo(() => {
    const config = {
      autosize: true,
      symbol: tradingViewSymbol,
      interval: "D",
      timezone: "Africa/Casablanca",
      theme: "dark",
      style: "1",
      locale: "fr",
      withdateranges: true,
      hide_side_toolbar: true,
      allow_symbol_change: false,
      save_image: true,
      backgroundColor: "#0d1218",
      gridColor: "rgba(255, 255, 255, 0.06)",
      support_host: "https://www.tradingview.com",
    };

    return `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=fr#${encodeURIComponent(
      JSON.stringify(config),
    )}`;
  }, [tradingViewSymbol]);

  return (
    <div
      className="tradingview-widget-container"
      style={{
        width: "100%",
        height,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "var(--bg-elev)",
        position: "relative",
      }}
    >
      <iframe
        title={`${ticker.toUpperCase()} TradingView chart`}
        src={src}
        loading="eager"
        onLoad={() => {
          setLoaded(true);
          setTimedOut(false);
          if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          background: "var(--bg-elev)",
        }}
        allowFullScreen
      />
      {timedOut && !loaded && (
        <ChartFallback
          height={height}
          symbol={tradingViewSymbol}
          tradingViewUrl={tradingViewUrl}
          overlay
        />
      )}
    </div>
  );
}

function ChartFallback({
  height,
  symbol,
  tradingViewUrl,
  overlay = false,
}: {
  height: number;
  symbol: string;
  tradingViewUrl: string;
  overlay?: boolean;
}) {
  return (
    <div
      className={overlay ? "absolute inset-0" : ""}
      style={{
        width: "100%",
        height,
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "var(--bg-elev)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div className="text-center">
        <p
          className="text-[14px] font-semibold"
          style={{ color: "var(--text)" }}
        >
          Live chart temporarily unavailable
        </p>
        <p className="mt-2 num text-[12px]" style={{ color: "var(--text-mute)" }}>
          {symbol}
        </p>
        <a
          href={tradingViewUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost mt-4 inline-flex"
          style={{ textDecoration: "none" }}
        >
          Open on TradingView
        </a>
      </div>
    </div>
  );
}
