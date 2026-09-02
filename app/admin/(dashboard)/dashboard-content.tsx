"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";
import { TranslationKey } from "@/lib/translations";
import { DashboardPieChart, BreakdownData } from "./dashboard-pie-chart";

type Stat = {
  key: TranslationKey;
  value: string;
  href: string;
};

export function DashboardContent({
  productCount,
  userCount,
  blogCount = 0,
  orderCount = 0,
  totalRevenue = 0,
  breakdown,
}: {
  productCount: number;
  userCount: number;
  blogCount?: number;
  orderCount?: number;
  totalRevenue?: number;
  breakdown?: BreakdownData;
}) {
  const { t } = useLanguage();

  const stats: Stat[] = [
    { key: "products", value: String(productCount), href: "/admin/products" },
    { key: "users", value: String(userCount), href: "/admin/users" },
    { key: "blogsTitle" as TranslationKey, value: String(blogCount), href: "/admin/blogs" },
    { key: "orders" as TranslationKey, value: String(orderCount), href: "/admin/orders" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("dashboard")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboardSubtitle")}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-95"
        >
          {t("addProduct")}
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.key}
            href={stat.href}
            className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
              {t(stat.key)}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>
      
      {/* Revenue Card */}
      {totalRevenue > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-emerald-100">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold">৳ {totalRevenue.toLocaleString()}</p>
        </div>
      )}

      {/* Interactive Analytics Pie Chart */}
      <DashboardPieChart
        stats={{
          products: productCount,
          users: userCount,
          blogs: blogCount,
          orders: orderCount,
        }}
        breakdown={breakdown}
      />
    </div>
  );
}



