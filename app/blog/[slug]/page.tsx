import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  formatPostDate,
  getPostBySlug,
  getPostSlugs,
} from "../../lib/posts";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post — EinveX" };
  return {
    title: `${post.title} - EinveX News`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container py-8 md:py-10">
        <div className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-[12px]">
          <Link
            href="/blog"
            style={{ color: "var(--text-mute)", textDecoration: "none" }}
            className="hover:underline"
          >
            ← News
          </Link>
          <span style={{ color: "var(--text-mute)" }}>/</span>
              <span className="min-w-0 break-words" style={{ color: "var(--text-dim)" }}>{post.slug}</span>
        </div>

        <article className="mx-auto max-w-3xl">
          <header className="mb-8">
            <div
              className="flex flex-wrap items-center gap-2 text-[11px]"
              style={{ color: "var(--text-mute)" }}
            >
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingMinutes} min read</span>
              <span>·</span>
              <span>By {post.author}</span>
            </div>

            <h1
              className="mt-4 text-[30px] font-semibold tracking-tight sm:text-[36px]"
              style={{
                color: "var(--text)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {post.title}
            </h1>

            <p
              className="mt-4 text-[15px] leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              {post.summary}
            </p>

            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose-dark">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>

          <footer
            className="mt-12 flex flex-col gap-2 border-t pt-5 text-[13px] sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: "var(--line)",
              color: "var(--text-mute)",
            }}
          >
            <Link
              href="/blog"
              style={{ color: "#6ee7a7", textDecoration: "none" }}
            >
              ← Back to all news
            </Link>
            <span>Written by {post.author}</span>
          </footer>
        </article>
      </section>
    </main>
  );
}
