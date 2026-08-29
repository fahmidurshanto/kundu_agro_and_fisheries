"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/product-types";
import { deleteSellerProductAction, DeleteProductState } from "../../actions";

type SellerProductsClientProps = {
  products: Product[];
};

const initialDeleteState: DeleteProductState = {};

export function SellerProductsClient({ products }: SellerProductsClientProps) {
  const [, deleteAction, isDeleting] = useActionState(deleteSellerProductAction, initialDeleteState);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Fish Seed Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              🔒 Category locked: Fish seed / মাছের পোনা
            </span>
            All your listings go directly into the main marketplace.
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 shrink-0"
        >
          ➕ Add Fish Seed Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-14 text-center">
          <div className="text-5xl mb-3">🐟</div>
          <h3 className="text-base font-semibold text-gray-700">No fish seed products yet.</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-5">
            Start listing your hatchery&apos;s fish seed varieties on the marketplace.
          </p>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            ➕ Add Your First Listing
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Price (৳)</th>
                <th className="px-6 py-4">Old Price</th>
                <th className="px-6 py-4">Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-11 w-11 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-emerald-700">Fish seed / মাছের পোনা</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.unit}</td>
                  <td className="px-6 py-4 font-bold text-emerald-700">
                    ৳{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-400 line-through text-xs">
                    {product.compareAtPrice ? `৳${product.compareAtPrice.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {confirmId === product.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-600">Sure?</span>
                        <form action={deleteAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            disabled={isDeleting}
                            className="cursor-pointer text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting…" : "Yes, Delete"}
                          </button>
                        </form>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="cursor-pointer text-xs text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(product.id)}
                        className="cursor-pointer text-xs font-semibold text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
