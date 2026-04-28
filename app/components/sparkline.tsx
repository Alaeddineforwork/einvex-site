"use client";

import { useMemo } from "react";
import { getSparkline, sparklinePath } from "../market-history";

export default function Sparkline({
  ticker,
  width = 96,
  height = 28,
  days = 60,
}: {
  ticker: string;
  width?: number;
  height?: number;
  days?: number;
}) {
  const { d, up } = useMemo(() => {
    const series = getSparkline(ticker, days).map((p) => p.value);
    return sparklinePath(series, width, height);
  }, [ticker, width, height, days]);

  if (!d) return null;
  const stroke = up ? "#4ade80" : "#f87171";
  const fill = up ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)";

  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      role="img"
      aria-label={`${ticker} sparkline`}
    >
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={fill} />
      <path d={d} stroke={stroke} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
