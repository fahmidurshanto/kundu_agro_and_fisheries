import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";
import { BlogForm } from "../new/blog-form";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

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
          Edit Blog Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Update blog details, thumbnail, video or tags.
        </p>
      </div>

      <BlogForm blog={blog} />
    </div>
  );
}
