import { getProducts } from "@/lib/products";
import { ShopContent } from "@/app/(customer)/shop-content";

export default async function CustomerProductsPage() {
  const products = await getProducts();

  return <ShopContent products={products} />;
}



