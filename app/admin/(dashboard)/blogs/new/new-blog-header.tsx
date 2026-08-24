"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";

export function NewBlogHeader() {
  const { t } = useLanguage();

  return (
    <div>
      <Link
        href="/admin/blogs"
        className="text-xs font-medium text-muted-foreground hover:text-primary"
      >
        {t("backToBlogs")}
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {t("createNewBlogPost")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("createBlogSubtitle")}
      </p>
    </div>
  );
}
