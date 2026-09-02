import {
  customerApi,
  publicApi,
  API_BASE_URL,
} from "./axios-instances";

export { API_BASE_URL };

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Admin" | "Manager" | "Staff" | "Customer";
  status?: string;
  district?: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: CustomerUser;
  data?: any;
}

/**
 * Universal customer request helper powered by Axios
 */
export async function customerFetch<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    params?: any;
  } = {}
): Promise<T> {
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

  try {
    const res = await customerApi.request<T>({
      url,
      method,
      data,
      params: options.params,
      headers: options.headers,
    });
    return res.data;
  } catch (error: any) {
    throw error;
  }
}

export async function registerCustomerApi(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}): Promise<AuthResponse> {
  const res = await publicApi.post<AuthResponse>("/auth/register", data);
  return res.data;
}

export async function loginCustomerApi(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await publicApi.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
}

export async function getCustomerProfileApi(): Promise<CustomerUser | null> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token =
        cookieStore.get("customerAccessToken")?.value ||
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value;
      if (!token) return null;
    } catch {
      return null;
    }
  }

  try {
    const res = await customerApi.get<AuthResponse>("/auth/me");
    return res.data?.user || (res.data as any)?.data || null;
  } catch {
    return null;
  }
}

export async function logoutCustomerApi(): Promise<boolean> {
  try {
    const res = await customerApi.post<AuthResponse>("/auth/logout");
    return Boolean(res.data?.success);
  } catch {
    return false;
  }
}

export async function changePasswordApi(data: {
  oldPassword?: string;
  currentPassword?: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await customerApi.put<{ success: boolean; message?: string }>(
      "/customer/change-password",
      data
    );
    return res.data;
  } catch (err: any) {
    // Fallback to legacy auth changepassword if needed
    try {
      const fallback = await customerApi.post<{ success: boolean; message?: string }>(
        "/auth/changepassword",
        data
      );
      return fallback.data;
    } catch {
      throw err;
    }
  }
}

export { customerApi, publicApi };
