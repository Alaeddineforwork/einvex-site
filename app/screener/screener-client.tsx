"use client";

import { ChangeEvent, useMemo, useState } from "react";
import ScreeningSummary from "../screening-summary";
import {
  CompanyScreeningData,
  FinalStatus,
  companies,
  getConsensusScore,
  getFinalStatus,
  getStatusStyle,
} from "../screening-data";

type ConsensusFilter =
  | "all"
  | "75_and_above"
  | "50_to_74"
  | "below_50";

type VisibleCount = "10" | "25" | "50" | "100" | "all";
type NormFilter = "All norms" | "AAOIFI" | "Norm 2" | "Norm 3" | "Norm 4";
type NormResultFilter =
  | "Any result"
  | "Sharia-compliant"
  | "Not Sharia-compliant"
  | "Under review";

function getNormStatusValue(result: NormResultFilter) {
  if (result === "Sharia-compliant") {
    return "sharia_compliant";
  }

  if (result === "Not Sharia-compliant") {
    return "not_sharia_compliant";
  }

  return "under_review";
}

type ActiveNormFilter = {
  selectedNorm: Exclude<NormFilter, "All norms">;
  selectedNormResult: NormResultFilter;
};

function matchesNormSpecificFilter(
  company: CompanyScreeningData,
  activeNormFilter: ActiveNormFilter | null
) {
  if (!activeNormFilter) {
    return true;
  }

  const normEntry = company.norms.find(
    (norm) => norm.name === activeNormFilter.selectedNorm
  );

  if (!normEntry) {
    return false;
  }

  if (activeNormFilter.selectedNormResult === "Any result") {
    return true;
  }

  return normEntry.status === getNormStatusValue(activeNormFilter.selectedNormResult);
}

function matchesConsensusFilter(
  company: CompanyScreeningData,
  consensusFilter: ConsensusFilter
) {
  if (consensusFilter === "all") {
    return true;
  }

  const score = getConsensusScore(company.norms);

  if (consensusFilter === "75_and_above") {
    return score >= 75;
  }

  if (consensusFilter === "50_to_74") {
    return score >= 50 && score <= 74;
  }

  return score < 50;
}

