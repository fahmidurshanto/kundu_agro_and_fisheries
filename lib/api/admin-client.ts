import {
  adminApi,
  staffApi,
  managerApi,
  publicApi,
  type ApiResponse,
  API_BASE_URL,
} from "./axios-instances";

export { type ApiResponse, API_BASE_URL };

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

export interface AdminUserProfile {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff" | "Customer";
  status?: string;
  phone?: string;
}

/**
 * Universal admin request helper powered by Axios
 */
export async function adminFetch<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    params?: any;
  } = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toUpperCase();
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let data = options.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      // Keep as string if not JSON
    }
  }

  // Use publicApi for public endpoints if called without auth requirement
  const isPublic = url.startsWith("/products") || url.startsWith("/blogs") || url.startsWith("/orders/track");
  const client = isPublic ? publicApi : adminApi;

  try {
    const res = await client.request<ApiResponse<T>>({
      url,
      method,
      data,
      params: options.params,
      headers: options.headers,
    });
    return res.data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.message || error);
    throw error;
  }
}

/**
 * Admin Multipart/FormData request helper powered by Axios
 */
export async function adminFetchFormData<T = any>(
  endpoint: string,
  formData: FormData,
  method = "POST"
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const res = await adminApi.request<ApiResponse<T>>({
      url,
      method: method.toUpperCase(),
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(`API FormData Error [${endpoint}]:`, error.message || error);
    throw error;
  }
}

/**
 * Dashboard stats fetcher
 */
export async function getAdminDashboardStats(): Promise<DashboardStatsData | null> {
  try {
    const res = await adminApi.get<ApiResponse<DashboardStatsData>>("/admin/dashboard/stats");
    return res.data?.data || (res.data as unknown as DashboardStatsData) || null;
  } catch (err) {
    console.warn("Failed to fetch backend dashboard stats:", err);
    return null;
  }
}

/**
 * Admin Login API
 */
export async function loginAdminApi(
  email: string,
  password: string
): Promise<{ token?: string; user?: AdminUserProfile; message?: string }> {
  try {
    const res = await publicApi.post<{ token: string; user: AdminUserProfile; message?: string }>(
      "/auth/login",
      { email, password }
    );
    return {
      token: res.data?.token,
      user: res.data?.user || (res.data as any)?.data?.user,
      message: res.data?.message,
    };
  } catch (err: any) {
    console.warn("Backend auth/login failed:", err.message);
    throw err;
  }
}

/**
 * Admin Profile API
 */
export async function getAdminProfileApi(): Promise<AdminUserProfile | null> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
      if (!token) return null;
    } catch {
      return null;
    }
  }

  try {
    const res = await adminApi.get<{ user?: AdminUserProfile; data?: AdminUserProfile }>("/auth/me");
    return res.data?.user || res.data?.data || null;
  } catch (err) {
    console.warn("Backend auth/me profile check failed:", err);
    return null;
  }
}

/**
 * Admin Logout API
 */
export async function logoutAdminApi(): Promise<boolean> {
  try {
    const res = await adminApi.post<{ success: boolean }>("/auth/logout");
    return Boolean(res.data?.success);
  } catch (err) {
    console.warn("Backend auth/logout failed:", err);
    return false;
  }
}

export { adminApi, staffApi, managerApi, publicApi };
