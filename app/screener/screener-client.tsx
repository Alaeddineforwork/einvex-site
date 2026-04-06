"use client";

import { useMemo, useState } from "react";
import {
  FinalStatus,
  companies,
  formatScreeningStatus,
  getStatusStyle,
} from "../screening-data";

type VisibleCount = "10" | "25" | "50" | "100" | "all";

export default function ScreenerClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | FinalStatus>("All");
  const [visibleCount, setVisibleCount] = useState<VisibleCount>("10");

  const sectorOptions = useMemo(
    () => ["All", ...new Set(companies.map((company) => company.sector))],
    []
  );

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return companies
      .filter((company) => {
        const finalStatus = formatScreeningStatus(company.aaoifi.status);

        const matchesSearch =
          normalizedQuery.length === 0 ||
          company.name.toLowerCase().includes(normalizedQuery) ||
          company.ticker.toLowerCase().includes(normalizedQuery) ||
          company.sector.toLowerCase().includes(normalizedQuery);

        const matchesSector =
          sectorFilter === "All" || company.sector === sectorFilter;
        const matchesStatus =
          statusFilter === "All" || finalStatus === statusFilter;

        return matchesSearch && matchesSector && matchesStatus;
      })
      .sort((left, right) => {
        const leftIsAvailable = left.aaoifi.status !== "under_review";
        const rightIsAvailable = right.aaoifi.status !== "under_review";

        if (leftIsAvailable !== rightIsAvailable) {
          return leftIsAvailable ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      });
  }, [searchQuery, sectorFilter, statusFilter]);

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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            Try broadening your search or changing a filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleCompanies.map((company) => {
            const finalStatus = formatScreeningStatus(company.aaoifi.status);
            const isLocked = company.aaoifi.status === "under_review";

            return (
              <div key={company.ticker} className="surface-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">
                      {company.name}
                    </h2>
                    <p className="mt-1 break-all text-xs uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
                      {company.ticker}
                    </p>
                  </div>

                  {!isLocked ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        finalStatus
                      )}`}
                    >
                      {finalStatus}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6">
                  <p className="section-label">Sector</p>
                  <p className="mt-1 text-base text-slate-900">{company.sector}</p>
                </div>

                {isLocked ? (
                  <div className="relative mt-5 min-h-[15.5rem] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 sm:min-h-[14rem] sm:p-5">
                    <div className="space-y-4 blur-[3px] select-none">
                      <div>
                        <p className="section-label">Status</p>
                        <div className="mt-2">
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                            Under review
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="section-label">Source</p>
                        <p className="mt-1 text-base text-slate-900">AAOIFI</p>
                      </div>

                      <div>
                        <p className="section-label">Comment</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          AAOIFI screening for this company is not yet available.
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center bg-white/72 p-4 backdrop-blur-[2px] sm:p-5">
                      <div className="max-w-xs text-center">
                        <p className="text-sm font-semibold text-slate-900">
                          Join the waitlist to access upcoming screenings
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          AAOIFI screening for this company is not yet available.
                        </p>
                        <a
                          href="/early-access"
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
                        >
                          Join Early Access
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-4">
                      <p className="section-label">Source</p>
                      <p className="mt-1 text-base text-slate-900">AAOIFI</p>
                    </div>

                    <div className="mt-4">
                      <p className="section-label">Comment</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {company.aaoifi.comment}
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <a
                    href={isLocked ? "/early-access" : `/companies/${company.ticker}`}
                    className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition sm:w-auto ${
                      isLocked
                        ? "bg-emerald-700 text-white hover:bg-emerald-800"
                        : "bg-slate-900 text-white hover:bg-slate-700"
                    }`}
                  >
                    {isLocked ? "Join Early Access" : "View Details"}
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
