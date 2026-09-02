"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/session";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Attempt backend API login first
  try {
    const { publicApi } = await import("@/lib/api/axios-instances");
    const res = await publicApi.post<{ success: boolean; token: string; user: any; message?: string }>(
      "/auth/login",
      { email, password }
    );
    const data = res.data;

    if (data.success && data.token) {
      const user = data.user;
      // Ensure user has staff, manager, or admin privileges
      if (user && user.role === "Customer") {
        return { error: "Access denied. Admin, Manager, or Staff role required." };
      }

      const cookieStore = await cookies();
      
      // Store backend access token for API requests
      cookieStore.set("accessToken", data.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });

      // Store Next.js proxy session cookie
      const token = await createSessionToken(user?.email || email);
      cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });

      redirect("/admin");
    } else if (res.status === 401 || res.status === 400 || data.message) {
      return { error: data.message || "Invalid email or password." };
    }
  } catch (err: any) {
    // If NEXT_REDIRECT was thrown by Next.js redirect(), let it pass through
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.warn("Backend auth login failed, falling back to local credentials:", err?.message || err);
  }

  // Fallback to local env credentials
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
    const token = await createSessionToken(adminEmail);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    redirect("/admin");
  }

  return { error: "Invalid email or password." };
}

