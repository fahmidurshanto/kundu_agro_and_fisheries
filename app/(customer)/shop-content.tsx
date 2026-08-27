"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { type Product, PRODUCT_CATEGORIES, PRODUCT_UNITS, BANGLADESH_DISTRICTS } from "@/lib/product-types";
import { useLanguage } from "../components/language-context";
import { useCart } from "../components/cart-context";
import { Modal } from "../components/modal";
import { addFishSeedProductAction } from "./products/actions";

export function ShopContent({
  products,
  initialCategory = "all",
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");

  const filteredDistricts = BANGLADESH_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearchQuery.toLowerCase())
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const categories = Array.from(
    new Set([...PRODUCT_CATEGORIES, ...products.map((p) => p.category)])
  );

  // Extract districts that currently have sellers
  const sellerDistricts = Array.from(
    new Set(products.map((p) => p.sellerDistrict).filter(Boolean) as string[])
  ).sort();

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesDistrict =
      selectedDistrict === "all" || p.sellerDistrict === selectedDistrict;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sellerDistrict && p.sellerDistrict.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDistrict && matchesSearch;
  });

  const isFishSeedCategory = selectedCategory === "Fish seed / মাছের পোনা";

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await addFishSeedProductAction(formData);
      if (res.error) {
        setFormError(res.error);
      } else if (res.success) {
        setFormSuccess(true);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess(false);
        }, 1500);
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Page Title & Search Bar & Add Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            {t("productsTitle")}
            {isFishSeedCategory && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                🐟 Fish Seed Marketplace
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {filteredProducts.length} {t("productsSubtitleCount")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Add Fish Seed Product Button for Sellers */}
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setFormSuccess(false);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {language === "bn" ? "মাছের পোনা পণ্য যোগ করুন (বিক্রেতা)" : "Add Fish Seed Product (Seller)"}
          </button>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
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
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory("all");
            setSelectedDistrict("all");
          }}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${selectedCategory === "all"
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
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Searchable Seller District Filter Section */}
      {(isFishSeedCategory || sellerDistricts.length > 0) && (
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 to-teal-50/40 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                📍 {language === "bn" ? "বিক্রেতার জেলা দিয়ে ফিল্টার করুন:" : "Filter Sellers by District:"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setFormSuccess(false);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {language === "bn" ? "মাছের পোনা যোগ করুন" : "+ Add Fish Seed Product"}
              </button>

              {selectedDistrict !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict("all");
                    setDistrictSearchQuery("");
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  {language === "bn" ? "সব জেলা দেখুন" : "Clear Filter"}
                </button>
              )}
            </div>
          </div>

          {/* Searchable District Combobox / Dropdown Trigger */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Dropdown Toggle Button */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-sm hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>📍</span>
                    <span>
                      {selectedDistrict === "all"
                        ? language === "bn"
                          ? "সকল জেলা (All Districts)"
                          : "All Districts of Bangladesh"
                        : selectedDistrict}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700 flex-shrink-0">
                    <span className="text-[10px] font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedDistrict === "all"
                        ? `${BANGLADESH_DISTRICTS.length} Districts`
                        : "Selected"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDistrictDropdownOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Floating Searchable Dropdown Menu */}
                {isDistrictDropdownOpen && (
                  <>
                    {/* Backdrop listener */}
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsDistrictDropdownOpen(false)}
                    />

                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-2xl border border-emerald-200 bg-white p-3 shadow-xl space-y-2">
                      {/* Realtime Search Input inside Dropdown */}
                      <div className="relative">
                        <input
                          type="text"
                          value={districtSearchQuery}
                          onChange={(e) => setDistrictSearchQuery(e.target.value)}
                          placeholder={
                            language === "bn"
                              ? "জেলা খুঁজুন (যেমন: বগুড়া, ময়মনসিংহ, যশোর)..."
                              : "🔍 Search district name (e.g. Bogura, Mymensingh)..."
                          }
                          autoFocus
                          className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 px-3.5 py-2 pl-9 text-xs outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <svg
                          className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      {/* Quick Shortcut Pills for Districts with Active Sellers */}
                      {sellerDistricts.length > 0 && !districtSearchQuery && (
                        <div className="border-b border-gray-100 pb-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            🔥 {language === "bn" ? "সক্রিয় বিক্রেতার জেলাসমূহ:" : "Districts with Active Sellers:"}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {sellerDistricts.map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  setSelectedDistrict(d);
                                  setIsDistrictDropdownOpen(false);
                                }}
                                className="rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold hover:bg-emerald-700 hover:text-white transition-colors cursor-pointer"
                              >
                                {d} •
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Filtered District Scrollable List */}
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {/* Option: All Districts */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistrict("all");
                            setIsDistrictDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${selectedDistrict === "all"
                            ? "bg-emerald-700 text-white"
                            : "hover:bg-emerald-50 text-gray-800"
                            }`}
                        >
                          <span>{language === "bn" ? "সকল জেলা (All Districts)" : "All Districts of Bangladesh"}</span>
                          {selectedDistrict === "all" && <span>✓</span>}
                        </button>

                        {filteredDistricts.length === 0 ? (
                          <div className="py-4 text-center text-xs text-gray-400">
                            {language === "bn" ? "কোন জেলা পাওয়া যায়নি" : "No matching districts found"}
                          </div>
                        ) : (
                          filteredDistricts.map((district) => {
                            const sellerCount = products.filter(
                              (p) => p.sellerDistrict === district
                            ).length;

                            return (
                              <button
                                key={district}
                                type="button"
                                onClick={() => {
                                  setSelectedDistrict(district);
                                  setIsDistrictDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${selectedDistrict === district
                                  ? "bg-emerald-700 text-white font-bold"
                                  : sellerCount > 0
                                    ? "bg-emerald-50/80 text-emerald-950 font-bold hover:bg-emerald-100"
                                    : "hover:bg-gray-100 text-gray-700"
                                  }`}
                              >
                                <span>{district}</span>
                                {sellerCount > 0 && (
                                  <span
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${selectedDistrict === district
                                      ? "bg-white text-emerald-900"
                                      : "bg-emerald-200/80 text-emerald-900"
                                      }`}
                                  >
                                    {sellerCount} {language === "bn" ? "বিক্রেতা" : "Seller"}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-2xl">
            🐟
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {t("catalogEmpty")}
          </p>
          <p className="text-xs text-gray-400">
            {language === "bn"
              ? "এই ক্যাটাগরিতে বা জেলায় এখনও কোন মাছের পোনা যোগ করা হয়নি।"
              : "No products found in this category or district."}
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            + {language === "bn" ? "প্রথম পোনা পণ্য যোগ করুন" : "Add First Fish Seed Product"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isFishSeed = product.category === "Fish seed / মাছের পোনা" || product.sellerDistrict;

            return (
              <div
                key={product.id}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${isFishSeed ? "border-emerald-100/80 hover:border-emerald-300" : "border-gray-100"
                  }`}
              >
                {/* Product Thumbnail */}
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

                  {/* District Badge */}
                  {product.sellerDistrict && (
                    <span className="absolute top-3 right-3 rounded-full bg-emerald-900/90 text-white backdrop-blur-sm px-3 py-0.5 text-[11px] font-bold shadow-md flex items-center gap-1">
                      📍 {product.sellerDistrict}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Seller Info Badge */}
                  {product.sellerName && (
                    <div className="mt-2 flex flex-col gap-1 rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1 truncate">
                          👨‍🌾 {product.sellerName}
                        </span>
                        {product.sellerDistrict && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {product.sellerDistrict}
                          </span>
                        )}
                      </div>
                      {product.sellerPhone && (
                        <a
                          href={`tel:${product.sellerPhone}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline pt-0.5"
                        >
                          📞 {product.sellerPhone} (কল করুন)
                        </a>
                      )}
                    </div>
                  )}

                  <p className="mt-2 line-clamp-2 text-xs text-gray-500 flex-1">
                    {product.description}
                  </p>

                  {/* Price & Action */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        ৳{product.price.toLocaleString(language === "bn" ? "bn-BD" : "en-IN")}
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

                    <div className="flex items-center gap-2">
                      {product.sellerPhone ? (
                        <a
                          href={`tel:${product.sellerPhone}`}
                          className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors flex items-center gap-1"
                        >
                          📞 {language === "bn" ? "কল দিন" : "Call"}
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="cursor-pointer rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                      >
                        {t("addToCart")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Fish Seed Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          language === "bn"
            ? "🐟 মাছের পোনা পণ্য যোগ করুন (যেকোনো জেলা)"
            : "🐟 Add Fish Seed Product (Any District)"
        }
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            {language === "bn"
              ? "বাংলাদেশের যেকোনো জেলার হ্যাচারি বা পোনা বিক্রেতা নিচে আপনার মাছের পোনার তথ্য পূরণ করে পণ্য প্রকাশ করতে পারেন।"
              : "Hatchery owners and fish seed suppliers from any district of Bangladesh can list fish seed products below."}
          </p>

          {formError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
              ⚠️ {formError}
            </div>
          )}

          {formSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              ✅ {language === "bn" ? "আপনার মাছের পোনা সফলভাবে যোগ করা হয়েছে!" : "Fish seed product added successfully!"}
            </div>
          )}

          {/* Seller Details Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
            <h4 className="sm:col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              👤 {language === "bn" ? "বিক্রেতার বিবরণ (Seller Info)" : "Seller Details"}
            </h4>

            {/* Seller / Hatchery Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "বিক্রেতা / হ্যাচারির নাম *" : "Seller / Hatchery Name *"}
              </label>
              <input
                type="text"
                name="sellerName"
                required
                placeholder="e.g. Ma Fatema Hatchery / মো: রফিকুল ইসলাম"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* District Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "জেলা (District) *" : "District *"}
              </label>
              <select
                name="sellerDistrict"
                required
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="" disabled>
                  {language === "bn" ? "-- জেলা নির্বাচন করুন --" : "-- Select District --"}
                </option>
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "যোগাযোগের মোবাইল নম্বর *" : "Contact Mobile Phone Number *"}
              </label>
              <input
                type="tel"
                name="sellerPhone"
                required
                placeholder="e.g. 01712-345678"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-xs font-bold uppercase tracking-wider text-gray-700 pt-2">
              🐟 {language === "bn" ? "পোনা পণ্যের তথ্য (Product Info)" : "Fish Seed Details"}
            </h4>

            {/* Fish Seed Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "পোনা মাছের নাম (Product Name) *" : "Fish Seed Name *"}
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. 3-inch Organic Rui Fish Seed (রুই মাছের পোনা)"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "মূল্য (Price in BDT ৳) *" : "Price (৳) *"}
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0.1"
                required
                placeholder="e.g. 5.50 or 1500"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "একক (Unit) *" : "Unit *"}
              </label>
              <select
                name="unit"
                defaultValue="piece"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {PRODUCT_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload or URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "পণ্যের ছবি (Image Upload)" : "Product Image File"}
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                {language === "bn" ? "অথবা ছবির লিঙ্ক (Image URL) দিতে পারেন:" : "Or enter an image URL:"}
              </p>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs outline-none focus:border-primary"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === "bn" ? "বিস্তারিত বিবরণ (Description)" : "Description / Details"}
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="e.g. 100% healthy fingerlings, high growth rate, available for nationwide transport..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Form Action Buttons - Sticky at bottom */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm flex items-center justify-end gap-3 pt-3 pb-1 border-t border-gray-100 z-10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              {t("close")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-2 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 cursor-pointer"
            >
              {isPending
                ? language === "bn"
                  ? "যোগ করা হচ্ছে..."
                  : "Saving..."
                : language === "bn"
                  ? "পণ্য প্রকাশ করুন"
                  : "Publish Fish Seed"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
