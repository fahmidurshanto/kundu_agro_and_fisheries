"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  deleteBlogById,
  getBlogById,
} from "@/lib/blogs";

export type CreateBlogState = {
  error?: string;
  success?: string;
  successId?: string;
};

export type UpdateBlogState = {
  error?: string;
};

export type DeleteBlogState = {
  error?: string;
  success?: boolean;
};

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
]);

// Local fallback paths (only used if backend is offline)
const THUMBNAIL_DIR = path.join(process.cwd(), "public", "uploads", "blogs");
const THUMBNAIL_PREFIX = "/uploads/blogs/";

const VIDEO_DIR = path.join(process.cwd(), "public", "uploads", "blog-videos");
const VIDEO_PREFIX = "/uploads/blog-videos/";

function sanitizeFileName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "file"}${ext || ".bin"}`;
}

async function requireSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(
    await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  );
}

async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
}

type ParsedBlogInput = {
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  tags?: string[];
};

type ParsedInputResult =
  | { ok: true; data: ParsedBlogInput }
  | { ok: false; error: string };

function parseBlogInput(formData: FormData): ParsedInputResult {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const videoUrlRaw = String(formData.get("videoUrl") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!title) return { ok: false, error: "Blog title is required." };
  if (title.length > 150) {
    return { ok: false, error: "Blog title must be 150 characters or fewer." };
  }
  if (!description) return { ok: false, error: "Blog description is required." };
  if (!content) return { ok: false, error: "Blog content is required." };

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : undefined;

  return {
    ok: true,
    data: {
      title,
      description,
      content,
      videoUrl: videoUrlRaw || undefined,
      tags,
    },
  };
}

function validateThumbnailFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Thumbnail must be a JPG, PNG, WebP or AVIF image.";
  }
  if (file.size > MAX_THUMBNAIL_SIZE) {
    return "Thumbnail must be 5 MB or smaller.";
  }
  return null;
}

function validateVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
    return "Video must be an MP4, WebM or OGG file.";
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return "Video file must be 50 MB or smaller.";
  }
  return null;
}

async function saveThumbnailLocalFallback(file: File): Promise<string> {
  await mkdir(THUMBNAIL_DIR, { recursive: true });
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(THUMBNAIL_DIR, fileName), buffer);
  return `${THUMBNAIL_PREFIX}${fileName}`;
}

async function saveVideoLocalFallback(file: File): Promise<string> {
  await mkdir(VIDEO_DIR, { recursive: true });
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(VIDEO_DIR, fileName), buffer);
  return `${VIDEO_PREFIX}${fileName}`;
}

async function removeThumbnailFile(thumbnail?: string): Promise<void> {
  if (!thumbnail || typeof thumbnail !== "string" || !thumbnail.startsWith(THUMBNAIL_PREFIX)) return;
  const filePath = path.join(THUMBNAIL_DIR, path.basename(thumbnail));
  await unlink(filePath).catch(() => undefined);
}

async function removeVideoFile(videoUrl?: string): Promise<void> {
  if (!videoUrl || typeof videoUrl !== "string" || !videoUrl.startsWith(VIDEO_PREFIX)) return;
  const filePath = path.join(VIDEO_DIR, path.basename(videoUrl));
  await unlink(filePath).catch(() => undefined);
}

function hasUploadedFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function revalidateAdminPages(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");
}

import { staffApi } from "@/lib/api/axios-instances";

async function sendToBackend(
  endpoint: string,
  method: string,
  payload: Record<string, any>,
  thumbnailFile?: File,
  videoFile?: File
): Promise<{ ok: boolean; data?: any; error?: string }> {
  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => form.append(key, String(v)));
      } else {
        form.append(key, String(value));
      }
    }
  }
  if (thumbnailFile) form.append("thumbnail", thumbnailFile);
  if (videoFile) form.append("video", videoFile);

  try {
    const res = await staffApi.request({
      url: endpoint,
      method: method.toUpperCase(),
      data: form,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { ok: true, data: res.data };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to communicate with backend" };
  }
}

export async function createBlog(
  _prev: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const parsed = parseBlogInput(formData);
  if (!parsed.ok) return { error: parsed.error };

  const thumbnail = formData.get("thumbnail");
  if (!(thumbnail instanceof File) || thumbnail.size === 0) {
    return { error: "A thumbnail image is required." };
  }
  const thumbnailError = validateThumbnailFile(thumbnail);
  if (thumbnailError) return { error: thumbnailError };

  const videoFileEntry = formData.get("videoFile");
  const videoFile = hasUploadedFile(videoFileEntry) ? videoFileEntry : undefined;
  if (videoFile) {
    const videoError = validateVideoFile(videoFile);
    if (videoError) return { error: videoError };
  }

  // Try backend first
  try {
    const result = await sendToBackend(
      "/admin/blogs",
      "POST",
      {
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.data.content,
        videoUrl: parsed.data.videoUrl,
        tags: parsed.data.tags,
      },
      thumbnail,
      videoFile
    );
    if (result.ok) {
      revalidateAdminPages();
      const title = result.data?.blog?.title || result.data?.data?.title || parsed.data.title;
      return {
        success: `"${title}" has been published.`,
        successId: crypto.randomUUID(),
      };
    }
    return { error: result.error || "Something went wrong while saving the blog post." };
  } catch (err: any) {
    console.warn("Backend createBlog failed, using local fallback:", err?.message);
  }

  // Local fallback
  let videoUrl = parsed.data.videoUrl;
  if (videoFile) {
    try {
      videoUrl = await saveVideoLocalFallback(videoFile);
    } catch {
      return { error: "Something went wrong while uploading the video." };
    }
  }

  try {
    const thumbnailUrl = await saveThumbnailLocalFallback(thumbnail);
    const { addBlog } = await import("@/lib/blogs");
    const blog = await addBlog({
      ...parsed.data,
      thumbnail: thumbnailUrl,
      videoUrl,
    });
    revalidateAdminPages();
    return {
      success: `"${blog.title}" has been published.`,
      successId: crypto.randomUUID(),
    };
  } catch {
    return { error: "Something went wrong while saving the blog post." };
  }
}

export async function updateBlog(
  _prev: UpdateBlogState,
  formData: FormData
): Promise<UpdateBlogState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing blog reference." };

  const parsed = parseBlogInput(formData);
  if (!parsed.ok) return { error: parsed.error };

  const thumbnail = formData.get("thumbnail");
  const thumbnailFile = hasUploadedFile(thumbnail) ? thumbnail : undefined;
  if (thumbnailFile) {
    const thumbnailError = validateThumbnailFile(thumbnailFile);
    if (thumbnailError) return { error: thumbnailError };
  }

  const videoFileEntry = formData.get("videoFile");
  const videoFile = hasUploadedFile(videoFileEntry) ? videoFileEntry : undefined;
  if (videoFile) {
    const videoError = validateVideoFile(videoFile);
    if (videoError) return { error: videoError };
  }

  // Try backend first
  try {
    const result = await sendToBackend(
      `/admin/blogs/${id}`,
      "PUT",
      {
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.data.content,
        videoUrl: parsed.data.videoUrl,
        tags: parsed.data.tags,
      },
      thumbnailFile,
      videoFile
    );
    if (result.ok) {
      revalidateAdminPages();
      redirect("/admin/blogs");
    }
    return { error: result.error || "Something went wrong while updating the blog." };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.warn("Backend updateBlog failed, using local fallback:", err?.message);
  }

  // Local fallback
  const existing = await getBlogById(id);
  if (!existing) return { error: "This blog no longer exists." };

  let thumbnailUrl: string | undefined;
  if (thumbnailFile) {
    try {
      thumbnailUrl = await saveThumbnailLocalFallback(thumbnailFile);
    } catch {
      return { error: "Something went wrong while uploading the thumbnail." };
    }
  }

  let videoUrl = parsed.data.videoUrl ?? existing.videoUrl;
  if (videoFile) {
    try {
      videoUrl = await saveVideoLocalFallback(videoFile);
      if (existing.videoUrl) await removeVideoFile(existing.videoUrl);
    } catch {
      return { error: "Something went wrong while uploading the video." };
    }
  }

  try {
    const { updateBlogById } = await import("@/lib/blogs");
    const updated = await updateBlogById(
      id,
      { ...parsed.data, videoUrl },
      thumbnailUrl
    );
    if (!updated) return { error: "This blog no longer exists." };
    if (thumbnailUrl) await removeThumbnailFile(existing.thumbnail);
    revalidateAdminPages();
  } catch {
    return { error: "Something went wrong while updating the blog." };
  }

  redirect("/admin/blogs");
}

export async function deleteBlog(
  _prev: DeleteBlogState,
  formData: FormData
): Promise<DeleteBlogState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing blog reference." };

  try {
    const removed = await deleteBlogById(id);
    if (!removed) return { error: "This blog no longer exists." };
    if (removed.thumbnail) {
      await removeThumbnailFile(removed.thumbnail);
    }
    if (removed.videoUrl) {
      await removeVideoFile(removed.videoUrl);
    }
    revalidateAdminPages();
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete blog:", err);
    return { error: err?.message || "Something went wrong while deleting the blog." };
  }
}
