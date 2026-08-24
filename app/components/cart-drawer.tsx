"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-context";
import { useLanguage } from "./language-context";

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { t, language } = useLanguage();

  if (!isCartOpen) return null;

  const formattedTotal = `৳${totalPrice.toLocaleString(
    language === "bn" ? "bn-BD" : "en-IN",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">{t("yourCart")}</h2>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">{t("cartEmpty")}</p>
                <p className="text-xs text-gray-500 mt-1">{t("startShopping")}</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 bg-white shadow-sm"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      ৳{item.product.price} / {item.product.unit}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="h-6 w-6 rounded border border-gray-200 text-xs font-bold flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold px-1">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="h-6 w-6 rounded border border-gray-200 text-xs font-bold flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 text-xs font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>{t("subtotal")}</span>
                <span className="text-lg text-primary font-bold">{formattedTotal}</span>
              </div>
              <p className="text-xs text-gray-400">{t("shippingCalculated")}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  {t("clearCart")}
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 text-center rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-colors"
                >
                  {t("proceedToCheckout")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
