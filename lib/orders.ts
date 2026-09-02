import fs from "fs/promises";
import path from "path";
import { adminFetch } from "./api/admin-client";

export interface OrderItem {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  unit: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface CustomerOrder {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
}

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function formatBackendOrder(o: any): CustomerOrder {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const items = (o.items || []).map((item: any) => {
    let thumbnail = item.thumbnail || item.image || "";
    if (thumbnail && !thumbnail.startsWith("http://") && !thumbnail.startsWith("https://")) {
      const cleanPath = thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
      thumbnail = `${backendBase}${cleanPath}`;
    }
    return {
      id: item.product?._id || item.product || item.id || crypto.randomUUID(),
      name: item.name || "Product",
      thumbnail,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      unit: item.unit || "kg",
    };
  });

  return {
    id: o.orderId || o._id || o.id,
    date: o.date || (o.createdAt ? new Date(o.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
    status: (o.status || "processing").toLowerCase() as OrderStatus,
    total: Number(o.total || o.subtotal || 0),
    items,
    customerName: o.customerName || "Customer",
    phone: o.phone || "",
    address: o.address || "",
    city: o.city || "",
    paymentMethod: o.paymentMethod || "Cash on Delivery",
  };
}

export async function getOrders(): Promise<CustomerOrder[]> {
  try {
    const res = await adminFetch<any[]>("/admin/orders");
    const list = res.data || res.orders || (Array.isArray(res) ? res : null);
    if (list && Array.isArray(list)) {
      return list.map(formatBackendOrder);
    }
  } catch (err) {
    console.warn("Backend orders fetch failed, using local fallback:", err);
  }

  try {
    const data = await fs.readFile(ordersFilePath, "utf-8");
    return JSON.parse(data) as CustomerOrder[];
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<CustomerOrder | null> {
  try {
    const res = await adminFetch<any>(`/admin/orders/${id}`);
    const item = res.data || res.order || res;
    if (item && (item._id || item.id || item.orderId)) {
      return formatBackendOrder(item);
    }
  } catch (err) {
    console.warn(`Backend order fetch for ${id} failed, using local fallback:`, err);
  }

  const orders = await getOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function updateOrderStatusInDb(
  id: string,
  newStatus: OrderStatus
): Promise<CustomerOrder | null> {
  try {
    const res = await adminFetch<any>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = res.data || res.order;
    if (updated) return formatBackendOrder(updated);
  } catch (err) {
    console.warn(`Backend updateOrderStatus for ${id} failed, updating locally:`, err);
  }

  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index].status = newStatus;
  try {
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  } catch {}
  return orders[index];
}

export async function deleteOrderFromDb(id: string): Promise<boolean> {
  try {
    const res = await adminFetch<any>(`/admin/orders/${id}`, {
      method: "DELETE",
    });
    if (res.success) return true;
  } catch (err) {
    console.warn(`Backend deleteOrder for ${id} failed:`, err);
  }

  try {
    const orders = await getOrders();
    const filtered = orders.filter((o) => o.id !== id);
    await fs.writeFile(ordersFilePath, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

