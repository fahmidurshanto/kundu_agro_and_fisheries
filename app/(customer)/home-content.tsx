"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/product-types";
import { type Blog } from "@/lib/blog-types";
import { useLanguage } from "../components/language-context";
import { useCart } from "../components/cart-context";

export function HomeContent({
  featuredProducts,
  latestBlogs,
}: {
  featuredProducts: Product[];
  latestBlogs: Blog[];
}) {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const categories = [
    { name: t("freshFish"), desc: t("freshFishDesc"), icon: "🐟" },
    { name: t("fishFeed"), desc: t("fishFeedDesc"), icon: "🌾" },
    { name: t("fertilizer"), desc: t("fertilizerDesc"), icon: "🌱" },
    { name: t("equipment"), desc: t("equipmentDesc"), icon: "⚙️" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 rounded-3xl mx-4 my-2 shadow-xl border border-gray-100">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/Gemini_Generated_Image_dxkrqfdxkrqfdxkr.jpg"
            alt="Kundu Agro and Fisheries Hero Banner"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-900/70 to-gray-950/80 backdrop-blur-[1px]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 text-center relative z-10">
          <span className="inline-flex items-center rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
            {t("heroBadge")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl max-w-3xl mx-auto leading-tight drop-shadow-md">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-base text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all"
            >
              {t("shopNow")}
            </Link>
            <Link
              href="/blogs"
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 hover:scale-[1.02] transition-all"
            >
              {t("exploreBlogs")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">
          {t("featuredCategories")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href="/products"
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-3 text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {t("latestProducts")}
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t("viewAllProducts")} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-50">
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
                <p className="mt-1 line-clamp-2 text-xs text-gray-500 flex-1">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-base font-bold text-primary">
                      ৳{product.price}
                    </span>
                    <span className="text-xs text-gray-400 font-normal ml-1">
                      / {product.unit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="cursor-pointer rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    {t("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 sm:p-12 text-white">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
            {t("whyChooseUs")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                🛡️
              </div>
              <h3 className="text-base font-bold">{t("qualityAssured")}</h3>
              <p className="text-xs text-gray-400">{t("qualityAssuredDesc")}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                🚚
              </div>
              <h3 className="text-base font-bold">{t("fastDelivery")}</h3>
              <p className="text-xs text-gray-400">{t("fastDeliveryDesc")}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                📞
              </div>
              <h3 className="text-base font-bold">{t("support247")}</h3>
              <p className="text-xs text-gray-400">{t("support247Desc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
