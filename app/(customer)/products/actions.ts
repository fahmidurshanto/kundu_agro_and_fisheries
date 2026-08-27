"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { addProduct } from "@/lib/products";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const UPLOAD_URL_PREFIX = "/uploads/products/";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export type AddFishSeedResult = {
  success?: boolean;
  error?: string;
};

export async function addFishSeedProductAction(
  formData: FormData
): Promise<AddFishSeedResult> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim() || "piece";
  const sellerName = String(formData.get("sellerName") ?? "").trim();
  const sellerDistrict = String(formData.get("sellerDistrict") ?? "").trim();
  const sellerPhone = String(formData.get("sellerPhone") ?? "").trim();
  const imageUrlInput = String(formData.get("imageUrl") ?? "").trim();
  const thumbnailFile = formData.get("thumbnail");

  if (!name) {
    return { error: "Product name is required / পণ্যের নাম আবশ্যক।" };
  }
  if (!sellerName) {
    return { error: "Seller name is required / বিক্রেতার নাম আবশ্যক।" };
  }
  if (!sellerDistrict) {
    return { error: "Seller district is required / জেলা নির্বাচন করুন।" };
  }
  if (!sellerPhone) {
    return { error: "Contact phone number is required / মোবাইল নম্বর আবশ্যক।" };
  }

  const price = Number(priceRaw);
  if (!priceRaw || Number.isNaN(price) || price <= 0) {
    return { error: "Please enter a valid price / সঠিক মূল্য লিখুন।" };
  }

  let finalThumbnail = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80";

  if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(thumbnailFile.type)) {
      return { error: "Image must be JPG, PNG, WebP, or AVIF." };
    }
    if (thumbnailFile.size > 5 * 1024 * 1024) {
      return { error: "Image file size must be smaller than 5MB." };
    }
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(thumbnailFile.name) || ".jpg";
      const fileName = `${Date.now()}-seed-${Math.random().toString(36).substring(2, 7)}${ext}`;
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
      finalThumbnail = `${UPLOAD_URL_PREFIX}${fileName}`;
    } catch (err) {
      console.error("Failed to save image:", err);
      return { error: "Failed to upload image. Please try again." };
    }
  } else if (imageUrlInput) {
    finalThumbnail = imageUrlInput;
  }

  try {
    await addProduct({
      name,
      description: description || `Quality fish seed supplied by ${sellerName} from ${sellerDistrict}.`,
      category: "Fish seed / মাছের পোনা",
      price,
      compareAtPrice: null,
      unit,
      thumbnail: finalThumbnail,
      sellerName,
      sellerDistrict,
      sellerPhone,
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to add fish seed product:", err);
    return { error: "Server error while saving product. Please try again." };
  }
}
