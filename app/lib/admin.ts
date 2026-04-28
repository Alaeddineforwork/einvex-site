import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Comma-separated allow-list, e.g.
 *   ADMIN_EMAILS=alaeddine.bya@einvex.com,walid.flifel@einvex.com
 *
 * Exposed via NEXT_PUBLIC_ADMIN_EMAILS so the client header can show the
 * Admin link without an extra round-trip. The actual /admin gate still
 * runs server-side via requireAdmin() — never trust the client.
 */
const adminList = (process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminList.includes(email.toLowerCase());
}

/** Server-side admin gate. Use inside an admin server component / action. */
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/admin");
  const email = user.emailAddresses[0]?.emailAddress;
  if (!isAdminEmail(email)) {
    redirect("/");
  }
  return user;
}
