"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  addProduct,
  deleteProductById,
  getProductById,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  updateProductById,
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

async function saveThumbnailFile(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
  return `${UPLOAD_URL_PREFIX}${fileName}`;
}

async function removeThumbnailFile(thumbnail: string): Promise<void> {
  if (!thumbnail.startsWith(UPLOAD_URL_PREFIX)) return;
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

  try {
    const thumbnailUrl = await saveThumbnailFile(thumbnail);
    const product = await addProduct({ ...parsed.data, thumbnail: thumbnailUrl });
    revalidateAdminPages();
    return {
      success: `“${product.name}” has been added.`,
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

  const existing = await getProductById(id);
  if (!existing) return { error: "This product no longer exists." };

  const parsed = parseProductInput(formData);
  if (!parsed.ok) return { error: parsed.error };

  let thumbnailUrl: string | undefined;
  const thumbnail = formData.get("thumbnail");
  if (hasUploadedImage(thumbnail)) {
    const thumbnailError = validateThumbnailFile(thumbnail);
    if (thumbnailError) return { error: thumbnailError };
    try {
      thumbnailUrl = await saveThumbnailFile(thumbnail);
    } catch {
      return { error: "Something went wrong while uploading the thumbnail." };
    }
  }

  try {
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
    await removeThumbnailFile(removed.thumbnail);
    revalidateAdminPages();
    return { success: true };
  } catch {
    return { error: "Something went wrong while deleting the product." };
  }
}
