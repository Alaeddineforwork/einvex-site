"use client";

import { useEffect, useRef } from "react";
import { toTradingViewSymbol } from "../lib/tradingview-symbols";

/**
 * TradingView Ticker Tape Widget — scrolling live BVC prices.
 * Pass an array of CSE tickers; the mapping layer adds TradingView's exchange.
 *
 * Free, 15-min delayed.
 */
export default function TradingViewTickerTape({
  tickers = [
    "ATW", "IAM", "BCP", "BOA", "MNG", "CSR", "LBV",
    "TQM", "HPS", "MSA", "TGC", "SBM", "WAA", "GAZ",
    "CMA", "LHM", "MUT", "DRI", "ADH", "DHO", "NKL",
  ],
}: {
  tickers?: string[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.innerHTML = JSON.stringify({
      symbols: tickers.map((t) => ({
        proName: toTradingViewSymbol(t),
        title: t.toUpperCase(),
      })),
      showSymbolLogo: false,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "fr",
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [tickers]);

  return (
    <div
      className="tradingview-widget-container"
      style={{
        width: "100%",
        background: "var(--bg-elev)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div ref={ref} />
    </div>
  );
}
