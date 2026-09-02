const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export async function adminFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  try {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
      if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || `HTTP Error ${res.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message || error);
    throw error;
  }
}

export async function adminFetchFormData<T = any>(
  endpoint: string,
  formData: FormData,
  method = "POST"
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {};

  try {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      method,
      headers,
      body: formData,
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || `HTTP Error ${res.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API FormData Error [${endpoint}]:`, error.message || error);
    throw error;
  }
}

export interface DashboardStatsData {
  stats: {
    products: number;
    availableProducts: number;
    users: number;
    blogs: number;
    orders: number;
    totalRevenue: number;
  };
  breakdown?: {
    roles?: Record<string, number>;
    userStatuses?: Record<string, number>;
    orderStatuses?: Record<string, number>;
  };
  recent?: {
    orders?: any[];
    products?: any[];
    users?: any[];
  };
}

export async function getAdminDashboardStats(): Promise<DashboardStatsData | null> {
  try {
    const res = await adminFetch<DashboardStatsData>("/admin/dashboard/stats");
    return res.data || (res as unknown as DashboardStatsData) || null;
  } catch (err) {
    console.warn("Failed to fetch backend dashboard stats:", err);
    return null;
  }
}

export interface AdminUserProfile {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff" | "Customer";
  status?: string;
  phone?: string;
}

export async function loginAdminApi(email: string, password: string): Promise<{ token?: string; user?: AdminUserProfile; message?: string }> {
  try {
    const res = await adminFetch<{ token: string; user: AdminUserProfile }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return {
      token: res.token,
      user: res.user || res.data?.user,
      message: res.message,
    };
  } catch (err: any) {
    console.warn("Backend auth/login failed:", err.message);
    throw err;
  }
}

export async function getAdminProfileApi(): Promise<AdminUserProfile | null> {
  try {
    const res = await adminFetch<AdminUserProfile>("/auth/me");
    return res.user || res.data || null;
  } catch (err) {
    console.warn("Backend auth/me profile check failed:", err);
    return null;
  }
}

export async function logoutAdminApi(): Promise<boolean> {
  try {
    const res = await adminFetch("/auth/logout", { method: "POST" });
    return res.success;
  } catch (err) {
    console.warn("Backend auth/logout failed:", err);
    return false;
  }
}


