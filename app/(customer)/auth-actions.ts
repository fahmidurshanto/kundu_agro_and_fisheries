"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  registerCustomerApi,
  loginCustomerApi,
  changePasswordApi,
  getCustomerProfileApi,
} from "@/lib/api/customer-auth-client";

export type AuthFormState = {
  error?: string;
  success?: string;
};

const TOKEN_COOKIE = "customerAccessToken";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── 1. Register Action ───────────────────────────────────────────────────────
export async function registerCustomerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const res = await registerCustomerApi({
      name,
      email,
      password,
      phone: phone || undefined,
      role: "Customer",
    });

    if (res.success && res.token) {
      const cookieStore = await cookies();
      cookieStore.set(TOKEN_COOKIE, res.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: MAX_AGE,
      });
      redirect("/orders");
    }

    return { success: res.message || "Registration successful! Please login." };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: err.message || "Failed to register account." };
  }
}

// ─── 2. Login Action ──────────────────────────────────────────────────────────
export async function loginCustomerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await loginCustomerApi(email, password);

    if (res.success && res.token) {
      const cookieStore = await cookies();
      cookieStore.set(TOKEN_COOKIE, res.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: MAX_AGE,
      });
      redirect("/orders");
    }

    return { error: res.message || "Invalid credentials." };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: err.message || "Invalid email or password." };
  }
}

// ─── 3. Logout Action ─────────────────────────────────────────────────────────
export async function logoutCustomerAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete("accessToken");
  redirect("/login");
}

// ─── 4. Change Password Action ───────────────────────────────────────────────
export async function changePasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const currentPassword = String(formData.get("currentPassword") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (!currentPassword || !newPassword) {
    return { error: "Current and new password are required." };
  }
  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  try {
    const res = await changePasswordApi({
      currentPassword,
      oldPassword: currentPassword,
      newPassword,
    });

    return { success: res.message || "Password changed successfully." };
  } catch (err: any) {
    return { error: err.message || "Failed to change password." };
  }
}

// ─── 5. Get Current Customer Profile ──────────────────────────────────────────
export async function getCurrentCustomer() {
  return getCustomerProfileApi();
}
