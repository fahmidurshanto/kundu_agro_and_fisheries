"use client";

import { useLanguage } from "@/app/components/language-context";

export function BrandTitle() {
  const { t } = useLanguage();
  return (
    <span className="text-sm font-semibold tracking-tight text-foreground">
      {t("adminPanel")}
    </span>
  );
}
