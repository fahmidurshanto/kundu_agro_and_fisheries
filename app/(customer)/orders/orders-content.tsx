"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/components/language-context";
import { Modal } from "@/app/components/modal";

export interface OrderItem {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface CustomerOrder {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
}

const mockOrders: CustomerOrder[] = [
  {
    id: "ORD-2026-8841",
    date: "2026-08-24",
    status: "processing",
    total: 3450,
    customerName: "Md. Alim Hossain",
    phone: "01712-345678",
    address: "House 14, Road 5, Block B, Mirpur",
    city: "Dhaka",
    paymentMethod: "Cash on Delivery",
    items: [
      {
        id: "p1",
        name: "Fresh Rui Fish (রুই মাছ)",
        thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
        price: 450,
        quantity: 3,
        unit: "kg",
      },
      {
        id: "p2",
        name: "Organic Bio-Fertilizer (জৈব সার)",
        thumbnail: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80",
        price: 1050,
        quantity: 2,
        unit: "bag (25kg)",
      },
    ],
  },
  {
    id: "ORD-2026-7612",
    date: "2026-08-18",
    status: "delivered",
    total: 5800,
    customerName: "Md. Alim Hossain",
    phone: "01712-345678",
    address: "House 14, Road 5, Block B, Mirpur",
    city: "Dhaka",
    paymentMethod: "bKash Digital Payment",
    items: [
      {
        id: "p3",
        name: "Floating Fish Feed (ভাসমান ফিড)",
        thumbnail: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80",
        price: 2900,
        quantity: 2,
        unit: "bag (50kg)",
      },
    ],
  },
];

export interface OrdersContentProps {
  initialOrders?: CustomerOrder[];
}

export function OrdersContent({ initialOrders }: OrdersContentProps) {
  const { t, language } = useLanguage();
  const [orders] = useState<CustomerOrder[]>(initialOrders || mockOrders);
  const [filter, setFilter] = useState<"all" | "processing" | "completed">("all");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (filter === "processing") return order.status === "processing" || order.status === "shipped";
    if (filter === "completed") return order.status === "delivered" || order.status === "cancelled";
    return true;
  });

  const getStatusBadgeClass = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStatusLabel = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "processing":
        return t("statusProcessing");
      case "shipped":
        return t("statusShipped");
      case "delivered":
        return t("statusDelivered");
      case "cancelled":
        return t("statusCancelled");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("ordersTitle")}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{t("ordersSubtitle")}</p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("filterAll")}
          </button>
          <button
            type="button"
            onClick={() => setFilter("processing")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filter === "processing"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("filterProcessing")}
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filter === "completed"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("filterCompleted")}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center space-y-4 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl">
            📦
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{t("noOrdersFound")}</h2>
            <p className="text-xs text-gray-500 mt-1">{t("noOrdersDesc")}</p>
          </div>
          <Link
            href="/products"
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
          >
            {t("shopNow")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md space-y-4"
            >
              {/* Top row info */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-gray-900 tracking-wider">
                    #{order.id}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Items summary */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl bg-gray-50/70 p-2.5 border border-gray-100"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-gray-100">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: {item.quantity} ({item.unit})
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom row summary & action button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-xs text-gray-500">{t("totalAmount")}: </span>
                  <span className="text-base font-extrabold text-primary">
                    ৳{order.total.toLocaleString(language === "bn" ? "bn-BD" : "en-IN")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                >
                  {t("viewOrderDetails")} →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`${t("orderSummary")} — #${selectedOrder?.id}`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header Banner / Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-950 to-primary/95 p-4 text-white shadow-md">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  {t("orderStatus")}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-extrabold capitalize shadow-sm ${getStatusBadgeClass(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-200 block">{t("orderDate")}</span>
                <span className="text-xs font-bold text-white">{selectedOrder.date}</span>
              </div>
            </div>

            {/* Address & Payment Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Delivery Info */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t("deliveryAddress")}</span>
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 font-medium">{selectedOrder.phone}</p>
                  <p className="text-gray-500 leading-relaxed">
                    {selectedOrder.address}, {selectedOrder.city}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{t("paymentInfo")}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="inline-block rounded-lg bg-emerald-100/80 px-2.5 py-1 text-emerald-800 font-semibold">
                    {selectedOrder.paymentMethod}
                  </span>
                  <p className="text-[11px] text-gray-500 pt-1">
                    {selectedOrder.paymentMethod.toLowerCase().includes("cash")
                      ? "Payment pending upon receiving items"
                      : "Verified digital payment transaction"}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-gray-400">
                {t("orderedItems")} ({selectedOrder.items.length})
              </h4>
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden divide-y divide-gray-100 shadow-sm">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100 border border-gray-100 flex-shrink-0">
                        <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          ৳{item.price.toLocaleString(language === "bn" ? "bn-BD" : "en-IN")} × {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 flex-shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString(language === "bn" ? "bn-BD" : "en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Cost Breakdown */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{t("subtotal")}</span>
                <span className="font-semibold text-gray-900">
                  ৳{selectedOrder.total.toLocaleString(language === "bn" ? "bn-BD" : "en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/80 pt-2.5 text-sm font-bold text-gray-900">
                <span>{t("totalAmount")}</span>
                <span className="text-lg font-extrabold text-primary">
                  ৳{selectedOrder.total.toLocaleString(language === "bn" ? "bn-BD" : "en-IN")}
                </span>
              </div>
            </div>

            {/* Footer Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-all cursor-pointer"
              >
                {t("close")}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
