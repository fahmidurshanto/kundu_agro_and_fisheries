import Link from "next/link";
import { BlogForm } from "./blog-form";

export default function NewBlogPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/blogs"
          className="text-xs font-medium text-muted-foreground hover:text-primary"
        >
          ← Back to Blogs
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Create New Blog Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to publish a new article with images and videos.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
