import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface InventoryItem {
  id: string;
  sellerId: string;
  speciesName: string;
  sizeCategory: string;
  ageDays: number;
  pricePerThousand: number;
  stockQuantity: string;
  isAvailable: boolean;
  updatedAt: string;
}

export interface SellerInquiry {
  id: string;
  sellerId: string;
  farmerName: string;
  phone: string;
  district: string;
  requestedSpecies: string;
  requestedQuantity: string;
  message: string;
  status: "New" | "Contacted" | "Fulfilled" | "Cancelled";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const INV_FILE = path.join(DATA_DIR, "fish_seed_inventory.json");
const INQ_FILE = path.join(DATA_DIR, "seller_inquiries.json");

export async function getSellerInventory(sellerId: string): Promise<InventoryItem[]> {
  try {
    const raw = await readFile(INV_FILE, "utf8");
    const parsed = JSON.parse(raw) as InventoryItem[];
    return parsed.filter((item) => item.sellerId === sellerId);
  } catch {
    return [];
  }
}

export async function addSellerInventoryItem(
  input: Omit<InventoryItem, "id" | "updatedAt">
): Promise<InventoryItem> {
  let all: InventoryItem[] = [];
  try {
    const raw = await readFile(INV_FILE, "utf8");
    all = JSON.parse(raw);
  } catch {
    all = [];
  }

  const newItem: InventoryItem = {
    ...input,
    id: `inv_${Date.now().toString().slice(-6)}`,
    updatedAt: new Date().toISOString(),
  };

  all.unshift(newItem);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(INV_FILE, JSON.stringify(all, null, 2), "utf8");
  return newItem;
}

export async function toggleInventoryAvailability(id: string): Promise<boolean> {
  try {
    const raw = await readFile(INV_FILE, "utf8");
    const all = JSON.parse(raw) as InventoryItem[];
    const idx = all.findIndex((item) => item.id === id);
    if (idx === -1) return false;

    all[idx].isAvailable = !all[idx].isAvailable;
    all[idx].updatedAt = new Date().toISOString();
    await writeFile(INV_FILE, JSON.stringify(all, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function getSellerInquiries(sellerId: string): Promise<SellerInquiry[]> {
  try {
    const raw = await readFile(INQ_FILE, "utf8");
    const parsed = JSON.parse(raw) as SellerInquiry[];
    return parsed.filter((inq) => inq.sellerId === sellerId);
  } catch {
    return [];
  }
}
