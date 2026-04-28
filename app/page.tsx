"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Home() {
  const cardsSectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToCards = () => {
    cardsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((s) => { if (s) sectionObserver.observe(s); });

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .anim-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .anim-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .anim-card {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .anim-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-headline {
          opacity: 0;
          animation: fadeUp 0.75s ease forwards;
          animation-delay: 0s;
        }
        .hero-sub {
          opacity: 0;
          animation: fadeUp 0.75s ease forwards;
          animation-delay: 0.3s;
        }
        .hero-cta {
          opacity: 0;
          animation: fadeUp 0.75s ease forwards;
          animation-delay: 0.6s;
        }
        @media (max-width: 767px) {
          .home-hero {
            --hero-min-height: 78svh;
            --hero-padding: 5.25rem 1.25rem 2.5rem;
            --hero-padding-top: 5.25rem;
            --hero-justify: flex-start;
            --hero-sub-gap: 1rem;
            --hero-cta-gap: 1.5rem;
          }
        }
      `}</style>

      <main style={{ background: "#0e0e0e", color: "#f5f5f5" }}>

        {/* ── Section 1: Hero ── */}
        <section
          className="home-hero"
          style={{
            minHeight: "var(--hero-min-height, 100vh)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "var(--hero-justify, center)",
            textAlign: "center",
            padding: "var(--hero-padding, 4rem 1.5rem)",
            paddingTop: "var(--hero-padding-top, 80px)",
          }}
        >
          <h1
            className="hero-headline"
            style={{
              fontSize: "clamp(2.05rem, 10vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
              color: "#f5f5f5",
              maxWidth: "min(820px, calc(100vw - 2rem))",
              width: "100%",
              overflowWrap: "break-word",
            }}
          >
            Invest with Purpose
          </h1>

          <p
            className="hero-sub"
            style={{
              marginTop: "var(--hero-sub-gap, 1.5rem)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.75,
              color: "#888888",
              maxWidth: "min(540px, calc(100vw - 2rem))",
              width: "100%",
            }}
          >
            One platform for Sharia-compliant investment opportunities —
            screened with rigor, built for clarity.
          </p>

          <button
            className="hero-cta"
            onClick={scrollToCards}
            style={{
              marginTop: "var(--hero-cta-gap, 2.5rem)",
              background: "#1a5c38",
              color: "#f5f5f5",
              border: "none",
              borderRadius: "9999px",
              padding: "0.85rem 2.2rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2e7d52")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a5c38")}
          >
            Explore Opportunities
          </button>
        </section>

        {/* ── Section 2: Cards ── */}
        <section
          ref={(el) => { cardsSectionRef.current = el; sectionRefs.current[0] = el; }}
          className="anim-section"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >

              {/* Card 1 */}
              <div
                ref={(el) => { cardRefs.current[0] = el; }}
                className="anim-card"
                style={{
                  background: "#1a1a1a",
                  borderTop: "1px solid #2a2a2a",
                  borderRight: "1px solid #2a2a2a",
                  borderBottom: "1px solid #2a2a2a",
                  borderLeft: "3px solid #1a5c38",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "opacity 0.55s ease, transform 0.55s ease, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderTopColor = "#2e7d52";
                  el.style.borderRightColor = "#2e7d52";
                  el.style.borderBottomColor = "#2e7d52";
                  el.style.borderLeftColor = "#2e7d52";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderTopColor = "#2a2a2a";
                  el.style.borderRightColor = "#2a2a2a";
                  el.style.borderBottomColor = "#2a2a2a";
                  el.style.borderLeftColor = "#1a5c38";
                }}
              >
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f5f5" }}>
                  Portfolio
                </h2>
                <p style={{ marginTop: "0.75rem", flex: 1, fontSize: "0.9rem", lineHeight: 1.75, color: "#888888" }}>
                  Track your investments, monitor performance, and analyze your portfolio over time.
                </p>
                <div style={{ marginTop: "1.75rem" }}>
                  <Link
                    href="/portfolio"
                    style={{
                      display: "inline-block",
                      background: "#1a5c38",
                      color: "#f5f5f5",
                      borderRadius: "9999px",
                      padding: "0.65rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2e7d52")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1a5c38")}
                  >
                    Explore Now
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div
                ref={(el) => { cardRefs.current[1] = el; }}
                className="anim-card"
                style={{
                  background: "#1a1a1a",
                  borderTop: "1px solid #2a2a2a",
                  borderRight: "1px solid #2a2a2a",
                  borderBottom: "1px solid #2a2a2a",
                  borderLeft: "3px solid #1a5c38",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "opacity 0.55s ease, transform 0.55s ease, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderTopColor = "#2e7d52";
                  el.style.borderRightColor = "#2e7d52";
                  el.style.borderBottomColor = "#2e7d52";
                  el.style.borderLeftColor = "#2e7d52";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderTopColor = "#2a2a2a";
                  el.style.borderRightColor = "#2a2a2a";
                  el.style.borderBottomColor = "#2a2a2a";
                  el.style.borderLeftColor = "#1a5c38";
                }}
              >
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f5f5" }}>
                  Market
                </h2>
                <p style={{ marginTop: "0.75rem", flex: 1, fontSize: "0.9rem", lineHeight: 1.75, color: "#888888" }}>
                  Follow Moroccan market indices and stay updated with market movements.
                </p>
                <div style={{ marginTop: "1.75rem" }}>
                  <Link
                    href="/marche"
                    style={{
                      display: "inline-block",
                      background: "#1a5c38",
                      color: "#f5f5f5",
                      borderRadius: "9999px",
                      padding: "0.65rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2e7d52")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1a5c38")}
                  >
                    Explore Now
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div
                ref={(el) => { cardRefs.current[2] = el; }}
                className="anim-card"
                style={{
                  background: "#1a1a1a",
                  borderTop: "1px solid #2a2a2a",
                  borderRight: "1px solid #2a2a2a",
                  borderBottom: "1px solid #2a2a2a",
                  borderLeft: "3px solid #1a5c38",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "opacity 0.55s ease, transform 0.55s ease, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderTopColor = "#2e7d52";
                  el.style.borderRightColor = "#2e7d52";
                  el.style.borderBottomColor = "#2e7d52";
                  el.style.borderLeftColor = "#2e7d52";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderTopColor = "#2a2a2a";
                  el.style.borderRightColor = "#2a2a2a";
                  el.style.borderBottomColor = "#2a2a2a";
                  el.style.borderLeftColor = "#1a5c38";
                }}
              >
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f5f5" }}>
                  CSE Stock Screener
                </h2>
                <p style={{ marginTop: "0.75rem", flex: 1, fontSize: "0.9rem", lineHeight: 1.75, color: "#888888" }}>
                  Browse Casablanca Stock Exchange stocks and check their Sharia-compliance status.
                </p>
                <div style={{ marginTop: "1.75rem" }}>
                  <Link
                    href="/screener"
                    style={{
                      display: "inline-block",
                      background: "#1a5c38",
                      color: "#f5f5f5",
                      borderRadius: "9999px",
                      padding: "0.65rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2e7d52")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1a5c38")}
                  >
                    Explore Now
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div
                ref={(el) => { cardRefs.current[3] = el; }}
                className="anim-card"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f5f5" }}>
                    Investment Projects
                  </h2>
                  <span style={{ background: "rgba(217,119,6,0.15)", color: "#f59e0b", borderRadius: "9999px", padding: "0.2rem 0.65rem", fontSize: "0.72rem", fontWeight: 600 }}>
                    Coming Soon
                  </span>
                </div>
                <p style={{ marginTop: "0.75rem", flex: 1, fontSize: "0.9rem", lineHeight: 1.75, color: "#888888" }}>
                  Curated Sharia-compliant investment deals, selected for ethical and financial integrity.
                </p>
                <div style={{ marginTop: "1.75rem" }}>
                  <button disabled style={{ background: "#222222", color: "#444444", border: "none", borderRadius: "9999px", padding: "0.65rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "not-allowed" }}>
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Card 5 */}
              <div
                ref={(el) => { cardRefs.current[4] = el; }}
                className="anim-card"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f5f5" }}>
                    Real Estate
                  </h2>
                  <span style={{ background: "rgba(217,119,6,0.15)", color: "#f59e0b", borderRadius: "9999px", padding: "0.2rem 0.65rem", fontSize: "0.72rem", fontWeight: 600 }}>
                    Coming Soon
                  </span>
                </div>
                <p style={{ marginTop: "0.75rem", flex: 1, fontSize: "0.9rem", lineHeight: 1.75, color: "#888888" }}>
                  Sharia-compliant real estate opportunities, built for the ethical investor.
                </p>
                <div style={{ marginTop: "1.75rem" }}>
                  <button disabled style={{ background: "#222222", color: "#444444", border: "none", borderRadius: "9999px", padding: "0.65rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "not-allowed" }}>
                    Explore Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 3: Stats ── */}
        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="anim-section"
          style={{
            minHeight: "100vh",
            background: "#0e0e0e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "4rem 1.5rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#2e7d52", marginBottom: "3.5rem" }}>
            By the numbers
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5rem" }}>
            {[
              { value: "80+",  label: "CSE stocks tracked" },
              { value: "3",    label: "Screening criteria" },
              { value: "100%", label: "Independent research" },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "5rem", fontWeight: 700, color: "#f5f5f5", lineHeight: 1 }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "0.9rem", color: "#888888" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: How it works ── */}
        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="anim-section"
          style={{
            minHeight: "100vh",
            background: "#111111",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1.5rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#2e7d52", marginBottom: "3.5rem" }}>
            How it works
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              maxWidth: "900px",
              width: "100%",
            }}
          >
            {[
              { step: "1", title: "Create your account", desc: "Sign up in seconds, no paperwork required." },
              { step: "2", title: "Browse the screener",  desc: "Explore CSE stocks and their Sharia-compliance status." },
              { step: "3", title: "Track your portfolio", desc: "Add your holdings and monitor them in one place." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ position: "relative", padding: "2rem 1.5rem", overflow: "hidden", minHeight: "160px" }}>
                <span
                  style={{
                    fontSize: "10rem",
                    fontWeight: 800,
                    color: "#1a1a1a",
                    position: "absolute",
                    top: "-2rem",
                    left: "-1rem",
                    lineHeight: 1,
                    userSelect: "none",
                    zIndex: 0,
                    pointerEvents: "none",
                    fontFamily: "monospace",
                  }}
                >
                  {step}
                </span>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f5f5f5", marginBottom: "0.75rem" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "#888888" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: Why EinveX ── */}
        <section
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="anim-section"
          style={{
            minHeight: "100vh",
            background: "#0e0e0e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "800px", width: "100%" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#2e7d52", marginBottom: "1rem" }}>
              Why EinveX
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#f5f5f5",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: "3rem",
              }}
            >
              Built for the ethical investor
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
              {[
                { title: "Independent",            desc: "No commissions, no conflicts. Just clean research." },
                { title: "Sharia-compliant focus",  desc: "Every stock screened against clear, consistent criteria." },
                { title: "Built for Morocco",       desc: "CSE-first, designed for the local investor." },
                { title: "Always improving",        desc: "New stocks, new features, always free to start." },
              ].map(({ title, desc }) => (
                <div key={title} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#2e7d52", flexShrink: 0 }} />
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f5f5f5" }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "#888888", paddingLeft: "1.4rem" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 6: Final CTA ── */}
        <section
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="anim-section"
          style={{
            minHeight: "100vh",
            background: "#111111",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "4rem 1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#f5f5f5",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              maxWidth: "700px",
            }}
          >
            Ready to invest with purpose?
          </h2>
          <p style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "#888888", maxWidth: "440px", lineHeight: 1.75 }}>
            Join early and get full access to the CSE screener.
          </p>
          <Link
            href="/early-access"
            style={{
              marginTop: "2.5rem",
              display: "inline-block",
              background: "#1a5c38",
              color: "#f5f5f5",
              borderRadius: "9999px",
              padding: "0.85rem 2.2rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2e7d52")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a5c38")}
          >
            Get Started
          </Link>
        </section>

      </main>
    </>
  );
}
