"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { Blog } from "@/lib/blog-types";
import {
  createBlog,
  updateBlog,
  type CreateBlogState,
  type UpdateBlogState,
} from "../actions";

type BlogFormProps = {
  blog?: Blog;
};

export function BlogForm({ blog }: BlogFormProps) {
  const isEditing = Boolean(blog);

  const [createState, createAction, isCreatePending] = useActionState(
    createBlog,
    {} as CreateBlogState
  );
  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateBlog,
    {} as UpdateBlogState
  );

  const isPending = isCreatePending || isUpdatePending;
  const error = isEditing ? updateState.error : createState.error;

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(
    blog?.thumbnail ?? null
  );

  const [videoMode, setVideoMode] = useState<"url" | "file">(
    blog?.videoUrl && blog.videoUrl.startsWith("/uploads/") ? "file" : "url"
  );

  useEffect(() => {
    if (createState.successId) {
      setPreviewThumbnail(null);
    }
  }, [createState.successId]);

  return (
    <form
      action={isEditing ? updateAction : createAction}
      className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      {isEditing && <input type="hidden" name="id" value={blog.id} />}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {createState.success && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {createState.success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blog Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          defaultValue={blog?.title ?? ""}
          required
          maxLength={150}
          placeholder="e.g. Modern Agricultural Practices in 2026"
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Short Description / Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={blog?.description ?? ""}
          required
          placeholder="A brief summary of the blog post to display in cards or previews..."
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          rows={8}
          defaultValue={blog?.content ?? ""}
          required
          placeholder="Write your blog post content here..."
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans"
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Thumbnail Image {!isEditing && <span className="text-red-500">*</span>}
        </label>
        {previewThumbnail && (
          <div className="relative mt-2 h-40 w-full max-w-sm overflow-hidden rounded-xl border border-gray-200">
            <Image
              src={previewThumbnail}
              alt="Thumbnail preview"
              fill
              className="object-cover"
            />
          </div>
        )}
        <input
          type="file"
          name="thumbnail"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required={!isEditing}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreviewThumbnail(URL.createObjectURL(file));
            }
          }}
          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-gray-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          Allowed: JPG, PNG, WebP, AVIF. Max 5 MB.
        </p>
      </div>

      {/* Video Options */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Video (Optional)
        </label>
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="videoModeChoice"
              checked={videoMode === "url"}
              onChange={() => setVideoMode("url")}
              className="accent-primary"
            />
            <span>YouTube / Video URL</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="videoModeChoice"
              checked={videoMode === "file"}
              onChange={() => setVideoMode("file")}
              className="accent-primary"
            />
            <span>Upload Video File</span>
          </label>
        </div>

        {videoMode === "url" ? (
          <div>
            <input
              type="url"
              name="videoUrl"
              defaultValue={blog?.videoUrl && !blog.videoUrl.startsWith("/uploads/") ? blog.videoUrl : ""}
              placeholder="https://www.youtube.com/watch?v=..."
              className="block w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            />
          </div>
        ) : (
          <div>
            {blog?.videoUrl && blog.videoUrl.startsWith("/uploads/") && (
              <p className="mb-2 text-xs text-gray-600">
                Current video: <span className="font-mono">{blog.videoUrl}</span>
              </p>
            )}
            <input
              type="file"
              name="videoFile"
              accept="video/mp4,video/webm,video/ogg"
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Allowed: MP4, WebM, OGG. Max 50 MB.
            </p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (Optional)
        </label>
        <input
          type="text"
          name="tags"
          defaultValue={blog?.tags?.join(", ") ?? ""}
          placeholder="e.g. Agriculture, Fish Farming, Organic"
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/admin/blogs"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending
            ? isEditing
              ? "Saving..."
              : "Publishing..."
            : isEditing
            ? "Update Blog"
            : "Publish Blog"}
        </button>
      </div>
    </form>
  );
}
