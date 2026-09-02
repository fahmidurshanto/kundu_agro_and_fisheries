"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus, updateOrderStatusInDb, deleteOrderFromDb } from "@/lib/orders";

export async function updateOrderStatusAction(id: string, newStatus: OrderStatus) {
  try {
    const updated = await updateOrderStatusInDb(id, newStatus);
    if (!updated) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    return { success: true, order: updated };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrderAction(id: string) {
  try {
    const deleted = await deleteOrderFromDb(id);
    if (!deleted) {
      return { success: false, error: "Order not found or already deleted" };
    }
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

