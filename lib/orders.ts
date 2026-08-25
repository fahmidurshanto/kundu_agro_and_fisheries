import fs from "fs/promises";
import path from "path";

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

export async function getOrders(): Promise<CustomerOrder[]> {
  try {
    const data = await fs.readFile(ordersFilePath, "utf-8");
    return JSON.parse(data) as CustomerOrder[];
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<CustomerOrder | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function updateOrderStatusInDb(
  id: string,
  newStatus: OrderStatus
): Promise<CustomerOrder | null> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index].status = newStatus;
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  return orders[index];
}
