import { NextResponse } from "next/server";
import { getMarketFeed, QUOTE_CACHE_SECONDS } from "../../lib/quotes-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getMarketFeed();
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": `public, max-age=60, s-maxage=${QUOTE_CACHE_SECONDS}, stale-while-revalidate=300`,
    },
  });
}
