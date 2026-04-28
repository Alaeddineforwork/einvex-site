"use client";

import { useEffect, useRef } from "react";

export interface AdminMetrics {
  totalSignups: number;
  activeLast7d: number;
  portfoliosCreated: number;
  topTickers: { ticker: string; views: number }[];
  recentSignups: { email: string; date: string }[];
  pageviews7d: { date: string; views: number }[];
}

export default function AdminClient({
  metrics,
  adminEmail,
}: {
  metrics: AdminMetrics;
  adminEmail: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total signups"
          value={fmt(metrics.totalSignups)}
          sub="All-time accounts"
        />
        <KpiCard
          label="Active (7d)"
          value={fmt(metrics.activeLast7d)}
          sub="Sessions in last 7 days"
          tone="up"
        />
        <KpiCard
          label="Portfolios created"
          value={fmt(metrics.portfoliosCreated)}
          sub="Distinct localStorage initialisations"
        />
        <KpiCard
          label="Logged in as"
          value={adminEmail || "—"}
          sub="Admin allowlist"
          mono
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Pageviews chart */}
        <div className="surface-card">
          <div className="flex items-center justify-between">
            <p className="section-label">Pageviews · last 7 days</p>
            <span className="chip chip-neutral">Plausible · pending</span>
          </div>
          <PageviewsChart data={metrics.pageviews7d} />
        </div>

        {/* Top tickers */}
        <div className="surface-card">
          <div className="flex items-center justify-between">
            <p className="section-label">Top tickers viewed</p>
            <span className="chip chip-neutral">events · pending</span>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {metrics.topTickers.length === 0 ? (
              <li
                className="rounded-lg border p-4 text-center text-[12.5px]"
                style={{
                  borderColor: "var(--line)",
                  color: "var(--text-mute)",
                  background: "var(--bg-elev)",
                }}
              >
                No event data yet. Wire ticker view tracking to populate.
              </li>
            ) : (
              metrics.topTickers.map((t, i) => (
                <li
                  key={t.ticker}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ background: "var(--bg-elev)" }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="num text-[11px]"
                      style={{ color: "var(--text-mute)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ticker-cell">{t.ticker}</span>
                  </span>
                  <span className="num text-[12.5px]">{fmt(t.views)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Recent signups */}
      <div className="surface-card">
        <div className="flex items-center justify-between">
          <p className="section-label">Recent signups</p>
          <span className="chip chip-neutral">Clerk · pending API</span>
        </div>
        {metrics.recentSignups.length === 0 ? (
          <p
            className="mt-4 rounded-lg border p-6 text-center text-[12.5px]"
            style={{
              borderColor: "var(--line)",
              color: "var(--text-mute)",
              background: "var(--bg-elev)",
            }}
          >
            No signups synced yet. Once the Clerk webhook is connected, new
            user emails and signup dates will land here.
          </p>
        ) : (
          <table className="data-table mt-3 min-w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentSignups.map((s) => (
                <tr key={s.email + s.date}>
                  <td className="text-[13px]">{s.email}</td>
                  <td
                    className="text-right num text-[12.5px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {s.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Roadmap card */}
      <div className="surface-subtle">
        <p className="section-label">Wiring this dashboard up</p>
        <ol
          className="mt-3 list-inside list-decimal space-y-2 text-[13px] leading-7"
          style={{ color: "var(--text-dim)" }}
        >
          <li>
            <strong style={{ color: "var(--text)" }}>Plausible</strong> — drop
            the script tag in <code className="mono">app/layout.tsx</code> and
            fetch <code className="mono">/api/v1/stats</code> from the server.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>Clerk webhook</strong> —
            POST <code className="mono">user.created</code> events to{" "}
            <code className="mono">/api/clerk/webhook</code> and persist to a
            DB (Postgres / Supabase / Neon).
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>Ticker telemetry</strong> —
            log a Plausible custom event from{" "}
            <code className="mono">/marche/[ticker]</code> on view, then group
            by goal in the Stats API.
          </li>
        </ol>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  tone,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "neutral";
  mono?: boolean;
}) {
  const color =
    tone === "up"
      ? "#4ade80"
      : tone === "down"
        ? "#f87171"
        : "var(--text)";
  return (
    <div className="surface-card">
      <p className="section-label">{label}</p>
      <p
        className={
          "mt-2 text-2xl font-semibold tracking-tight " +
          (mono ? "ticker-cell" : "num")
        }
        style={{ color, fontSize: mono ? 14 : undefined }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="mt-1 text-[11.5px]"
          style={{ color: "var(--text-mute)" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-MA").format(n);
}

/* --- Pageviews mini chart (Chart.js, lazy-loaded) --- */

type ChartCtor = new (
  ctx: CanvasRenderingContext2D,
  config: Record<string, unknown>
) => { destroy: () => void };

function PageviewsChart({ data }: { data: { date: string; views: number }[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    let disposed = false;
    let chart: { destroy: () => void } | undefined;

    (async () => {
      const mod = (await import("chart.js/auto")) as unknown as {
        default: ChartCtor;
      };
      const Chart = mod.default;
      if (disposed || !ref.current) return;
      const ctx = ref.current.getContext("2d");
      if (!ctx) return;

      const grad = ctx.createLinearGradient(0, 0, 0, 220);
      grad.addColorStop(0, "rgba(34,197,94,0.30)");
      grad.addColorStop(1, "rgba(34,197,94,0.00)");

      const labels = data.length > 0 ? data.map((d) => d.date.slice(5)) : [];
      const values = data.length > 0 ? data.map((d) => d.views) : [];

      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Pageviews",
              data: values,
              borderColor: "#22c55e",
              backgroundColor: grad,
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                color: "#6b7682",
                font: { family: "JetBrains Mono, monospace", size: 10 },
              },
              grid: { color: "rgba(255,255,255,0.04)" },
            },
            y: {
              ticks: {
                color: "#6b7682",
                font: { family: "JetBrains Mono, monospace", size: 10 },
              },
              grid: { color: "rgba(255,255,255,0.04)" },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0d1218",
              borderColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              titleColor: "#e6e8eb",
              bodyColor: "#e6e8eb",
            },
          },
        },
      });
    })();

    return () => {
      disposed = true;
      if (chart) chart.destroy();
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div
        className="mt-4 flex h-[220px] items-center justify-center rounded-lg border text-[12.5px]"
        style={{
          borderColor: "var(--line)",
          background: "var(--bg-elev)",
          color: "var(--text-mute)",
        }}
      >
        No analytics events yet — connect Plausible to populate this chart.
      </div>
    );
  }

  return (
    <div className="mt-4" style={{ position: "relative", height: 220, width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}
