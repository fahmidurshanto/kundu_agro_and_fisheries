const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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
}

export async function customerFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token =
      cookieStore.get("customerAccessToken")?.value ||
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("token")?.value;
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `HTTP Error ${res.status}`);
  }

  return data;
}

export async function registerCustomerApi(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}): Promise<AuthResponse> {
  return customerFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginCustomerApi(
  email: string,
  password: string
): Promise<AuthResponse> {
  return customerFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCustomerProfileApi(): Promise<CustomerUser | null> {
  try {
    const res = await customerFetch<AuthResponse>("/auth/me");
    return res.user || (res as any).data || null;
  } catch {
    return null;
  }
}

export async function logoutCustomerApi(): Promise<boolean> {
  try {
    const res = await customerFetch<AuthResponse>("/auth/logout", {
      method: "POST",
    });
    return res.success;
  } catch {
    return false;
  }
}

export async function changePasswordApi(data: {
  oldPassword?: string;
  currentPassword?: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string }> {
  return customerFetch<{ success: boolean; message?: string }>(
    "/auth/changepassword",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
