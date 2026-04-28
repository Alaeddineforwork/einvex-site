"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/screener", label: "Screener" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/early-access", label: "Early Access" },
];

const socialLinks = [
  {
    href: "https://linkedin.com/company/einvex",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <path d="M2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/einve_x",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer style={{ background: "#0e0e0e", borderTop: "1px solid #2a2a2a" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
          className="md:flex-row md:items-end md:justify-between"
        >
          <div style={{ maxWidth: "28rem" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image
                src="/logo/260x70.png"
                alt="EinveX"
                width={232}
                height={56}
                style={{ height: "3.5rem", width: "auto" }}
              />
            </Link>
            <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", lineHeight: 1.75, color: "#888888" }}>
              Ethical investment screening with a clean, modern research experience.
            </p>

            <div style={{ marginTop: "1.25rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#888888" }}>
                Follow EinveX
              </p>
              <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "#888888" }}>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    style={{ borderRadius: "9999px", padding: "0.5rem", transition: "color 0.2s", display: "inline-flex" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2e7d52")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#888888",
            }}
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ transition: "color 0.2s", color: "#888888", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2e7d52")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            borderTop: "1px solid #2a2a2a",
            paddingTop: "1.25rem",
            fontSize: "0.875rem",
            color: "#888888",
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <p>Focused on ethical investing insights for the Casablanca Stock Exchange.</p>
          <p>Built for clearer long-term research.</p>
        </div>

        <p
          style={{
            margin: 0,
            maxWidth: "56rem",
            fontSize: "0.75rem",
            lineHeight: 1.7,
            color: "#6f6f6f",
          }}
        >
          EinveX provides educational research tools only and does not provide
          investment, legal, tax, or Sharia advisory services. Verify data
          independently before making decisions.
        </p>
      </div>
    </footer>
  );
}
