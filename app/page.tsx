import { getProducts } from "@/lib/products";
import { getBlogs } from "@/lib/blogs";
import CustomerLayout from "./(customer)/layout";
import { HomeContent } from "./(customer)/home-content";

export default async function HomePage() {
  const [products, blogs] = await Promise.all([getProducts(), getBlogs()]);

  return (
    <CustomerLayout>
      <HomeContent featuredProducts={products} latestBlogs={blogs} />
    </CustomerLayout>
  );
}
