"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";
import { LanguageToggle } from "@/app/components/language-toggle";
import { logout } from "./actions";
import type { AdminUserProfile } from "@/lib/api/admin-client";

export function HeaderNav({ user }: { user?: AdminUserProfile }) {
  const { t } = useLanguage();

  return (
    <div className="hidden items-center gap-5 md:flex">
      <nav className="flex items-center gap-4">
        <Link
          href="/admin"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("dashboard")}
        </Link>
        <Link
          href="/admin/products"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("products")}
        </Link>
        <Link
          href="/admin/sellers"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("sellers")}
        </Link>
        <Link
          href="/admin/blogs"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("blogs")}
        </Link>
        <Link
          href="/admin/users"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("users")}
        </Link>
        <Link
          href="/admin/orders"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("orders")}
        </Link>
      </nav>

      <LanguageToggle />

      {user && (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{user.name || user.email}</span>
          <span className="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-gray-600">
            {user.role}
          </span>
        </div>
      )}

      <form action={logout}>
        <button
          type="submit"
          className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {t("logout")}
        </button>
      </form>
    </div>
  );
}

