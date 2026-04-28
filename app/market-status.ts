export type MarketStatus = {
  isOpen: boolean;
  label: "Open" | "Closed";
  detail: string;
};

const MARKET_TIME_ZONE = "Africa/Casablanca";
const OPEN_MINUTE = 9 * 60 + 30;
const CLOSE_MINUTE = 15 * 60 + 30;

function getCasablancaParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MARKET_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    weekday: value("weekday"),
    hour: Number(value("hour")),
    minute: Number(value("minute")),
  };
}

export function getCasablancaMarketStatus(now = new Date()): MarketStatus {
  const { weekday, hour, minute } = getCasablancaParts(now);
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  const minuteOfDay = hour * 60 + minute;
  const isRegularSession =
    isWeekday && minuteOfDay >= OPEN_MINUTE && minuteOfDay < CLOSE_MINUTE;

  return {
    isOpen: isRegularSession,
    label: isRegularSession ? "Open" : "Closed",
    detail: "Regular session: 09:30-15:30 Casablanca time",
  };
}
