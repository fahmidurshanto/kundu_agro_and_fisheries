import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductEditForm } from "./product-edit-form";

export const metadata: Metadata = {
  title: "Edit Product | Kundu Agro and Fisheries",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-xs font-medium text-muted-foreground hover:text-primary"
        >
          ← Back to Products
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Edit Product
        </h1>
        <p className="text-sm text-muted-foreground">
          Update “{product.name}” or remove its listing.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductEditForm product={product} />
      </div>
    </div>
  );
}
