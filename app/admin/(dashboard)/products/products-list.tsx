"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/product-types";
import { useLanguage } from "@/app/components/language-context";
import { DeleteProductButton } from "./delete-product-button";

function formatPrice(value: number, locale: string): string {
  return `৳${value.toLocaleString(locale === "bn" ? "bn-BD" : "en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string, locale: string): string {
  return new Date(value).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProductsList({ products }: { products: Product[] }) {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("productsTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length === 0
              ? t("noProductsSubtitle")
              : language === "bn"
              ? `${products.length} ${t("productsSubtitleCount")}`
              : `${products.length} ${
                  products.length === 1
                    ? t("productSubtitleCount")
                    : t("productsSubtitleCount")
                }`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-95"
        >
          {t("addProduct")}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            {t("catalogEmpty")}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {t("addFirstProduct")}
          </p>
          <Link
            href="/admin/products/new"
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-95"
          >
            {t("addProduct")}
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
            >
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={72}
                height={72}
                className="h-18 w-full shrink-0 rounded-xl object-cover sm:h-18 sm:w-18"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    {product.name}
                  </h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {product.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {t("addedOn")} {formatDate(product.createdAt, language)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:justify-center sm:gap-1">
                <div className="sm:text-right">
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(product.price, language)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      / {product.unit}
                    </span>
                  </p>
                  {product.compareAtPrice ? (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.compareAtPrice, language)}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {t("edit")}
                  </Link>
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
