import { getBlogs } from "@/lib/blogs";
import { PublicBlogsContent } from "@/app/(customer)/public-blogs-content";

export default async function CustomerBlogsPage() {
  const blogs = await getBlogs();

  return <PublicBlogsContent blogs={blogs} />;
}


