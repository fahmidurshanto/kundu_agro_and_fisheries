import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export type UserRole = "Admin" | "Manager" | "Staff" | "Customer" | "Public";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

/**
 * Extract token from cookie store based on target role
 */
async function resolveTokenForRole(role: UserRole): Promise<string | undefined> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      if (role === "Customer") {
        return (
          cookieStore.get("customerAccessToken")?.value ||
          cookieStore.get("accessToken")?.value ||
          cookieStore.get("token")?.value
        );
      }

      if (role === "Staff" || role === "Manager" || role === "Admin") {
        return (
          cookieStore.get("accessToken")?.value ||
          cookieStore.get("token")?.value
        );
      }
    } catch {
      // In static prerender or build time, cookies() is inaccessible
      return undefined;
    }
  }
  return undefined;
}

/**
 * Attach request and response interceptors to an Axios instance
 */
function configureInterceptors(instance: AxiosInstance, role: UserRole): AxiosInstance {
  // Request Interceptor: attach Bearer token and headers
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Always include credentials on browser
      config.withCredentials = true;

      // On server-side, extract token from Next.js cookie store
      if (typeof window === "undefined" && role !== "Public") {
        const token = await resolveTokenForRole(role);
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: unwrap errors for unified messaging
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
      const serverMessage = error.response?.data?.message;
      const status = error.response?.status;
      const customMessage = serverMessage || error.message || `HTTP Error ${status || 500}`;
      
      const enhancedError = new Error(customMessage);
      (enhancedError as any).status = status;
      (enhancedError as any).data = error.response?.data;
      (enhancedError as any).isAxiosError = true;
      return Promise.reject(enhancedError);
    }
  );

  return instance;
}

/**
 * Factory function to create dedicated role-based Axios instances
 */
export function createRoleAxiosInstance(role: UserRole, customBaseUrl?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: customBaseUrl || API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return configureInterceptors(instance, role);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-configured Role Instances for the application:
// 1. publicApi   -> Guests & unauthenticated catalog/blogs/checkout
// 2. customerApi -> Customer profile, personal orders, fish seed submission
// 3. staffApi    -> Staff product and blog management
// 4. managerApi  -> Manager deletions, order processing, moderation
// 5. adminApi    -> Admin full dashboard stats, user role management, system settings
// ─────────────────────────────────────────────────────────────────────────────

export const publicApi: AxiosInstance = createRoleAxiosInstance("Public");
export const customerApi: AxiosInstance = createRoleAxiosInstance("Customer");
export const staffApi: AxiosInstance = createRoleAxiosInstance("Staff");
export const managerApi: AxiosInstance = createRoleAxiosInstance("Manager");
export const adminApi: AxiosInstance = createRoleAxiosInstance("Admin");

export default {
  public: publicApi,
  customer: customerApi,
  staff: staffApi,
  manager: managerApi,
  admin: adminApi,
};
