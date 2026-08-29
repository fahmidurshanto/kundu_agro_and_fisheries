"use client";

import { useActionState } from "react";
import { useLanguage } from "@/app/components/language-context";
import { loginSellerAction, SellerLoginState } from "../../actions";

const initialState: SellerLoginState = {};

export function SellerLoginForm() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState(
    loginSellerAction,
    initialState
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-xl font-bold">
          🐟
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
          {t("sellerLoginTitle")}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("sellerLoginSubtitle")}
        </p>
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          ⚠️ {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Seller Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue="seller@padmahatchery.com"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            defaultValue="password"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
        >
          {isPending ? t("saving") : t("loginAsSeller")}
        </button>
      </form>

      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center text-xs text-emerald-800">
        💡 {t("demoSellerCredentials")}
      </div>
    </div>
  );
}
