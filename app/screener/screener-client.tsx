"use client";

import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import {
  FinalStatus,
  companies,
  formatScreeningStatus,
  getStatusStyle,
} from "../screening-data";

type VisibleCount = "25" | "50" | "100" | "all";

export default function ScreenerClient() {
  const { isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | FinalStatus>("All");
  // Show every company by default — users can dial it down with the selector.
  const [visibleCount, setVisibleCount] = useState<VisibleCount>("all");

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
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [searchQuery, sectorFilter, statusFilter]);

  const visibleCompanies = useMemo(() => {
    if (!isSignedIn) {
      return filteredCompanies.slice(0, 6);
    }
    if (visibleCount === "all") {
      return filteredCompanies;
    }
    return filteredCompanies.slice(0, Number(visibleCount));
  }, [filteredCompanies, visibleCount, isSignedIn]);

  return (
    <>
      {/* Filter card */}
      <div className="surface-card mb-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search by company, ticker, or sector…"
          className="field-control"
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
            <option value="all">Show all</option>
            <option value="25">Show 25</option>
            <option value="50">Show 50</option>
            <option value="100">Show 100</option>
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
          </select>
        </div>

        <p className="text-[12px]" style={{ color: "var(--text-mute)" }}>
          Showing{" "}
          <span className="num" style={{ color: "var(--text)" }}>
            {visibleCompanies.length}
          </span>{" "}
          of{" "}
          <span className="num" style={{ color: "var(--text)" }}>
            {filteredCompanies.length}
          </span>{" "}
          {filteredCompanies.length === 1 ? "company" : "companies"}
        </p>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="surface-card py-12 text-center">
          <p
            className="text-[15px] font-medium"
            style={{ color: "var(--text)" }}
          >
            No companies match your search and filters.
          </p>
          <p
            className="mt-2 text-[12.5px]"
            style={{ color: "var(--text-mute)" }}
          >
            Try broadening your search or changing a filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleCompanies.map((company) => {
            const finalStatus = formatScreeningStatus(company.aaoifi.status);
            const pillCls =
              finalStatus === "Sharia-compliant"
                ? "pill-compliant"
                : "pill-not-compliant";

            return (
              <div key={company.ticker} className="surface-card flex flex-col">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2
                      className="text-[16px] font-semibold sm:text-[17px]"
                      style={{
                        color: "var(--text)",
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {company.name}
                    </h2>
                    <p
                      className="ticker-cell mt-1"
                      style={{ color: "var(--text-mute)" }}
                    >
                      {company.ticker}
                    </p>
                  </div>

                  <span
                    className={
                      "inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold " +
                      pillCls +
                      " " +
                      getStatusStyle(finalStatus)
                    }
                  >
                    {finalStatus}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="section-label">Sector</p>
                  <p
                    className="mt-1 text-[13.5px]"
                    style={{ color: "var(--text)" }}
                  >
                    {company.sector}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="section-label">Source</p>
                  <p
                    className="mt-1 text-[13px]"
                    style={{ color: "var(--text)" }}
                  >
                    AAOIFI
                  </p>
                </div>
                <div className="mt-3">
                  <p className="section-label">Comment</p>
                  <p
                    className="mt-1 text-[12.5px] leading-6"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {company.aaoifi.comment}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link
                    href={`/companies/${company.ticker}`}
                    className="btn-ghost"
                    style={{ textDecoration: "none", width: "fit-content" }}
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/marche/${company.ticker}`}
                    className="text-[12px]"
                    style={{
                      color: "var(--text-mute)",
                      textDecoration: "none",
                    }}
                  >
                    Open in Market →
                  </Link>
                </div>
              </div>
            );
          })}
          {!isSignedIn && (
            <div
              className="surface-card flex min-h-[260px] flex-col items-center justify-center text-center"
              style={{
                borderColor: "rgba(34,197,94,0.26)",
                background: "rgba(34,197,94,0.07)",
              }}
            >
              <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                Create a free account to unlock full access
              </p>
              <p className="mt-2 max-w-xs text-[12.5px] leading-6" style={{ color: "var(--text-dim)" }}>
                Sign up to view the full screener universe and detailed screening pages.
              </p>
              <SignUpButton mode="redirect" forceRedirectUrl="/screener">
                <button type="button" className="btn-primary mt-4">
                  Create free account
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </>
  );
}
