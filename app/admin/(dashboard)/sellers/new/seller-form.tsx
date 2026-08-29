"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/components/language-context";
import { createSellerAction, CreateSellerState } from "../actions";

const initialState: CreateSellerState = {};

export function SellerForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createSellerAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/admin/sellers");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <Link
            href="/admin/sellers"
            className="text-xs font-semibold text-primary hover:underline block mb-1"
          >
            ← Back to Fish Seed Sellers
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("addSellerTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("addSellerSubtitle")}
          </p>
        </div>
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          ⚠️ {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          ✅ {state.success} Redirecting to sellers list...
        </div>
      )}

      <form action={formAction} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              {t("hatcheryName")} *
            </label>
            <input
              type="text"
              name="hatcheryName"
              required
              placeholder="e.g. Padma Quality Fish Seed Hatchery"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              {t("contactPerson")} *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Mokbul Hossain"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              {t("phoneLabel")} *
            </label>
            <input
              type="text"
              name="phone"
              required
              placeholder="e.g. +880 1711-000000"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              {t("district")} *
            </label>
            <input
              type="text"
              name="district"
              required
              placeholder="e.g. Mymensingh / Jessore / Bogura"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            {t("locationDetails")}
          </label>
          <input
            type="text"
            name="locationDetails"
            placeholder="e.g. Trishal Road, Mymensingh Sadar"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            {t("fishTypes")}
          </label>
          <input
            type="text"
            name="fishTypes"
            placeholder="e.g. Rui, Katla, Monosex Tilapia, Pabda"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {t("fishTypesHelp")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              {t("capacityPerMonth")}
            </label>
            <input
              type="text"
              name="capacityPerMonth"
              placeholder="e.g. 500,000 fry"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              {t("sellerStatus")}
            </label>
            <select
              name="status"
              defaultValue="Verified"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="Verified">Verified</option>
              <option value="Pending">Pending Verification</option>
              <option value="Inactive">Inactive / Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/sellers"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? t("saving") : t("saveSeller")}
          </button>
        </div>
      </form>
    </div>
  );
}
