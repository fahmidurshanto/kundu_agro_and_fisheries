"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { CustomerOrder, OrderStatus } from "@/lib/orders";
import { updateOrderStatusAction } from "./actions";
import { Modal } from "@/app/components/modal";

interface AdminOrdersClientProps {
  initialOrders: CustomerOrder[];
}

export function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(res.error || "Failed to update order status");
      }
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const getBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Orders Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            View customer orders and update dispatch / delivery statuses.
          </p>
        </div>

        {/* Status Filter */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
          {(["all", "processing", "shipped", "delivered", "cancelled"] as const).map(
            (statusKey) => (
              <button
                key={statusKey}
                type="button"
                onClick={() => setFilter(statusKey)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === statusKey
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {statusKey}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 font-bold text-primary">
                      ৳{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={isPending}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer outline-none ${getBadgeStyle(
                          order.status
                        )}`}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.id}`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Change Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gray-900 p-4 text-white">
              <div>
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">
                  Update Order Status
                </span>
                <span className="text-xs font-bold text-gray-200">{selectedOrder.date}</span>
              </div>
              <select
                disabled={isPending}
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm outline-none cursor-pointer focus:border-primary"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-1 text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wider block text-[11px]">
                  Customer & Shipping
                </span>
                <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-600">{selectedOrder.phone}</p>
                <p className="text-gray-500 leading-relaxed">
                  {selectedOrder.address}, {selectedOrder.city}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-1 text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wider block text-[11px]">
                  Payment Method
                </span>
                <span className="inline-block rounded-lg bg-emerald-100 px-2.5 py-1 text-emerald-800 font-bold">
                  {selectedOrder.paymentMethod}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <span className="font-bold text-gray-400 uppercase tracking-wider block text-xs">
                Ordered Items ({selectedOrder.items.length})
              </span>
              <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-100 overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100 border border-gray-100 flex-shrink-0">
                        <Image src={item.thumbnail || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-500">
                          ৳{item.price} × {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-xs font-bold text-gray-900">Total Order Amount</span>
              <span className="text-base font-extrabold text-primary">
                ৳{selectedOrder.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
