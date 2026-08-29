"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SELLER_SESSION_COOKIE, createSellerSessionToken, verifySellerSession } from "@/lib/seller-session";
import { addProduct, deleteProductById, getProducts } from "@/lib/products";
import { FISH_SEED_CATEGORY } from "@/lib/seller-constants";

export type SellerLoginState = { error?: string };
export type AddProductState = { error?: string; success?: string; successId?: string };
export type DeleteProductState = { error?: string; success?: boolean };

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginSellerAction(
  _prev: SellerLoginState,
  formData: FormData
): Promise<SellerLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "Please enter your seller email and password." };
  }

  if (email.toLowerCase() === "seller@padmahatchery.com" || email.includes("seller")) {
    const token = await createSellerSessionToken("seller_101");
    const cookieStore = await cookies();
    cookieStore.set(SELLER_SESSION_COOKIE, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/seller");
  }

  return { error: "Invalid seller credentials. Try: seller@padmahatchery.com" };
}

export async function logoutSellerAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SELLER_SESSION_COOKIE);
  redirect("/seller/login");
}

// ─── Seller Products (Fish Seed only via main product catalog) ─────────────────

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const UPLOAD_URL_PREFIX = "/uploads/products/";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function sanitize(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "thumbnail"}${ext || ".jpg"}`;
}

async function saveImage(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${sanitize(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
  return `${UPLOAD_URL_PREFIX}${fileName}`;
}

export async function addSellerProductAction(
  _prev: AddProductState,
  formData: FormData
): Promise<AddProductState> {
  const seller = await verifySellerSession();
  if (!seller) return { error: "Your session has expired. Please sign in again." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const compareAtRaw = String(formData.get("compareAtPrice") ?? "").trim();

  if (!name) return { error: "Product name is required." };
  if (name.length > 120) return { error: "Product name must be 120 characters or fewer." };

  const validUnits = ["kg", "gram", "litre", "piece", "dozen", "pack", "thousand / হাজার"];
  if (!validUnits.includes(unit)) return { error: "Please choose a valid unit." };

  const price = Number(priceRaw);
  if (!priceRaw || isNaN(price) || price <= 0) return { error: "Price must be a positive number." };

  let compareAtPrice: number | null = null;
  if (compareAtRaw) {
    compareAtPrice = Number(compareAtRaw);
    if (isNaN(compareAtPrice) || compareAtPrice <= 0)
      return { error: "Old price must be a positive number." };
    if (compareAtPrice <= price)
      return { error: "Old price should be higher than the current selling price." };
  }

  const thumbnail = formData.get("thumbnail");
  if (!(thumbnail instanceof File) || thumbnail.size === 0)
    return { error: "A thumbnail image is required." };
  if (!ALLOWED_TYPES.has(thumbnail.type))
    return { error: "Thumbnail must be JPG, PNG, WebP or AVIF." };
  if (thumbnail.size > MAX_SIZE)
    return { error: "Thumbnail must be 5 MB or smaller." };

  try {
    const thumbnailUrl = await saveImage(thumbnail);
    const product = await addProduct({
      name,
      description,
      category: FISH_SEED_CATEGORY,  // ← always locked
      unit,
      price,
      compareAtPrice,
      thumbnail: thumbnailUrl,
      sellerName: seller.hatcheryName,
      sellerDistrict: seller.district,
      sellerPhone: seller.phone,
    });

    revalidatePath("/seller");
    revalidatePath("/seller/products");
    revalidatePath("/products");
    return { success: `"${product.name}" added to the catalog.`, successId: crypto.randomUUID() };
  } catch {
    return { error: "Something went wrong while saving the product." };
  }
}

export async function getSellerProducts() {
  const seller = await verifySellerSession();
  const all = await getProducts();
  return all.filter(
    (p) =>
      p.category === FISH_SEED_CATEGORY &&
      p.sellerName === seller?.hatcheryName
  );
}

export async function deleteSellerProductAction(
  _prev: DeleteProductState,
  formData: FormData
): Promise<DeleteProductState> {
  const seller = await verifySellerSession();
  if (!seller) return { error: "Session expired." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing product ID." };

  try {
    const removed = await deleteProductById(id);
    if (!removed) return { error: "Product not found." };
    revalidatePath("/seller");
    revalidatePath("/seller/products");
    revalidatePath("/products");
    return { success: true };
  } catch {
    return { error: "Failed to delete product." };
  }
}
