"use client";

import Image from "next/image";
import { Modal } from "@/app/components/modal";
import { useLanguage } from "@/app/components/language-context";
import { type Product } from "@/lib/product-types";

function formatPrice(value: number, locale: string): string {
  return `৳${value.toLocaleString(locale === "bn" ? "bn-BD" : "en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string, locale: string): string {
  return new Date(value).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { t, language } = useLanguage();

  return (
    <Modal isOpen={true} onClose={onClose} title={t("productDetails") || "Product Details"} maxWidth="md">
      <div className="flex flex-col gap-5">
        {/* Product Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <Image
            src={product.thumbnail || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Header Info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {product.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(product.createdAt, language)}
            </span>
          </div>

          <h3 className="text-xl font-bold text-foreground">{product.name}</h3>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-primary">
              {formatPrice(product.price, language)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {product.unit}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, language)}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("descriptionLabel") || "Description"}
          </h4>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {product.description || "No description provided."}
          </p>
        </div>

        {/* Seller / Additional Information if available */}
        {(product.sellerName || product.sellerDistrict || product.sellerPhone) && (
          <>
            <div className="border-t border-gray-100" />
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs">
              {product.sellerName && (
                <div>
                  <span className="font-semibold text-muted-foreground block uppercase">Seller</span>
                  <span className="font-medium text-foreground">{product.sellerName}</span>
                </div>
              )}
              {product.sellerDistrict && (
                <div>
                  <span className="font-semibold text-muted-foreground block uppercase">District</span>
                  <span className="font-medium text-foreground">{product.sellerDistrict}</span>
                </div>
              )}
              {product.sellerPhone && (
                <div className="col-span-2">
                  <span className="font-semibold text-muted-foreground block uppercase">Contact Phone</span>
                  <span className="font-medium text-foreground">{product.sellerPhone}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
