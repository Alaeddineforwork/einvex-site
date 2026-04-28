import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface PostFrontmatter {
  title: string;
  summary: string;
  date: string; // ISO YYYY-MM-DD
  author: string;
  tags: string[];
  cover?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingMinutes: number;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readMdx(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const parsed = matter(raw);
  const fm = parsed.data as PostFrontmatter;
  const stats = readingTime(parsed.content);
  return {
    slug,
    title: fm.title,
    summary: fm.summary,
    date: fm.date,
    author: fm.author,
    tags: fm.tags ?? [],
    cover: fm.cover,
    content: parsed.content,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"));
  return files
    .map(readMdx)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const filename = `${slug}.mdx`;
  if (!fs.existsSync(path.join(POSTS_DIR, filename))) return null;
  return readMdx(filename);
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
