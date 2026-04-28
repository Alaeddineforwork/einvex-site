import Link from "next/link";
import { formatPostDate, getAllPosts } from "../lib/posts";

export const metadata = {
  title: "News - EinveX",
  description:
    "Explainers, market commentary, and product updates from the EinveX team. Sharia-conscious investing on the Casablanca Stock Exchange.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container py-8 md:py-10">
        <div className="page-hero grid-fade">
          <p className="eyebrow">News</p>
          <h1 className="page-title">Notes from the team.</h1>
          <p className="page-intro">
            Screening explainers, market commentary, and the occasional
            product update. New posts when we have something worth saying.
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        {posts.length === 0 ? (
          <div className="surface-card text-center">
            <p className="text-[14px]" style={{ color: "var(--text-dim)" }}>
              No posts yet — drop a <code className="mono">.mdx</code> file in{" "}
              <code className="mono">content/posts/</code> and it&apos;ll
              show up here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="surface-card flex flex-col"
              >
                <div className="flex items-center gap-2 text-[11px]"
                  style={{ color: "var(--text-mute)" }}
                >
                  <time dateTime={post.date}>
                    {formatPostDate(post.date)}
                  </time>
                  <span>·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>

                <h2
                  className="mt-3 text-[20px] font-semibold tracking-tight"
                  style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {post.title}
                  </Link>
                </h2>

                <p
                  className="mt-2 text-[13.5px] leading-7"
                  style={{ color: "var(--text-dim)" }}
                >
                  {post.summary}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-5 flex flex-col gap-2 border-t pt-3 text-[12px] sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    borderColor: "var(--line)",
                    color: "var(--text-mute)",
                  }}
                >
                  <span>By {post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-medium"
                    style={{
                      color: "#6ee7a7",
                      textDecoration: "none",
                    }}
                  >
                    Read post →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
