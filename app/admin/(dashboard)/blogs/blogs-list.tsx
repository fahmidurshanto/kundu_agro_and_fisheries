"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Blog } from "@/lib/blog-types";
import { useLanguage } from "@/app/components/language-context";
import { DeleteBlogButton } from "./delete-blog-button";
import { BlogDetailModal } from "./blog-detail-modal";

type BlogsListProps = {
  blogs: Blog[];
};

export function BlogsList({ blogs }: BlogsListProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const { t, language } = useLanguage();

  if (blogs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-500">{t("noBlogPostsYet")}</p>
        <p className="mt-1 text-xs text-gray-400">
          {t("clickToCreateBlog")}
        </p>
        <Link
          href="/admin/blogs/new"
          className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white"
        >
          {t("createBlog")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4">
                  {t("tableBlog")}
                </th>
                <th scope="col" className="px-6 py-4">
                  {t("tableVideo")}
                </th>
                <th scope="col" className="px-6 py-4">
                  {t("tablePublished")}
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  {t("tableActions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="hover:bg-gray-50/75 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        {blog.thumbnail ? (
                          <Image
                            src={blog.thumbnail || "/placeholder.png"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            {t("none")}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
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
                        {t("included")}
                      </span>
                    ) : (
                      <span className="text-gray-400">{t("none")}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(blog.createdAt).toLocaleDateString(
                      language === "bn" ? "bn-BD" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td
                    className="px-6 py-4 text-right whitespace-nowrap space-x-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedBlog(blog)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {t("view")}
                    </button>
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {t("edit")}
                    </Link>
                    <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BlogDetailModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />
    </>
  );
}

