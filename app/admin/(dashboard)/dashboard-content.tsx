"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";
import { TranslationKey } from "@/lib/translations";

type Stat = {
  key: TranslationKey;
  value: string;
  href: string;
};

export function DashboardContent({
  productCount,
  userCount,
}: {
  productCount: number;
  userCount: number;
}) {
  const { t } = useLanguage();

  const stats: Stat[] = [
    { key: "statProducts", value: String(productCount), href: "/admin/products" },
    { key: "statUsers", value: String(userCount), href: "/admin/users" },
    { key: "statOrders", value: "0", href: "#" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("dashboardTitle")}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
    </div>
  );
}
