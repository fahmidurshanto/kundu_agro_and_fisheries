"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";

export function AddProductHeader() {
  const { t } = useLanguage();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-xs font-medium text-muted-foreground hover:text-primary"
      >
        {t("backToProducts")}
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {t("addProductTitle")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("addProductSubtitle")}
      </p>
    </div>
  );
}
