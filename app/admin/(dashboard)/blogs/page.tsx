import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/lib/blogs";
import { DeleteBlogButton } from "./delete-blog-button";

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

      {blogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-500">No blog posts yet.</p>
          <p className="mt-1 text-xs text-gray-400">
            Click "Add New Blog" to write your first article.
          </p>
          <Link
            href="/admin/blogs/new"
            className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white"
          >
            Create Blog
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Blog
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Video
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Published
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                          {blog.thumbnail ? (
                            <Image
                              src={blog.thumbnail}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-md">
                            {blog.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {blog.videoUrl ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          Included
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                      <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
