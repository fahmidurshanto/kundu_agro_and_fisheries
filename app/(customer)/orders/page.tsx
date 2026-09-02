import { redirect } from "next/navigation";
import { getOrders } from "@/lib/orders";
import { getCurrentCustomer } from "../auth-actions";
import { OrdersContent } from "./orders-content";

export const metadata = {
  title: "My Orders | Kundu Agro and Fisheries",
  description: "View and track your agro and fisheries product orders.",
};

export default async function OrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/login");
  }

  const orders = await getOrders();
  return <OrdersContent initialOrders={orders} />;
}
