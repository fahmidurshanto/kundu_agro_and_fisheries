"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product } from "@/lib/product-types";
import { useLanguage } from "../components/language-context";
import { useCart } from "../components/cart-context";

export function ShopContent({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("productsTitle")}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {filteredProducts.length} {t("productsSubtitleCount")}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchProductsPlaceholder")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-xs shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            selectedCategory === "all"
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("allCategories")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-gray-700">
            {t("catalogEmpty")}
          </p>
          <p className="text-xs text-gray-400 mt-1">{t("noProductsSubtitle")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-52 w-full overflow-hidden bg-gray-50">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">
                  {product.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 flex-1">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      ৳{product.price}
                    </span>
                    <span className="text-xs text-gray-400 font-normal ml-1">
                      / {product.unit}
                    </span>
                    {product.compareAtPrice && (
                      <span className="block text-[11px] text-gray-400 line-through">
                        ৳{product.compareAtPrice}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    {t("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
