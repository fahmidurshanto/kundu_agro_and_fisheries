import { cookies } from "next/headers";

export const SELLER_SESSION_COOKIE = "kundu_seller_session";

export interface SellerUser {
  id: string;
  name: string;
  hatcheryName: string;
  email: string;
  phone: string;
  district: string;
  status: "Verified" | "Pending" | "Inactive";
}

export async function createSellerSessionToken(sellerId: string): Promise<string> {
  return `seller_token_${sellerId}_${Date.now()}`;
}

export async function getSellerSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SELLER_SESSION_COOKIE)?.value;
}

export async function verifySellerSession(): Promise<SellerUser | null> {
  const token = await getSellerSessionToken();
  if (!token) return null;

  // Mock seller session user (Padma Quality Fish Seed Hatchery owner)
  return {
    id: "seller_101",
    name: "Mokbul Hossain",
    hatcheryName: "Padma Quality Fish Seed Hatchery",
    email: "seller@padmahatchery.com",
    phone: "+880 1711-223344",
    district: "Mymensingh",
    status: "Verified",
  };
}
