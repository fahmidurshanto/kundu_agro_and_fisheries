import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { FishSeedSeller, NewFishSeedSellerInput, SellerStatus } from "./seller-types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "fish_seed_sellers.json");

export async function readFishSeedSellers(): Promise<FishSeedSeller[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FishSeedSeller[]) : [];
  } catch {
    return [];
  }
}

async function writeFishSeedSellers(sellers: FishSeedSeller[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(sellers, null, 2), "utf8");
}

export async function getFishSeedSellers(): Promise<FishSeedSeller[]> {
  const sellers = await readFishSeedSellers();
  return sellers.sort(
    (a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
  );
}

export async function getFishSeedSellerById(id: string): Promise<FishSeedSeller | null> {
  const sellers = await readFishSeedSellers();
  return sellers.find((seller) => seller.id === id) ?? null;
}

export async function addFishSeedSeller(
  input: NewFishSeedSellerInput
): Promise<FishSeedSeller> {
  const sellers = await readFishSeedSellers();

  const newSeller: FishSeedSeller = {
    ...input,
    id: `seller_${Date.now().toString().slice(-6)}`,
    rating: 5.0,
    joinedDate: new Date().toISOString(),
  };

  sellers.unshift(newSeller);
  await writeFishSeedSellers(sellers);
  return newSeller;
}

export async function updateFishSeedSellerStatus(
  id: string,
  status: SellerStatus
): Promise<FishSeedSeller | null> {
  const sellers = await readFishSeedSellers();
  const index = sellers.findIndex((s) => s.id === id);
  if (index === -1) return null;

  sellers[index].status = status;
  await writeFishSeedSellers(sellers);
  return sellers[index];
}

export async function deleteFishSeedSeller(id: string): Promise<FishSeedSeller | null> {
  const sellers = await readFishSeedSellers();
  const existing = sellers.find((s) => s.id === id);
  if (!existing) return null;

  await writeFishSeedSellers(sellers.filter((s) => s.id !== id));
  return existing;
}
