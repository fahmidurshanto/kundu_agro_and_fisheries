"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../components/cart-context";
import { useLanguage } from "../components/language-context";

export function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "cod",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    setTimeout(() => {
      setIsPending(false);
      setIsSubmitted(true);
      clearCart();
    }, 1000);
  };

  const formattedTotal = `৳${totalPrice.toLocaleString(
    language === "bn" ? "bn-BD" : "en-IN",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-emerald-600 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {t("orderSuccessTitle")}
        </h1>
        <p className="text-xs text-gray-600 leading-relaxed">
          {t("orderSuccessDesc")}
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-colors"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">{t("cartEmpty")}</h1>
        <p className="text-xs text-gray-500">{t("startShopping")}</p>
        <Link
          href="/products"
          className="inline-block rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          {t("shopNow")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("checkoutTitle")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Contact & Delivery Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              {t("contactInfo")}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("phoneNumber")} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01700-000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("shippingAddress")} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("districtCity")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("deliveryNotes")}
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              {t("paymentMethod")}
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  formData.paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === "cod"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">{t("cashOnDelivery")}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("cashOnDeliveryDesc")}</p>
                </div>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: "mobile" })}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  formData.paymentMethod === "mobile"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === "mobile"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "mobile" })}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">{t("digitalPayment")}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("digitalPaymentDesc")}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              {t("orderSummary")}
            </h2>

            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.quantity} × ৳{item.product.price} / {item.product.unit}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    ৳{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t("subtotal")}</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary text-lg">{formattedTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60"
            >
              {isPending ? t("placingOrder") : t("placeOrder")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
