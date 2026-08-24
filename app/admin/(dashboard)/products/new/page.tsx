import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "./product-form";

export const metadata: Metadata = {
  title: "Add Product | Kundu Agro and Fisheries",
};

export default function AddProductPage() {
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
          Add Product
        </h1>
        <p className="text-sm text-muted-foreground">
          Publish a new product to your store catalog.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
