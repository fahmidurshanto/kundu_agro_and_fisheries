import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { type Blog } from "./blog-types";
import { slugify } from "./products";

export { type Blog };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "blogs.json");

async function readBlogs(): Promise<Blog[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Blog[]) : [];
  } catch {
    return [];
  }
}

async function writeBlogs(blogs: Blog[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(blogs, null, 2), "utf8");
}

export async function getBlogs(): Promise<Blog[]> {
  const blogs = await readBlogs();
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const blogs = await readBlogs();
  return blogs.find((blog) => blog.id === id) ?? null;
}

export async function addBlog(
  input: Omit<Blog, "id" | "slug" | "createdAt">
): Promise<Blog> {
  const blogs = await readBlogs();

  const baseSlug = slugify(input.title) || "blog";
  let slug = baseSlug;
  let suffix = 2;
  while (blogs.some((b) => b.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const blog: Blog = {
    ...input,
    id: crypto.randomUUID(),
    slug,
    createdAt: new Date().toISOString(),
  };

  blogs.push(blog);
  await writeBlogs(blogs);
  return blog;
}

export async function updateBlogById(
  id: string,
  input: Omit<Blog, "id" | "slug" | "createdAt" | "thumbnail">,
  thumbnail?: string
): Promise<Blog | null> {
  const blogs = await readBlogs();
  const index = blogs.findIndex((blog) => blog.id === id);
  if (index === -1) return null;

  const existing = blogs[index];
  let slug = existing.slug;
  if (existing.title !== input.title) {
    const baseSlug = slugify(input.title) || "blog";
    slug = baseSlug;
    let suffix = 2;
    while (blogs.some((b, i) => i !== index && b.slug === slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  const updated: Blog = {
    ...existing,
    ...input,
    thumbnail: thumbnail ?? existing.thumbnail,
    slug,
  };
  blogs[index] = updated;
  await writeBlogs(blogs);
  return updated;
}

export async function deleteBlogById(id: string): Promise<Blog | null> {
  const blogs = await readBlogs();
  const existing = blogs.find((blog) => blog.id === id);
  if (!existing) return null;

  await writeBlogs(blogs.filter((blog) => blog.id !== id));
  return existing;
}
