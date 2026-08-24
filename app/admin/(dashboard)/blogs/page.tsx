import Link from "next/link";
import { getBlogs } from "@/lib/blogs";
import { BlogsList } from "./blogs-list";

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your articles, news, and updates.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          Add New Blog
        </Link>
      </div>

      <BlogsList blogs={blogs} />
    </div>
  );
}