export default function ScreenerClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | FinalStatus>("All");
  const [marketFilter, setMarketFilter] = useState("All");
  const [consensusFilter, setConsensusFilter] = useState<ConsensusFilter>("all");
  const [visibleCount, setVisibleCount] = useState<VisibleCount>("10");
  const [normFilter, setNormFilter] = useState<NormFilter>("All norms");
  const [normResultFilter, setNormResultFilter] =
    useState<NormResultFilter>("Any result");

  const sectorOptions = useMemo(
    () => ["All", ...new Set(companies.map((company) => company.sector))],
    []
  );

  const marketOptions = useMemo(
    () => ["All", ...new Set(companies.map((company) => company.market))],
    []
  );

  const activeNormFilter = useMemo<ActiveNormFilter | null>(() => {
    if (normFilter === "All norms") {
      return null;
    }

    return {
      selectedNorm: normFilter,
      selectedNormResult: normResultFilter,
    };
  }, [normFilter, normResultFilter]);

  const handleNormFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextNorm = event.target.value as NormFilter;

    setNormFilter(nextNorm);

    if (nextNorm === "All norms") {
      setNormResultFilter("Any result");
    }
  };

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return companies.filter((company) => {
      const finalStatus = getFinalStatus(company.norms);

      const matchesSearch =
        normalizedQuery.length === 0 ||
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.ticker.toLowerCase().includes(normalizedQuery) ||
        company.sector.toLowerCase().includes(normalizedQuery);

      const matchesSector =
        sectorFilter === "All" || company.sector === sectorFilter;
      const matchesStatus =
        statusFilter === "All" || finalStatus === statusFilter;
      const matchesMarket =
        marketFilter === "All" || company.market === marketFilter;
      const matchesNorm = matchesNormSpecificFilter(company, activeNormFilter);

      return (
        matchesSearch &&
        matchesSector &&
        matchesStatus &&
        matchesMarket &&
        matchesConsensusFilter(company, consensusFilter) &&
        matchesNorm
      );
    });
  }, [
    consensusFilter,
    activeNormFilter,
    marketFilter,
    searchQuery,
    sectorFilter,
    statusFilter,
  ]);

  const visibleCompanies = useMemo(() => {
    if (visibleCount === "all") {
      return filteredCompanies;
    }

    return filteredCompanies.slice(0, Number(visibleCount));
  }, [filteredCompanies, visibleCount]);

  return (
    <>
      <div className="mb-8 surface-card p-5">
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Search by company, ticker, or sector..."
            className="field-control rounded-xl"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <select
              className="field-control"
              value={visibleCount}
              onChange={(event) =>
                setVisibleCount(event.target.value as VisibleCount)
              }
            >
              <option value="10">Show 10</option>
              <option value="25">Show 25</option>
              <option value="50">Show 50</option>
              <option value="100">Show 100</option>
              <option value="all">Show all</option>
            </select>

            <select
              className="field-control"
              value={sectorFilter}
              onChange={(event) => setSectorFilter(event.target.value)}
            >
              {sectorOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All" ? "All sectors" : option}
                </option>
              ))}
            </select>

            <select
              className="field-control"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | FinalStatus)
              }
            >
              <option value="All">All statuses</option>
              <option value="Sharia-compliant">Sharia-compliant</option>
              <option value="Not Sharia-compliant">Not Sharia-compliant</option>
              <option value="Under review">Under review</option>
            </select>

            <select
              className="field-control"
              value={marketFilter}
              onChange={(event) => setMarketFilter(event.target.value)}
            >
              {marketOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All" ? "All markets" : option}
                </option>
              ))}
            </select>

            <select
              className="field-control"
              value={consensusFilter}
              onChange={(event) =>
                setConsensusFilter(event.target.value as ConsensusFilter)
              }
            >
              <option value="all">All consensus ranges</option>
              <option value="75_and_above">75% and above</option>
              <option value="50_to_74">50% to 74%</option>
              <option value="below_50">Below 50%</option>
            </select>

            <select
              className="field-control"
              value={normFilter}
              onChange={handleNormFilterChange}
            >
              <option value="All norms">All norms</option>
              <option value="AAOIFI">AAOIFI</option>
              <option value="Norm 2">Norm 2</option>
              <option value="Norm 3">Norm 3</option>
              <option value="Norm 4">Norm 4</option>
            </select>

            <select
              className="field-control disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              value={normResultFilter}
              onChange={(event) =>
                setNormResultFilter(event.target.value as NormResultFilter)
              }
              disabled={normFilter === "All norms"}
            >
              <option value="Any result">Any result</option>
              <option value="Sharia-compliant">Sharia-compliant</option>
              <option value="Not Sharia-compliant">Not Sharia-compliant</option>
              <option value="Under review">Under review</option>
            </select>
          </div>

          <p className="text-sm text-slate-500">
            Showing {visibleCompanies.length} of {filteredCompanies.length}{" "}
            {filteredCompanies.length === 1 ? "company" : "companies"}
          </p>
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="surface-card py-12 text-center">
          <p className="text-lg font-medium text-slate-900">
            No companies match your search and filters.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Try broadening your search, changing a filter, or resetting the consensus range.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleCompanies.map((company) => {
            const finalStatus = getFinalStatus(company.norms);

            return (
              <div key={company.ticker} className="surface-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-slate-950">
                      {company.name}
                    </h2>
                    <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500">
                      {company.ticker}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      finalStatus
                    )}`}
                  >
                    {finalStatus}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="section-label">Sector</p>
                  <p className="mt-1 text-base text-slate-900">{company.sector}</p>
                </div>
                <div className="mt-4">
                  <p className="section-label">Market</p>
                  <p className="mt-1 text-base text-slate-900">{company.market}</p>
                </div>

                <div className="mt-4">
                  <p className="section-label">Screening Note</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{company.note}</p>
                </div>

                <ScreeningSummary
                  norms={company.norms}
                  finalStatus={finalStatus}
                  className="mt-5"
                />

                <div className="mt-6">
                  <a
                    href={`/companies/${company.ticker}`}
                    className="inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    View Details
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
