"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/product-types";
import { updateProduct, type UpdateProductState } from "../../actions";

const initialState: UpdateProductState = {};

const units = ["kg", "gram", "litre", "piece", "dozen", "pack"];

const inputClass =
  "h-11 w-full cursor-pointer rounded-lg border border-gray-200 px-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

type ImagePreviewItem = {
  id: string;
  file: File;
  url: string;
};

type VideoPreviewItem = {
  file: File;
  url: string;
} | null;

export function ProductEditForm({ product }: { product: Product }) {
  const [state, formAction, pending] = useActionState(
    updateProduct,
    initialState
  );

  return (
    <div className="flex flex-col gap-6">
      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {state.error}
        </p>
      ) : null}

      <ProductEditFormFields
        key={product.id}
        product={product}
        formAction={formAction}
        pending={pending}
      />
    </div>
  );
}

function ProductEditFormFields({
  product,
  formAction,
  pending,
}: {
  product: Product;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  // Main Thumbnail state
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailPreviewRef = useRef<string | null>(null);

  // Gallery Images state
  const [galleryImages, setGalleryImages] = useState<ImagePreviewItem[]>([]);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Product Video state
  const [videoPreview, setVideoPreview] = useState<VideoPreviewItem>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Category state
  const isPredefinedCategory = (PRODUCT_CATEGORIES as readonly string[]).includes(
    product.category
  );
  const [isCustomCategory, setIsCustomCategory] = useState(!isPredefinedCategory);
  const [selectedCategory, setSelectedCategory] = useState(
    isPredefinedCategory ? product.category : "__CUSTOM__"
  );
  const [customCategory, setCustomCategory] = useState(
    isPredefinedCategory ? "" : product.category
  );

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreviewRef.current) URL.revokeObjectURL(thumbnailPreviewRef.current);
      galleryImages.forEach((img) => URL.revokeObjectURL(img.url));
      if (videoPreview) URL.revokeObjectURL(videoPreview.url);
    };
  }, []);

  const shownThumbnail = thumbnailPreview ?? product.thumbnail;

  // Handlers
  function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (thumbnailPreviewRef.current) URL.revokeObjectURL(thumbnailPreviewRef.current);
    thumbnailPreviewRef.current = file ? URL.createObjectURL(file) : null;
    setThumbnailPreview(thumbnailPreviewRef.current);
  }

  function handleGalleryImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const newItems: ImagePreviewItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setGalleryImages((prev) => [...prev, ...newItems]);
  }

  function handleRemoveGalleryImage(id: string) {
    setGalleryImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((img) => img.id !== id);
    });
  }

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (videoPreview) URL.revokeObjectURL(videoPreview.url);
    if (file) {
      setVideoPreview({ file, url: URL.createObjectURL(file) });
    } else {
      setVideoPreview(null);
    }
  }

  function handleRemoveVideo() {
    if (videoPreview) URL.revokeObjectURL(videoPreview.url);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  }

  function handleCategorySelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      setIsCustomCategory(true);
      setSelectedCategory("__CUSTOM__");
    } else {
      setSelectedCategory(val);
      setIsCustomCategory(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={product.id} />

      {/* Basic Info */}
      <fieldset className="flex flex-col gap-4" disabled={pending}>
        <legend className="mb-2 text-sm font-semibold text-foreground">
          Basic information
        </legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Product name
          </span>
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            defaultValue={product.name}
            placeholder="e.g. Fisheries Medicine X"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Description
          </span>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={product.description}
            placeholder="Describe the product, its quality, source, packaging…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </fieldset>

      {/* Category & Unit */}
      <fieldset
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        disabled={pending}
      >
        <legend className="mb-2 text-sm font-semibold text-foreground">
          Category &amp; unit
        </legend>

        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Category</span>
            {isCustomCategory ? (
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(false);
                  setSelectedCategory(PRODUCT_CATEGORIES[0]);
                }}
                className="text-xs cursor-pointer text-primary underline transition-colors hover:text-primary/80"
              >
                ← Choose from list
              </button>
            ) : null}
          </div>

          {isCustomCategory ? (
            <input
              type="text"
              name="category"
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category name…"
              className={inputClass}
              autoFocus
            />
          ) : (
            <select
              name="category"
              required
              value={selectedCategory}
              onChange={handleCategorySelect}
              className={inputClass}
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="__CUSTOM__">+ Add custom category…</option>
            </select>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Unit</span>
          <select
            name="unit"
            required
            defaultValue={product.unit}
            className={inputClass}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {/* Pricing */}
      <fieldset
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        disabled={pending}
      >
        <legend className="mb-2 text-sm font-semibold text-foreground">
          Pricing
        </legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Price per unit (৳)
          </span>
          <input
            type="number"
            name="price"
            required
            min="0.01"
            step="0.01"
            inputMode="decimal"
            defaultValue={product.price}
            placeholder="e.g. 320.00"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Old price (৳, optional)
          </span>
          <input
            type="number"
            name="compareAtPrice"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            defaultValue={product.compareAtPrice ?? ""}
            placeholder="e.g. 400.00"
            className={inputClass}
          />
        </label>
      </fieldset>

      {/* Main Thumbnail */}
      <fieldset className="flex flex-col gap-3" disabled={pending}>
        <legend className="mb-2 text-sm font-semibold text-foreground">
          Main Thumbnail Image
        </legend>

        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-100 bg-muted sm:h-56">
          <Image
            src={shownThumbnail}
            alt={thumbnailPreview ? "New thumbnail preview" : `Current ${product.name} thumbnail`}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <input
            type="file"
            name="thumbnail"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleThumbnailChange}
            className="sr-only"
          />
          {thumbnailPreview
            ? "Click to change main thumbnail"
            : "Click to replace the image (JPG, PNG, WebP — max 5 MB)"}
        </label>
      </fieldset>

      {/* Multiple Gallery Images */}
      <fieldset className="flex flex-col gap-3" disabled={pending}>
        <div className="flex items-center justify-between">
          <legend className="text-sm font-semibold text-foreground">
            Product Gallery Images (Multiple, Optional)
          </legend>
          {galleryImages.length > 0 ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {galleryImages.length} {galleryImages.length === 1 ? "image" : "images"} selected
            </span>
          ) : null}
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {galleryImages.map((item, idx) => (
              <div
                key={item.id}
                className="group relative h-28 w-full overflow-hidden rounded-xl border border-gray-200 bg-muted shadow-sm"
              >
                <Image
                  src={item.url}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(item.id)}
                  title="Remove image"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <input
            ref={galleryInputRef}
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleGalleryImagesChange}
            className="sr-only"
          />
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V8a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {galleryImages.length > 0
              ? "+ Click to add more gallery images"
              : "Click to upload multiple product photos"}
          </span>
        </label>
      </fieldset>

      {/* Product Video Upload */}
      <fieldset className="flex flex-col gap-3" disabled={pending}>
        <legend className="text-sm font-semibold text-foreground">
          Product Video (Optional)
        </legend>

        {videoPreview ? (
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-3">
            <video
              src={videoPreview.url}
              controls
              className="max-h-64 w-full rounded-lg bg-black object-contain"
            />
            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="truncate font-medium text-foreground">
                {videoPreview.file.name} (
                {(videoPreview.file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="cursor-pointer font-medium text-red-600 underline hover:text-red-700"
              >
                Remove video
              </button>
            </div>
          </div>
        ) : null}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <input
            ref={videoInputRef}
            type="file"
            name="video"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            onChange={handleVideoChange}
            className="sr-only"
          />
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>
            {videoPreview
              ? "Click to replace video"
              : "Click to upload product video (MP4, WebM, MOV)"}
          </span>
        </label>
      </fieldset>

      {/* Actions */}
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="h-11 cursor-pointer rounded-lg bg-primary text-sm font-semibold text-white transition-[filter] hover:brightness-95 disabled:opacity-60 sm:px-8"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <Link
          href="/admin/products"
          className="cursor-pointer flex h-11 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
