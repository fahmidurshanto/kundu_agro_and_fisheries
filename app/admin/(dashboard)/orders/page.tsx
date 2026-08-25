import { getOrders } from "@/lib/orders";
import { AdminOrdersClient } from "./admin-orders-client";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient initialOrders={orders} />;
}
