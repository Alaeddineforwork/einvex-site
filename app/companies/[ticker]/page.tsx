import {
  companyScreeningData,
  getFinalStatus,
  getStatusStyle,
} from "../../screening-data";
import {
  buildRatioRows,
  getShariaRatios,
  type RatioRow,
} from "../../sharia-ratios";

function getBusinessOverview(name: string, sector: string) {
  return `${name} is listed on the Casablanca Stock Exchange and operates in the ${sector} sector.`;
}

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.trim().toUpperCase();
  const company = companyScreeningData[ticker];

  if (!company) {
    return (
      <main className="page-shell">
        <div className="page-container py-16">
          <div className="mx-auto max-w-4xl surface-card">
            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Company not found
            </h1>
            <p className="mt-4" style={{ color: "var(--text-dim)" }}>
              We could not find details for this company in the current coverage universe.
            </p>
            <a
              href="/screener"
              className="mt-6 inline-block rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Back to Screener
            </a>
          </div>
        </div>
      </main>
    );
  }

  const finalStatus = getFinalStatus(company.aaoifi);
  const businessOverview = getBusinessOverview(company.name, company.sector);
  const ratioRows = buildRatioRows(getShariaRatios(company.ticker));

  return (
    <main className="page-shell">
      <div className="page-container py-16">
        <div className="mx-auto max-w-4xl surface-card md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="eyebrow">Company Details</p>
              <h1
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ color: "var(--text)" }}
              >
                {company.name}
              </h1>
              <p
                className="mt-2 text-sm uppercase tracking-[0.18em]"
                style={{ color: "var(--text-mute)" }}
              >
                {company.ticker}
              </p>
            </div>

            <span
              className={`h-fit self-start rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                finalStatus
              )}`}
            >
              {finalStatus}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
            <div>
              <p className="section-label">Sector</p>
              <p className="mt-2 text-lg" style={{ color: "var(--text)" }}>
                {company.sector}
              </p>
            </div>

            <div>
              <p className="section-label">Ticker</p>
              <p className="mt-2 text-lg" style={{ color: "var(--text)" }}>
                {company.ticker}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="section-label">Business Overview</p>
            <p className="mt-3 leading-8" style={{ color: "var(--text-dim)" }}>
              {businessOverview}
            </p>
          </div>

          <div
            className="mt-10 rounded-lg border p-6"
            style={{
              borderColor: "var(--line)",
              background: "var(--bg-elev)",
            }}
          >
            <p className="section-label">Sharia Screening - AAOIFI Standard</p>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="section-label">Source</p>
                <p
                  className="mt-2 text-base font-medium"
                  style={{ color: "var(--text)" }}
                >
                  AAOIFI
                </p>
              </div>

              <span
                className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                  finalStatus
                )}`}
              >
                {finalStatus}
              </span>
            </div>

            <div className="mt-6">
              <p className="section-label">Comment</p>
              <p
                className="mt-3 text-sm leading-7"
                style={{ color: "var(--text-dim)" }}
              >
                {company.aaoifi.comment}
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr
                    className="border-b text-xs uppercase tracking-[0.16em]"
                    style={{
                      borderColor: "var(--line)",
                      color: "var(--text-mute)",
                    }}
                  >
                    <th className="py-3 pr-4 font-semibold">Filter</th>
                    <th className="py-3 pr-4 font-semibold">Limit</th>
                    <th className="py-3 pr-4 text-right font-semibold">Value</th>
                    <th className="py-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ratioRows.map((row) => (
                    <CompanyRatioRow key={row.key} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 surface-subtle">
            <p className="section-label">Methodology Disclaimer</p>
            <p
              className="mt-3 text-sm leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              This screening is based on AAOIFI Sharia standards using publicly
              available financial and business activity information. The
              screening is provided for informational purposes only and does not
              constitute investment advice.
            </p>
          </div>

          <div className="mt-10">
            <a
              href="/screener"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 sm:w-auto"
            >
              Back to Screener
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function CompanyRatioRow({ row }: { row: RatioRow }) {
  const statusClass =
    row.verdict === "pass"
      ? "chip chip-up"
      : row.verdict === "fail"
        ? "chip chip-down"
        : "chip chip-neutral";
  const statusLabel =
    row.verdict === "pending"
      ? "N/A"
      : row.statusLabel
        ? row.statusLabel
        : row.verdict === "pass"
          ? "Pass"
          : "Fail";

  return (
    <tr
      className="border-b last:border-b-0"
      style={{ borderColor: "var(--line)" }}
    >
      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text)" }}>
        {row.filter}
      </td>
      <td className="py-3 pr-4" style={{ color: "var(--text-dim)" }}>
        {row.limit}
      </td>
      <td
        className="py-3 pr-4 text-right font-mono"
        style={{ color: "var(--text)" }}
      >
        {row.value ?? "N/A"}
      </td>
      <td className="py-3 text-right">
        <span className={statusClass}>{statusLabel}</span>
      </td>
    </tr>
  );
}
