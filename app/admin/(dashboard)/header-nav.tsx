"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";
import { LanguageToggle } from "@/app/components/language-toggle";
import { logout } from "./actions";

export function HeaderNav() {
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
          href="/admin/products/new"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("addProduct")}
        </Link>
        <Link
          href="/admin/blogs/new"
          className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {t("addBlog")}
        </Link>
      </nav>

      <LanguageToggle />

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
