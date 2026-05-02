"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "einvex_portfolio_v1";
export const FIXED_BROKER_COMMISSION_RATE = 0.01;
export const FIXED_TAX_RATE = 0.15;

export type Holding = {
  ticker: string;
  shares: number;
  avgPrice: number; // MAD per share — weighted avg cost
  firstBuyDate: string;
  lastUpdate: string;
};

export type Trade = {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  ticker: string;
  type: "buy" | "sell";
  shares: number;
  price: number; // per share
  fundingFromPot: number; // MAD drawn from reinvestment pot (buys only)
  brokerCommissionRate?: number; // decimal, e.g. 0.01 = 1%
  commissionAmount?: number;
  taxRate?: number; // decimal, e.g. 0.15 = 15%
  taxAmount?: number;
  grossAmount?: number;
  netAmount?: number;
  realizedPL?: number;
  note?: string;
};

export type Dividend = {
  id: string;
  date: string;
  ticker: string;
  amount: number;
  purifyPct: number;
  purifiedAmount: number;
  note?: string;
};

export type PortfolioState = {
  holdings: Holding[];
  trades: Trade[];
  dividends: Dividend[];
  reinvestmentPot: number;
  externalCashInvested: number;
};

export const emptyPortfolio: PortfolioState = {
  holdings: [],
  trades: [],
  dividends: [],
  reinvestmentPot: 0,
  externalCashInvested: 0,
};

function loadState(): PortfolioState {
  if (typeof window === "undefined") return emptyPortfolio;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPortfolio;
    const parsed = JSON.parse(raw) as Partial<PortfolioState>;
    return {
      holdings: parsed.holdings ?? [],
      trades: parsed.trades ?? [],
      dividends: parsed.dividends ?? [],
      reinvestmentPot: parsed.reinvestmentPot ?? 0,
      externalCashInvested: parsed.externalCashInvested ?? 0,
    };
  } catch {
    return emptyPortfolio;
  }
}

function saveState(state: PortfolioState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function normalizeState(state: Partial<PortfolioState>): PortfolioState {
  return {
    holdings: state.holdings ?? [],
    trades: state.trades ?? [],
    dividends: state.dividends ?? [],
    reinvestmentPot: state.reinvestmentPot ?? 0,
    externalCashInvested: state.externalCashInvested ?? 0,
  };
}

function isEmptyState(state: PortfolioState): boolean {
  return (
    state.holdings.length === 0 &&
    state.trades.length === 0 &&
    state.dividends.length === 0 &&
    state.reinvestmentPot === 0 &&
    state.externalCashInvested === 0
  );
}

async function loadRemoteState(): Promise<PortfolioState | null> {
  console.log("[portfolio-store] GET /api/portfolio start");
  const response = await fetch("/api/portfolio", {
    cache: "no-store",
    credentials: "include",
  });
  if (!response.ok) {
    console.error("[portfolio-store] GET /api/portfolio failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Portfolio load failed.");
  }
  const body = (await response.json()) as { portfolio?: Partial<PortfolioState> | null };
  console.log("[portfolio-store] GET /api/portfolio succeeded", {
    hasPortfolio: Boolean(body.portfolio),
  });
  return body.portfolio ? normalizeState(body.portfolio) : null;
}

async function saveRemoteState(state: PortfolioState): Promise<void> {
  console.log("[portfolio-store] PUT /api/portfolio start", {
    trades: state.trades.length,
    holdings: state.holdings.length,
    dividends: state.dividends.length,
  });
  const response = await fetch("/api/portfolio", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portfolio: state }),
  });
  if (!response.ok) {
    console.error("[portfolio-store] PUT /api/portfolio failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Portfolio save failed.");
  }
  console.log("[portfolio-store] PUT /api/portfolio succeeded");
}

