import { getProducts } from "@/lib/products";
import { ShopContent } from "@/app/(customer)/shop-content";

export default async function CustomerProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const products = await getProducts();
  const resolvedParams = await searchParams;

  return (
    <ShopContent
      products={products}
      initialCategory={resolvedParams?.category || "all"}
    />
  );
}



