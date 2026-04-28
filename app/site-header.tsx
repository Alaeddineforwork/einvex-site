"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import HeaderNav from "./header-nav";

export default function SiteHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(10,14,18,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          width: "100%",
          boxSizing: "border-box",
          margin: "0 auto",
          padding: "0 1rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        {/* Left — Logo */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo/260x70.png"
            alt="EinveX"
            width={108}
            height={32}
            style={{ height: "30px", width: "auto" }}
            priority
          />
        </Link>

        {/* Right - auth and mobile menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <SignedOut>
            <Link
              href="/sign-in"
              style={{
                fontSize: "13px",
                color: "#9ba3ad",
                textDecoration: "none",
              }}
              className="hidden md:inline"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              style={{
                background: "#22c55e",
                color: "#04130a",
                borderRadius: "8px",
                padding: "0.45rem 0.75rem",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Get Started
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: { width: 32, height: 32 },
                },
              }}
            />
          </SignedIn>
          <HeaderNav />
        </div>
      </div>
    </header>
  );
}
