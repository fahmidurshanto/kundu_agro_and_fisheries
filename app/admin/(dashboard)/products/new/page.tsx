import type { Metadata } from "next";
import { ProductForm } from "./product-form";
import { AddProductHeader } from "./add-product-header";

export const metadata: Metadata = {
  title: "Add Product | Kundu Agro and Fisheries",
};

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AddProductHeader />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm />
      </div>
    </div>
  );
}

