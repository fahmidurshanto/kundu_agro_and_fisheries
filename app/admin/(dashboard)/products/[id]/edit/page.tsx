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
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Edit Product
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update “{product.name}” or remove its listing.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Back to products
        </Link>
      </div>

      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductEditForm product={product} />
      </div>
    </div>
  );
}
