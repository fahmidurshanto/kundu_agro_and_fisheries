"use client";

import Image from "next/image";
import { Modal } from "@/app/components/modal";
import { type Blog } from "@/lib/blog-types";

type BlogDetailModalProps = {
  blog: Blog | null;
  onClose: () => void;
};

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (parsed.pathname.startsWith("/embed/")) return url;
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // If not a valid URL structure, return null
  }
  return null;
}

export function BlogDetailModal({ blog, onClose }: BlogDetailModalProps) {
  if (!blog) return null;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const youtubeEmbedUrl = blog.videoUrl ? getYouTubeEmbedUrl(blog.videoUrl) : null;

  return (
    <Modal isOpen={!!blog} onClose={onClose} title="Blog Details" maxWidth="lg">
      <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* YouTube Video iframe or Thumbnail Image */}
        {youtubeEmbedUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-gray-100 shadow-sm">
            <iframe
              src={youtubeEmbedUrl}
              title={blog.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : blog.thumbnail ? (
          <div className="relative h-60 w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        {/* Header section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {blog.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>Published: {formattedDate}</span>
            {blog.videoUrl && (
              <>
                <span>•</span>
                <a
                  href={blog.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Open Original Video
                </a>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Short Description */}
        {blog.description && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 text-xs text-gray-600 italic">
            <span className="font-semibold text-gray-700 not-italic block mb-1">
              Summary:
            </span>
            {blog.description}
          </div>
        )}

        {/* Full Content */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Content
          </h3>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-sans">
            {blog.content}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

