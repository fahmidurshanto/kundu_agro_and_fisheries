import { getOrders } from "@/lib/orders";
import { OrdersContent } from "./orders-content";

export const metadata = {
  title: "My Orders | Kundu Agro and Fisheries",
  description: "View and track your agro and fisheries product orders.",
};

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersContent initialOrders={orders} />;
}
