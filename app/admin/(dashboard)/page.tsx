import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getUsers } from "@/lib/users";

export const metadata: Metadata = {
  title: "Dashboard | Kundu Agro and Fisheries",
};

export default async function AdminDashboardPage() {
  const [products, users] = await Promise.all([getProducts(), getUsers()]);

  const stats = [
    { label: "Products", value: String(products.length), href: "/admin/products" },
    { label: "Users", value: String(users.length), href: "/admin/users" },
    { label: "Orders", value: "0", href: "#" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your agro and fisheries operations.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-95"
        >
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
