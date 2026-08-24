import { getBlogs } from "@/lib/blogs";
import { BlogsList } from "./blogs-list";
import { BlogsHeader } from "./blogs-header";

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6">
      <BlogsHeader />
      <BlogsList blogs={blogs} />
    </div>
  );
}


