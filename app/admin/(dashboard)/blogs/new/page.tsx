import { BlogForm } from "./blog-form";
import { NewBlogHeader } from "./new-blog-header";

export default function NewBlogPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <NewBlogHeader />
      <BlogForm />
    </div>
  );
}

