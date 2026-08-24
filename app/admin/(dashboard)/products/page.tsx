import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductsList } from "./products-list";

export const metadata: Metadata = {
  title: "Products | Kundu Agro and Fisheries",
};

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsList products={products} />;
}

