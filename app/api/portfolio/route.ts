import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../../lib/supabase-server";

export const dynamic = "force-dynamic";

type PortfolioPayload = Record<string, unknown>;

const emptyPortfolio = {
  holdings: [],
  trades: [],
  dividends: [],
  reinvestmentPot: 0,
  externalCashInvested: 0,
};

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function logPortfolioError(message: string, error: unknown) {
  console.error("[api/portfolio]", message, error);
}

async function getUserId() {
  const { userId } = await auth();
  return userId;
}

function isPortfolioPayload(value: unknown): value is PortfolioPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const portfolio = value as Partial<{
    holdings: unknown;
    trades: unknown;
    dividends: unknown;
    reinvestmentPot: unknown;
    externalCashInvested: unknown;
  }>;

  return (
    Array.isArray(portfolio.holdings) &&
    Array.isArray(portfolio.trades) &&
    Array.isArray(portfolio.dividends) &&
    typeof portfolio.reinvestmentPot === "number" &&
    typeof portfolio.externalCashInvested === "number"
  );
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    console.log("[api/portfolio] GET auth", {
      userId,
      hasCookieHeader: Boolean(request.headers.get("cookie")),
      host: request.headers.get("host"),
    });
    if (!userId) return jsonError("Unauthorized", 401);

    const { data, error } = await supabaseAdmin
      .from("user_portfolios")
      .select("portfolio_data")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      logPortfolioError("Supabase GET failed", error);
      return jsonError("Could not load portfolio.", 500);
    }

    return Response.json({ portfolio: data?.portfolio_data ?? emptyPortfolio });
  } catch (error) {
    logPortfolioError("GET failed", error);
    return jsonError("Something went wrong while loading the portfolio.", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserId();
    console.log("[api/portfolio] PUT auth", {
      userId,
      hasCookieHeader: Boolean(request.headers.get("cookie")),
      host: request.headers.get("host"),
    });
    if (!userId) return jsonError("Unauthorized", 401);

    const body = (await request.json()) as { portfolio?: unknown };
    console.log("[api/portfolio] PUT payload received", {
      hasPortfolio: Boolean(body.portfolio),
      isValidPortfolio: isPortfolioPayload(body.portfolio),
    });
    if (!isPortfolioPayload(body.portfolio)) {
      return jsonError("Invalid portfolio payload.", 400);
    }

    const { error } = await supabaseAdmin.from("user_portfolios").upsert(
      {
        clerk_user_id: userId,
        portfolio_data: body.portfolio,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" }
    );

    if (error) {
      logPortfolioError("Supabase PUT failed", error);
      return jsonError("Could not save portfolio.", 500);
    }

    return Response.json({ ok: true });
  } catch (error) {
    logPortfolioError("PUT failed", error);
    return jsonError("Something went wrong while saving the portfolio.", 500);
  }
}

export async function DELETE() {
  try {
    const userId = await getUserId();
    if (!userId) return jsonError("Unauthorized", 401);

    const { error } = await supabaseAdmin
      .from("user_portfolios")
      .delete()
      .eq("clerk_user_id", userId);

    if (error) {
      logPortfolioError("Supabase DELETE failed", error);
      return jsonError("Could not delete portfolio.", 500);
    }

    return Response.json({ ok: true });
  } catch (error) {
    logPortfolioError("DELETE failed", error);
    return jsonError("Something went wrong while deleting the portfolio.", 500);
  }
}
