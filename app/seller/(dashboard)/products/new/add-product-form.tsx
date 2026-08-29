"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { FISH_SEED_CATEGORY } from "@/lib/seller-constants";
import { addSellerProductAction, AddProductState } from "@/app/seller/actions";

const FISH_SEED_UNITS = ["thousand / হাজার", "piece", "kg", "gram"] as const;

const initialState: AddProductState = {};

const inputClass =
  "h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 placeholder:text-gray-400";

export function SellerAddProductForm() {
  const [state, formAction, isPending] = useActionState(addSellerProductAction, initialState);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : null;
    setThumbnailPreview(previewRef.current);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Link href="/seller/products" className="text-xs font-semibold text-emerald-700 hover:underline block mb-2">
          ← Back to My Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Add Fish Seed Product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List a new fish seed variety on the Kundu Agro marketplace.
        </p>
      </div>

      {/* Category Lock Notice */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <span className="text-xl">🔒</span>
        <div>
          <p className="text-xs font-bold text-emerald-900">Category is auto-set and locked</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            All your products will be listed under:{" "}
            <span className="font-semibold">{FISH_SEED_CATEGORY}</span>
          </p>
        </div>
      </div>

      {/* Errors / Success */}
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          ⚠️ {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          ✅ {state.success}
        </div>
      )}

      <form action={formAction} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            placeholder="e.g. Hybrid Rui Fish Seed (হাইব্রিড রুই পোনা)"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Describe the species, size, age, quality, and delivery info…"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 placeholder:text-gray-400"
          />
        </div>

        {/* Unit + Price */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Unit *
            </label>
            <select name="unit" required defaultValue="thousand / হাজার" className={inputClass}>
              {FISH_SEED_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Price per unit (৳) *
            </label>
            <input
              type="number"
              name="price"
              required
              min="0.01"
              step="0.01"
              placeholder="e.g. 1800"
              className={inputClass}
            />
          </div>
        </div>

        {/* Old / Compare Price */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Old Price (৳, optional — shows discount badge)
          </label>
          <input
            type="number"
            name="compareAtPrice"
            min="0.01"
            step="0.01"
            placeholder="e.g. 2100 (must be higher than selling price)"
            className={inputClass}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Product Image (Thumbnail) *
          </label>
          {thumbnailPreview && (
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-100 bg-muted mb-2 sm:h-52">
              <Image src={thumbnailPreview} alt="Preview" fill unoptimized className="object-cover" />
            </div>
          )}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-emerald-600 hover:text-emerald-700">
            <input
              type="file"
              name="thumbnail"
              accept="image/jpeg,image/png,image/webp,image/avif"
              required
              onChange={handleThumbnail}
              className="sr-only"
            />
            🖼️{" "}
            {thumbnailPreview ? "Click to change image" : "Click to upload thumbnail (JPG, PNG, WebP — max 5MB)"}
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Link
            href="/seller/products"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Publish Fish Seed Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
