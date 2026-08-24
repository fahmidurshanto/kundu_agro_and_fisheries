"use client";

import { useLanguage } from "@/app/components/language-context";

export function UsersHeader({ userCount }: { userCount: number }) {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("usersTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userCount === 0
            ? t("noUsersSubtitle")
            : language === "bn"
            ? `${userCount} ${t("usersSubtitleCount")}`
            : `${userCount} ${
                userCount === 1
                  ? t("userSubtitleCount")
                  : t("usersSubtitleCount")
              }`}
        </p>
      </div>
    </div>
  );
}
