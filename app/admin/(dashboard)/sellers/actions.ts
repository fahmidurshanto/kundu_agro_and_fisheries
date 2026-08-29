"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  addFishSeedSeller,
  deleteFishSeedSeller,
  updateFishSeedSellerStatus,
} from "@/lib/sellers";
import { SellerStatus } from "@/lib/seller-types";

export type CreateSellerState = {
  error?: string;
  success?: string;
};

export type UpdateSellerStatusState = {
  error?: string;
  success?: boolean;
};

async function requireSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(
    await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  );
}

export async function createSellerAction(
  _prev: CreateSellerState,
  formData: FormData
): Promise<CreateSellerState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const hatcheryName = String(formData.get("hatcheryName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const locationDetails = String(formData.get("locationDetails") ?? "").trim();
  const fishTypesRaw = String(formData.get("fishTypes") ?? "").trim();
  const capacityPerMonth = String(formData.get("capacityPerMonth") ?? "").trim();
  const status = (String(formData.get("status") ?? "").trim() || "Verified") as SellerStatus;

  if (!name) return { error: "Seller contact name is required." };
  if (!hatcheryName) return { error: "Hatchery/Nursery name is required." };
  if (!phone) return { error: "Contact phone number is required." };
  if (!district) return { error: "District/Region is required." };

  const fishTypes = fishTypesRaw
    ? fishTypesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Rui", "Katla"];

  try {
    const newSeller = await addFishSeedSeller({
      name,
      hatcheryName,
      phone,
      district,
      locationDetails,
      fishTypes,
      capacityPerMonth: capacityPerMonth || "100,000 fry",
      status,
    });

    revalidatePath("/admin/sellers");
    return { success: `Seller "${newSeller.hatcheryName}" registered successfully!` };
  } catch {
    return { error: "Something went wrong while saving the seller." };
  }
}

export async function toggleSellerStatusAction(
  sellerId: string,
  newStatus: SellerStatus
): Promise<UpdateSellerStatusState> {
  if (!(await requireSession())) {
    return { error: "Your session has expired." };
  }

  try {
    const updated = await updateFishSeedSellerStatus(sellerId, newStatus);
    if (!updated) return { error: "Seller not found." };

    revalidatePath("/admin/sellers");
    return { success: true };
  } catch {
    return { error: "Failed to update seller status." };
  }
}

export async function deleteSellerAction(sellerId: string) {
  if (!(await requireSession())) {
    return { error: "Your session has expired." };
  }

  try {
    const removed = await deleteFishSeedSeller(sellerId);
    if (!removed) return { error: "Seller not found." };

    revalidatePath("/admin/sellers");
    return { success: true };
  } catch {
    return { error: "Failed to delete seller." };
  }
}
