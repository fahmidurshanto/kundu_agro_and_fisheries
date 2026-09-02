import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { getUsers } from "@/lib/users";
import { getAdminDashboardStats } from "@/lib/api/admin-client";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Kundu Agro and Fisheries",
};

export default async function AdminDashboardPage() {
  const [backendStats, products, users] = await Promise.all([
    getAdminDashboardStats(),
    getProducts(),
    getUsers(),
  ]);

  const stats = backendStats?.stats;

  return (
    <DashboardContent
      productCount={stats?.products ?? products.length}
      userCount={stats?.users ?? users.length}
      blogCount={stats?.blogs ?? 0}
      orderCount={stats?.orders ?? 0}
      totalRevenue={stats?.totalRevenue ?? 0}
      breakdown={backendStats?.breakdown}
    />
  );
}



