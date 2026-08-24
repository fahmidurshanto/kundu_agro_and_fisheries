"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";

export function BlogsHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("blogPostsTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("blogPostsSubtitle")}
        </p>
      </div>
      <Link
        href="/admin/blogs/new"
        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
      >
        {t("addNewBlog")}
      </Link>
    </div>
  );
}
