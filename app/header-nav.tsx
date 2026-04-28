"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const desktopLinks = [
  { href: "/marche", label: "Market" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/screener", label: "Screener" },
  { href: "/blog", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/marche", label: "Market" },
  { href: "/screener", label: "Screener" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/early-access", label: "Early Access" },
];

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export default function HeaderNav() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  const showAdmin = isLoaded && !!email && ADMIN_EMAILS.includes(email);

  const links = showAdmin
    ? [...desktopLinks, { href: "/admin", label: "Admin" }]
    : desktopLinks;
  const menuLinks = showAdmin
    ? [...mobileLinks, { href: "/admin", label: "Admin" }]
    : mobileLinks;
  const currentLabel =
    menuLinks.find((link) => isActivePath(pathname, link.href))?.label ??
    "Home";

  return (
    <>
      <button
        type="button"
        aria-label="Open page menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="inline-flex lg:hidden"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "30vw",
          minWidth: "84px",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.32rem",
          border: "0",
          background: "transparent",
          color: "#e6e8eb",
          padding: "0.35rem 0.1rem",
          fontSize: "12px",
          fontWeight: 700,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {currentLabel}
        </span>
        <span
          aria-hidden
          style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "5px solid currentColor",
            flexShrink: 0,
            opacity: 0.8,
          }}
        />
      </button>

      <button
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="inline-flex lg:hidden"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: mobileOpen ? "rgba(34,197,94,0.12)" : "transparent",
          color: "#e6e8eb",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((line) => (
          <span
            key={line}
            aria-hidden
            style={{
              width: "16px",
              height: "2px",
              borderRadius: "999px",
              background: "currentColor",
            }}
          />
        ))}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 49,
            padding: "0.35rem 1rem 0.5rem",
            background: "rgba(10,14,18,0.96)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.24)",
          }}
        >
          <nav
            aria-label="Mobile navigation"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.1rem",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            {menuLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    minWidth: 0,
                    borderRadius: "6px",
                    background: active ? "rgba(34,197,94,0.12)" : "transparent",
                    color: active ? "#a7f3d0" : "#d6d9de",
                    padding: "0.58rem 0.25rem",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <nav
        style={{
          alignItems: "center",
          gap: "1.6rem",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        className="hidden lg:flex"
      >
        {links.map((link) => {
          const active = isActivePath(pathname, link.href);
          const isAdminLink = link.href === "/admin";
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: active ? "#e6e8eb" : "#9ba3ad",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                transition: "color 0.15s",
                letterSpacing: "0.01em",
              }}
            >
              {link.label}
              {active && (
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "9999px",
                    background: isAdminLink ? "#f59e0b" : "#22c55e",
                    display: "block",
                    boxShadow: isAdminLink
                      ? "0 0 8px rgba(245,158,11,0.6)"
                      : "0 0 8px rgba(34,197,94,0.6)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
