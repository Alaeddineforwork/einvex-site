import Link from "next/link";
import { requireAdmin } from "../lib/admin";
import AdminClient from "./admin-client";

export const metadata = {
  title: "Admin — EinveX",
  description: "Internal dashboard for the EinveX team.",
};

export default async function AdminPage() {
  // Server-side gate. Redirects to /sign-in or / if the user isn't an admin.
  const user = await requireAdmin();

  // Placeholder metrics. Wire these to your DB / Plausible API later.
  const metrics = {
    totalSignups: 0,
    activeLast7d: 0,
    portfoliosCreated: 0,
    topTickers: [] as { ticker: string; views: number }[],
    recentSignups: [] as { email: string; date: string }[],
    pageviews7d: [] as { date: string; views: number }[],
  };

  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container py-8 md:py-10">
        <div className="page-hero grid-fade">
          <p className="eyebrow">Admin · internal</p>
          <h1 className="page-title">
            Welcome back, {user.firstName ?? "team"}.
          </h1>
          <p className="page-intro">
            Site traffic, signups, and product usage at a glance. Numbers are
            placeholders until the analytics + database integrations are wired
            up — see{" "}
            <Link
              href="/contact"
              style={{ color: "#6ee7a7" }}
            >
              the roadmap
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        <AdminClient metrics={metrics} adminEmail={user.emailAddresses[0]?.emailAddress ?? ""} />
      </section>
    </main>
  );
}
