import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { adminFetch, adminFetchFormData } from "./api/admin-client";
import { PRODUCT_CATEGORIES, PRODUCT_UNITS, type Product } from "./product-types";
export { PRODUCT_CATEGORIES, PRODUCT_UNITS, type Product };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

function formatBackendProduct(p: any): Product {
  console.log("📦 [DEBUG] Raw Product object from backend API:", JSON.stringify(p, null, 2));
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  let thumbnail = p.thumbnail || p.image || p.imageUrl || "";
  if (thumbnail && !thumbnail.startsWith("http://") && !thumbnail.startsWith("https://")) {
    const cleanPath = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
    thumbnail = `${backendBase}${cleanPath}`;
  }
  return {
    id: p._id || p.id,
    slug: p.slug || "",
    name: p.name || "",
    description: p.description || "",
    category: p.category || "",
    price: Number(p.price || 0),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    unit: p.unit || "kg",
    thumbnail: thumbnail,
    createdAt: p.createdAt || new Date().toISOString(),
    sellerName: p.sellerName,
    sellerDistrict: p.sellerDistrict,
    sellerPhone: p.sellerPhone,
  };
}

async function readProducts(): Promise<Product[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

async function writeProducts(products: Product[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await adminFetch<any[]>("/products");
    const list = res.data || res.products || (Array.isArray(res) ? res : null);
    if (list && Array.isArray(list)) {
      return list.map(formatBackendProduct);
    }
  } catch (err) {
    console.warn("Backend products fetch failed, using local data fallback:", err);
  }

  const products = await readProducts();
  return products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await adminFetch<any>(`/products/${id}`);
    const item = res.data || res.product || res;
    if (item && (item._id || item.id)) {
      return formatBackendProduct(item);
    }
  } catch (err) {
    console.warn(`Backend product fetch for ${id} failed, using local fallback:`, err);
  }

  const products = await readProducts();
  return products.find((product) => product.id === id) ?? null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function addProduct(
  input: Omit<Product, "id" | "slug" | "createdAt">
): Promise<Product> {
  try {
    const res = await adminFetch<any>("/admin/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
    const created = res.data || res.product;
    if (created) return formatBackendProduct(created);
  } catch (err) {
    console.warn("Backend addProduct failed, saving locally:", err);
  }

  const products = await readProducts();
  const baseSlug = slugify(input.name) || "product";
  let slug = baseSlug;
  let suffix = 2;
  while (products.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    slug,
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  await writeProducts(products);
  return product;
}

export async function updateProductById(
  id: string,
  input: Omit<Product, "id" | "slug" | "createdAt" | "thumbnail">,
  thumbnail?: string
): Promise<Product | null> {
  try {
    const res = await adminFetch<any>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...input, thumbnail }),
    });
    const updated = res.data || res.product;
    if (updated) return formatBackendProduct(updated);
  } catch (err) {
    console.warn(`Backend updateProductById for ${id} failed, saving locally:`, err);
  }

  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  const existing = products[index];
  let slug = existing.slug;
  if (existing.name !== input.name) {
    const baseSlug = slugify(input.name) || "product";
    slug = baseSlug;
    let suffix = 2;
    while (products.some((p, i) => i !== index && p.slug === slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  const updated: Product = {
    ...existing,
    ...input,
    thumbnail: thumbnail ?? existing.thumbnail,
    slug,
  };
  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProductById(id: string): Promise<Product | null> {
  const products = await readProducts();
  const existing = products.find((product) => product.id === id) || ({ id, thumbnail: "" } as Product);

  try {
    const res = await adminFetch<any>(`/admin/products/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      await writeProducts(products.filter((product) => product.id !== id));
      return existing;
    }
  } catch (err) {
    console.warn(`Backend deleteProductById for ${id} failed, deleting locally:`, err);
  }

  const localProduct = products.find((product) => product.id === id);
  if (localProduct) {
    await writeProducts(products.filter((product) => product.id !== id));
    return localProduct;
  }
  return existing;
}

