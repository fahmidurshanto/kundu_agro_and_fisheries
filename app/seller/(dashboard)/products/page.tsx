import { getSellerProducts } from "../../actions";
import { SellerProductsClient } from "./products-client";

export const revalidate = 0;

export default async function SellerProductsPage() {
  const products = await getSellerProducts();
  return <SellerProductsClient products={products} />;
}
