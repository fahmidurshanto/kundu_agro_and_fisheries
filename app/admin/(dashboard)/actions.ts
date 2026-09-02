"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";

export async function logout() {
  try {
    const { adminApi } = await import("@/lib/api/axios-instances");
    await adminApi.post("/auth/logout").catch(() => {});
  } catch (err) {
    console.warn("Error invalidating backend logout session:", err);
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("token");

  redirect("/admin/login");
}

