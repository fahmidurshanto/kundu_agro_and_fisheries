import type { Metadata } from "next";
import { ProductForm } from "./product-form";

export const metadata: Metadata = {
  title: "Add Product | Kundu Agro and Fisheries",
};

export default function AddProductPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add Product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish a new product to your store catalog.
        </p>
      </div>

      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
