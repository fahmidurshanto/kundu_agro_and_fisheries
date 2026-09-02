"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  deleteProductById,
  getProductById,
  PRODUCT_UNITS,
} from "@/lib/products";

export type CreateProductState = {
  error?: string;
  success?: string;
  successId?: string;
};

export type UpdateProductState = {
  error?: string;
};

export type DeleteProductState = {
  error?: string;
  success?: boolean;
};

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
// Local fallback paths (only used if backend is offline)
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const UPLOAD_URL_PREFIX = "/uploads/products/";

function sanitizeFileName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "thumbnail"}${ext || ".jpg"}`;
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

type ParsedProductInput = {
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  compareAtPrice: number | null;
};

type ParsedInputResult =
  | { ok: true; data: ParsedProductInput }
  | { ok: false; error: string };

function parseProductInput(formData: FormData): ParsedInputResult {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const compareAtRaw = String(formData.get("compareAtPrice") ?? "").trim();

  if (!name) return { ok: false, error: "Product name is required." };
  if (name.length > 120) {
    return { ok: false, error: "Product name must be 120 characters or fewer." };
  }
  if (!category) {
    return { ok: false, error: "Please choose or enter a category." };
  }
  if (!PRODUCT_UNITS.includes(unit as (typeof PRODUCT_UNITS)[number])) {
    return { ok: false, error: "Please choose a valid unit." };
  }

  const price = Number(priceRaw);
  if (!priceRaw || Number.isNaN(price) || price <= 0) {
    return { ok: false, error: "Price must be a number greater than 0." };
  }

  let compareAtPrice: number | null = null;
  if (compareAtRaw) {
    compareAtPrice = Number(compareAtRaw);
    if (Number.isNaN(compareAtPrice) || compareAtPrice <= 0) {
      return { ok: false, error: "Old price must be a number greater than 0." };
    }
    if (compareAtPrice <= price) {
      return {
        ok: false,
        error: "Old price should be higher than the current price.",
      };
    }
  }

  return {
    ok: true,
    data: { name, description, category, unit, price, compareAtPrice },
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

async function saveThumbnailLocalFallback(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
  return `${UPLOAD_URL_PREFIX}${fileName}`;
}

async function removeThumbnailFile(thumbnail?: string): Promise<void> {
  if (!thumbnail || typeof thumbnail !== "string" || !thumbnail.startsWith(UPLOAD_URL_PREFIX)) return;
  const filePath = path.join(UPLOAD_DIR, path.basename(thumbnail));
  await unlink(filePath).catch(() => undefined);
}

function hasUploadedImage(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function revalidateAdminPages(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

import { staffApi } from "@/lib/api/axios-instances";

async function sendToBackend(
  endpoint: string,
  method: string,
  payload: Record<string, any>,
  thumbnailFile?: File
): Promise<{ ok: boolean; data?: any; error?: string }> {
  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== null && value !== undefined) {
      form.append(key, String(value));
    }
  }
  if (thumbnailFile) {
    form.append("thumbnail", thumbnailFile);
  }

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

export async function createProduct(
  _prev: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const parsed = parseProductInput(formData);
  if (!parsed.ok) return { error: parsed.error };

  const thumbnail = formData.get("thumbnail");
  if (!(thumbnail instanceof File) || thumbnail.size === 0) {
    return { error: "A thumbnail image is required." };
  }
  const thumbnailError = validateThumbnailFile(thumbnail);
  if (thumbnailError) return { error: thumbnailError };

  // Try backend first
  try {
    const result = await sendToBackend("/admin/products", "POST", parsed.data, thumbnail);
    if (result.ok) {
      revalidateAdminPages();
      const name = result.data?.product?.name || result.data?.data?.name || parsed.data.name;
      return {
        success: `"${name}" has been added.`,
        successId: crypto.randomUUID(),
      };
    }
    return { error: result.error || "Something went wrong while saving the product." };
  } catch (err: any) {
    console.warn("Backend createProduct failed, using local fallback:", err?.message);
  }

  // Local fallback
  try {
    const thumbnailUrl = await saveThumbnailLocalFallback(thumbnail);
    const { addProduct } = await import("@/lib/products");
    const product = await addProduct({ ...parsed.data, thumbnail: thumbnailUrl });
    revalidateAdminPages();
    return {
      success: `"${product.name}" has been added.`,
      successId: crypto.randomUUID(),
    };
  } catch {
    return { error: "Something went wrong while saving the product." };
  }
}

export async function updateProduct(
  _prev: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing product reference." };

  const parsed = parseProductInput(formData);
  if (!parsed.ok) return { error: parsed.error };

  const thumbnail = formData.get("thumbnail");
  const thumbnailFile = hasUploadedImage(thumbnail) ? thumbnail : undefined;
  if (thumbnailFile) {
    const thumbnailError = validateThumbnailFile(thumbnailFile);
    if (thumbnailError) return { error: thumbnailError };
  }

  // Try backend first
  try {
    const result = await sendToBackend(`/admin/products/${id}`, "PUT", parsed.data, thumbnailFile);
    if (result.ok) {
      revalidateAdminPages();
      redirect("/admin/products");
    }
    return { error: result.error || "Something went wrong while updating the product." };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.warn("Backend updateProduct failed, using local fallback:", err?.message);
  }

  // Local fallback
  const existing = await getProductById(id);
  if (!existing) return { error: "This product no longer exists." };

  let thumbnailUrl: string | undefined;
  if (thumbnailFile) {
    try {
      thumbnailUrl = await saveThumbnailLocalFallback(thumbnailFile);
    } catch {
      return { error: "Something went wrong while uploading the thumbnail." };
    }
  }

  try {
    const { updateProductById } = await import("@/lib/products");
    const updated = await updateProductById(id, parsed.data, thumbnailUrl);
    if (!updated) return { error: "This product no longer exists." };
    if (thumbnailUrl) await removeThumbnailFile(existing.thumbnail);
    revalidateAdminPages();
  } catch {
    return { error: "Something went wrong while updating the product." };
  }

  redirect("/admin/products");
}

export async function deleteProduct(
  _prev: DeleteProductState,
  formData: FormData
): Promise<DeleteProductState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing product reference." };

  try {
    const removed = await deleteProductById(id);
    if (!removed) return { error: "This product no longer exists." };
    if (removed.thumbnail) {
      await removeThumbnailFile(removed.thumbnail);
    }
    revalidateAdminPages();
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete product:", err);
    return { error: err?.message || "Something went wrong while deleting the product." };
  }
}
