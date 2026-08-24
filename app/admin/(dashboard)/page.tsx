import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { getUsers } from "@/lib/users";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Kundu Agro and Fisheries",
};

export default async function AdminDashboardPage() {
  const [products, users] = await Promise.all([getProducts(), getUsers()]);

  return (
    <DashboardContent
      productCount={products.length}
      userCount={users.length}
    />
  );
}

