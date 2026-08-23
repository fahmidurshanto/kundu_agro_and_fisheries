import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { PRODUCT_CATEGORIES, PRODUCT_UNITS, type Product } from "./product-types";
export { PRODUCT_CATEGORIES, PRODUCT_UNITS, type Product };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

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
  const products = await readProducts();
  return products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProductById(id: string): Promise<Product | null> {
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
  const existing = products.find((product) => product.id === id);
  if (!existing) return null;

  await writeProducts(products.filter((product) => product.id !== id));
  return existing;
}