async function deleteRemoteState(): Promise<void> {
  console.log("[portfolio-store] DELETE /api/portfolio start");
  const response = await fetch("/api/portfolio", {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    console.error("[portfolio-store] DELETE /api/portfolio failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Portfolio delete failed.");
  }
  console.log("[portfolio-store] DELETE /api/portfolio succeeded");
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function isModernTrade(trade: Trade): boolean {
  return trade.grossAmount !== undefined || trade.netAmount !== undefined;
}

function sortTradesChronologically(trades: Trade[]): Trade[] {
  return trades
    .map((trade, index) => ({ trade, index }))
    .sort((left, right) => {
      const byDate = left.trade.date.localeCompare(right.trade.date);
      return byDate !== 0 ? byDate : right.index - left.index;
    })
    .map((item) => item.trade);
}

export function rebuildPortfolioFromTrades(
  trades: Trade[],
  dividends: Dividend[] = []
): PortfolioState {
  let holdings: Holding[] = [];
  let reinvestmentPot = dividends.reduce(
    (sum, dividend) => sum + (dividend.amount - dividend.purifiedAmount),
    0
  );
  let externalCashInvested = 0;
  const rebuiltTrades: Trade[] = [];

  for (const trade of sortTradesChronologically(trades)) {
    const ticker = trade.ticker.toUpperCase().trim();
    const shares = Math.max(0, trade.shares);
    const price = trade.price;
    const modern = isModernTrade(trade);

    if (trade.type === "buy") {
      const brokerCommissionRate =
        trade.brokerCommissionRate ?? (modern ? FIXED_BROKER_COMMISSION_RATE : 0);
      const grossAmount = shares * price;
      const commissionAmount = grossAmount * brokerCommissionRate;
      const netAmount = grossAmount + commissionAmount;
      const fundingFromPot = Math.min(
        Math.max(0, trade.fundingFromPot ?? 0),
        reinvestmentPot,
        netAmount
      );
      const external = netAmount - fundingFromPot;
      const existing = holdings.find((h) => h.ticker === ticker);

      if (shares > 0) {
        if (existing) {
          const newShares = existing.shares + shares;
          const newAvg =
            (existing.shares * existing.avgPrice + netAmount) / newShares;
          holdings = holdings.map((h) =>
            h.ticker === ticker
              ? { ...h, shares: newShares, avgPrice: newAvg, lastUpdate: trade.date }
              : h
          );
        } else {
          holdings = [
            ...holdings,
            {
              ticker,
              shares,
              avgPrice: netAmount / shares,
              firstBuyDate: trade.date,
              lastUpdate: trade.date,
            },
          ];
        }
      }

      reinvestmentPot -= fundingFromPot;
      externalCashInvested += external;
      rebuiltTrades.push({
        ...trade,
        ticker,
        shares,
        fundingFromPot,
        commissionAmount,
        taxAmount: trade.taxAmount ?? 0,
        grossAmount: modern ? grossAmount : trade.grossAmount,
        netAmount: modern ? netAmount : trade.netAmount,
        realizedPL: undefined,
      });
      continue;
    }

    const existing = holdings.find((h) => h.ticker === ticker);
    const sellShares = existing ? Math.min(shares, existing.shares) : 0;
    const brokerCommissionRate =
      trade.brokerCommissionRate ?? (modern ? FIXED_BROKER_COMMISSION_RATE : 0);
    const taxRate = trade.taxRate ?? (modern ? FIXED_TAX_RATE : 0);
    const grossAmount = sellShares * price;
    const commissionAmount = grossAmount * brokerCommissionRate;
    const costBasis = existing ? sellShares * existing.avgPrice : 0;
    const netSellBeforeTax = grossAmount - commissionAmount;
    const taxAmount = Math.max(netSellBeforeTax - costBasis, 0) * taxRate;
    const netAmount = netSellBeforeTax - taxAmount;
    const realizedPL =
      modern && sellShares > 0 ? netAmount - costBasis : trade.realizedPL;

    if (existing && sellShares > 0) {
      const remaining = existing.shares - sellShares;
      holdings =
        remaining > 0
          ? holdings.map((h) =>
              h.ticker === ticker
                ? { ...h, shares: remaining, lastUpdate: trade.date }
                : h
            )
          : holdings.filter((h) => h.ticker !== ticker);
    }

    reinvestmentPot += modern ? netAmount : grossAmount;
    rebuiltTrades.push({
      ...trade,
      ticker,
      shares: sellShares,
      fundingFromPot: 0,
      commissionAmount,
      taxAmount: modern ? taxAmount : trade.taxAmount,
      grossAmount: modern ? grossAmount : trade.grossAmount,
      netAmount: modern ? netAmount : trade.netAmount,
      realizedPL,
    });
  }

  return {
    holdings,
    trades: rebuiltTrades.sort((left, right) => right.date.localeCompare(left.date)),
    dividends,
    reinvestmentPot,
    externalCashInvested,
  };
}

export function usePortfolio({
  clerkLoaded = false,
  remotePersistenceEnabled = false,
}: {
  clerkLoaded?: boolean;
  remotePersistenceEnabled?: boolean;
} = {}) {
  const [state, setState] = useState<PortfolioState>(emptyPortfolio);
  const [hydrated, setHydrated] = useState(false);
  const lastSyncedRemote = useRef<string | null>(null);
  const remoteHydrating = useRef(false);

  useEffect(() => {
    if (!clerkLoaded) return;

    let disposed = false;

    async function hydrate() {
      console.log("[portfolio-store] hydrate start", {
        clerkLoaded,
        remotePersistenceEnabled,
      });
      setHydrated(false);
      const localState = loadState();

      if (!remotePersistenceEnabled) {
        remoteHydrating.current = false;
        console.log("[portfolio-store] using localStorage; remote persistence disabled");
        lastSyncedRemote.current = null;
        if (!disposed) {
          // Hydration from localStorage is the canonical use-case for setState
          // inside an effect. We can't read storage on the server.
          setState(localState);
          setHydrated(true);
        }
        return;
      }

      try {
        remoteHydrating.current = true;
        const remoteState = await loadRemoteState();
        const nextState = remoteState ?? localState;
        const serialized = JSON.stringify(nextState);

        if (!remoteState && !isEmptyState(localState)) {
          console.log("[portfolio-store] importing localStorage portfolio to Supabase");
          await saveRemoteState(localState);
        }

        lastSyncedRemote.current = serialized;
        if (!disposed) {
          setState(nextState);
          setHydrated(true);
        }
      } catch (error) {
        console.error("[portfolio-store] hydrate remote flow failed", error);
        lastSyncedRemote.current = null;
        if (!disposed) {
          // Keep the app usable if the local test database is unavailable.
          setState(localState);
          setHydrated(true);
        }
      } finally {
        remoteHydrating.current = false;
      }
    }

    hydrate();

    return () => {
      disposed = true;
    };
  }, [clerkLoaded, remotePersistenceEnabled]);

  useEffect(() => {
    if (!hydrated || !clerkLoaded) {
      console.log("[portfolio-store] skip persistence", { hydrated, clerkLoaded });
      return;
    }

    if (!remotePersistenceEnabled) {
      console.log("[portfolio-store] save localStorage; remote persistence disabled");
      saveState(state);
      return;
    }

    if (remoteHydrating.current) {
      console.log("[portfolio-store] skip remote save; remote hydration in progress");
      return;
    }

    const serialized = JSON.stringify(state);
    if (lastSyncedRemote.current === serialized) {
      console.log("[portfolio-store] skip remote save; state already synced");
      return;
    }
    lastSyncedRemote.current = serialized;

    const persist = isEmptyState(state) ? deleteRemoteState() : saveRemoteState(state);
    persist.catch((error) => {
      console.error("[portfolio-store] remote persistence failed", error);
      // API errors are intentionally non-fatal for local testing.
    });
  }, [state, hydrated, clerkLoaded, remotePersistenceEnabled]);

  const buy = useCallback(
    (input: {
      ticker: string;
      shares: number;
      price: number;
      brokerCommissionRate?: number;
      date?: string;
      useReinvestmentPot?: boolean;
      note?: string;
    }) => {
      setState((prev) => {
        const shares = input.shares;
        const brokerCommissionRate = Math.max(
          0,
          input.brokerCommissionRate ?? FIXED_BROKER_COMMISSION_RATE
        );
        const grossAmount = shares * input.price;
        const commissionAmount = grossAmount * brokerCommissionRate;
        const netAmount = grossAmount + commissionAmount;
        const ticker = input.ticker.toUpperCase().trim();
        const date = input.date ?? new Date().toISOString().slice(0, 10);

        let fromPot = 0;
        if (input.useReinvestmentPot) {
          fromPot = Math.min(netAmount, prev.reinvestmentPot);
        }
        const external = netAmount - fromPot;

        const existing = prev.holdings.find((h) => h.ticker === ticker);
        let holdings: Holding[];
        if (existing) {
          const newShares = existing.shares + shares;
          const newAvg =
            (existing.shares * existing.avgPrice + netAmount) /
            newShares;
          holdings = prev.holdings.map((h) =>
            h.ticker === ticker
              ? { ...h, shares: newShares, avgPrice: newAvg, lastUpdate: date }
              : h
          );
        } else {
          holdings = [
            ...prev.holdings,
            {
              ticker,
              shares,
              avgPrice: netAmount / shares,
              firstBuyDate: date,
              lastUpdate: date,
            },
          ];
        }

        const trade: Trade = {
          id: newId(),
          date,
          ticker,
          type: "buy",
          shares,
          price: input.price,
          fundingFromPot: fromPot,
          brokerCommissionRate,
          commissionAmount,
          taxRate: 0,
          taxAmount: 0,
          grossAmount,
          netAmount,
          note: input.note,
        };

        return {
          ...prev,
          holdings,
          reinvestmentPot: prev.reinvestmentPot - fromPot,
          externalCashInvested: prev.externalCashInvested + external,
          trades: [trade, ...prev.trades],
        };
      });
    },
    []
  );

  const sell = useCallback(
    (input: {
      ticker: string;
      shares: number;
      price: number;
      brokerCommissionRate?: number;
      taxRate?: number;
      date?: string;
      note?: string;
    }) => {
      setState((prev) => {
        const ticker = input.ticker.toUpperCase().trim();
        const existing = prev.holdings.find((h) => h.ticker === ticker);
        if (!existing) return prev;
        const sellShares = Math.min(input.shares, existing.shares);
        const brokerCommissionRate = Math.max(
          0,
          input.brokerCommissionRate ?? FIXED_BROKER_COMMISSION_RATE
        );
        const taxRate = Math.max(0, input.taxRate ?? FIXED_TAX_RATE);
        const grossAmount = sellShares * input.price;
        const commissionAmount = grossAmount * brokerCommissionRate;
        const netSellBeforeTax = grossAmount - commissionAmount;
        const costBasis = sellShares * existing.avgPrice;
        const grossProfit = netSellBeforeTax - costBasis;
        const taxAmount = Math.max(grossProfit, 0) * taxRate;
        const netAmount = netSellBeforeTax - taxAmount;
        const realizedPL = netAmount - costBasis;
        const date = input.date ?? new Date().toISOString().slice(0, 10);

        const remaining = existing.shares - sellShares;
        const holdings =
          remaining > 0
            ? prev.holdings.map((h) =>
                h.ticker === ticker
                  ? { ...h, shares: remaining, lastUpdate: date }
                  : h
              )
            : prev.holdings.filter((h) => h.ticker !== ticker);

        const trade: Trade = {
          id: newId(),
          date,
          ticker,
          type: "sell",
          shares: sellShares,
          price: input.price,
          fundingFromPot: 0,
          brokerCommissionRate,
          commissionAmount,
          taxRate,
          taxAmount,
          grossAmount,
          netAmount,
          realizedPL,
          note: input.note,
        };

        return {
          ...prev,
          holdings,
          reinvestmentPot: prev.reinvestmentPot + netAmount,
          trades: [trade, ...prev.trades],
        };
      });
    },
    []
  );

  const recordDividend = useCallback(
    (input: {
      ticker: string;
      amount: number;
      purifyPct: number;
      date?: string;
      note?: string;
    }) => {
      setState((prev) => {
        const date = input.date ?? new Date().toISOString().slice(0, 10);
        const purifiedAmount = input.amount * (input.purifyPct / 100);
        const dividend: Dividend = {
          id: newId(),
          date,
          ticker: input.ticker.toUpperCase().trim(),
          amount: input.amount,
          purifyPct: input.purifyPct,
          purifiedAmount,
          note: input.note,
        };
        return {
          ...prev,
          dividends: [dividend, ...prev.dividends],
          reinvestmentPot:
            prev.reinvestmentPot + (input.amount - purifiedAmount),
        };
      });
    },
    []
  );

  const withdrawPot = useCallback((amount: number) => {
    setState((prev) => {
      const take = Math.max(0, Math.min(amount, prev.reinvestmentPot));
      return {
        ...prev,
        reinvestmentPot: prev.reinvestmentPot - take,
      };
    });
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setState((prev) =>
      rebuildPortfolioFromTrades(
        prev.trades.filter((t) => t.id !== id),
        prev.dividends
      )
    );
  }, []);

  const deleteDividend = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dividends: prev.dividends.filter((d) => d.id !== id),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(emptyPortfolio);
  }, []);

  return {
    state,
    hydrated,
    buy,
    sell,
    recordDividend,
    withdrawPot,
    deleteTrade,
    deleteDividend,
    reset,
  };
}
