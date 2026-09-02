import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { adminFetch } from "./api/admin-client";
import { type Blog } from "./blog-types";
import { slugify } from "./products";

export { type Blog };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "blogs.json");

function formatBackendBlog(b: any): Blog {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  let thumbnail = b.thumbnail || b.image || "";
  if (thumbnail && !thumbnail.startsWith("http://") && !thumbnail.startsWith("https://")) {
    const cleanPath = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
    thumbnail = `${backendBase}${cleanPath}`;
  }
  let videoUrl = b.videoUrl || b.video || "";
  if (videoUrl && videoUrl.startsWith("/uploads")) {
    videoUrl = `${backendBase}${videoUrl}`;
  }

  return {
    id: b._id || b.id,
    slug: b.slug || "",
    title: b.title || "",
    description: b.description || "",
    content: b.content || "",
    thumbnail: thumbnail,
    videoUrl: videoUrl || undefined,
    tags: b.tags || [],
    createdAt: b.createdAt || new Date().toISOString(),
  };
}

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
  try {
    const res = await adminFetch<any[]>("/blogs");
    const list = res.data || res.blogs || (Array.isArray(res) ? res : null);
    if (list && Array.isArray(list)) {
      return list.map(formatBackendBlog);
    }
  } catch (err) {
    console.warn("Backend blogs fetch failed, using local data fallback:", err);
  }

  const blogs = await readBlogs();
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const res = await adminFetch<any>(`/blogs/${id}`);
    const item = res.data || res.blog || res;
    if (item && (item._id || item.id)) {
      return formatBackendBlog(item);
    }
  } catch (err) {
    console.warn(`Backend blog fetch for ${id} failed, using local fallback:`, err);
  }

  const blogs = await readBlogs();
  return blogs.find((blog) => blog.id === id) ?? null;
}

export async function addBlog(
  input: Omit<Blog, "id" | "slug" | "createdAt">
): Promise<Blog> {
  try {
    const res = await adminFetch<any>("/admin/blogs", {
      method: "POST",
      body: JSON.stringify(input),
    });
    const created = res.data || res.blog;
    if (created) return formatBackendBlog(created);
  } catch (err) {
    console.warn("Backend addBlog failed, saving locally:", err);
  }

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
  try {
    const res = await adminFetch<any>(`/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...input, thumbnail }),
    });
    const updated = res.data || res.blog;
    if (updated) return formatBackendBlog(updated);
  } catch (err) {
    console.warn(`Backend updateBlogById for ${id} failed, saving locally:`, err);
  }

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
  const existing = blogs.find((blog) => blog.id === id) || ({ id, thumbnail: "" } as Blog);

  try {
    const res = await adminFetch<any>(`/admin/blogs/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      await writeBlogs(blogs.filter((blog) => blog.id !== id));
      return existing;
    }
  } catch (err) {
    console.warn(`Backend deleteBlogById for ${id} failed, deleting locally:`, err);
  }

  const localBlog = blogs.find((blog) => blog.id === id);
  if (localBlog) {
    await writeBlogs(blogs.filter((blog) => blog.id !== id));
    return localBlog;
  }
  return existing;
}

