import Link from "next/link";
import { verifySellerSession } from "@/lib/seller-session";
import { getSellerInquiries } from "@/lib/seller-store";
import { getSellerProducts } from "../actions";

export const revalidate = 0;

export default async function SellerDashboardPage() {
  const seller = await verifySellerSession();
  const myProducts = await getSellerProducts();
  const inquiries = await getSellerInquiries(seller?.id || "seller_101");

  const availableCount = myProducts.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-800 to-teal-700 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            ✅ {seller?.status || "Verified"} Hatchery Partner
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {seller?.name || "Seller"}!
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            {seller?.hatcheryName || "Fish Seed Hatchery"} • {seller?.district || "Bangladesh"} Region
          </p>
          <p className="text-xs text-emerald-200/80 mt-1 inline-flex items-center gap-1 bg-emerald-900/30 rounded-full px-3 py-1">
            🔒 You can only list products in the{" "}
            <span className="font-bold text-white">Fish seed / মাছের পোনা</span>{" "}
            category.
          </p>
        </div>
        <div className="absolute right-6 -bottom-8 opacity-20 text-9xl select-none pointer-events-none">
          🐟
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              My Fish Seed Products
            </span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {availableCount}
            </span>
            <span className="text-xs font-medium text-emerald-600 mt-1 block">
              Listed on the marketplace
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-2xl">
            🐠
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Farmer Inquiries
            </span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {inquiries.length}
            </span>
            <span className="text-xs font-medium text-amber-600 mt-1 block">
              Direct Phone & WhatsApp
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-2xl">
            💬
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Category (Locked)
            </span>
            <span className="text-lg font-extrabold text-emerald-800 mt-1 block leading-tight">
              Fish seed
            </span>
            <span className="text-xs font-medium text-gray-500 mt-0.5 block">
              মাছের পোনা
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 text-2xl">
            🔒
          </div>
        </div>
      </div>

      {/* My Products Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            My Fish Seed Products &nbsp;
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5">
              {myProducts.length}
            </span>
          </h2>
          <Link
            href="/seller/products"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Manage All Products →
          </Link>
        </div>

        {myProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto text-4xl mb-3">🐟</div>
            <p className="text-sm font-semibold text-gray-700">No fish seed products yet.</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add your first fish seed listing to appear on the marketplace.
            </p>
            <Link
              href="/seller/products/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              ➕ Add Fish Seed Product
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4">Price (৳)</th>
                  <th className="px-6 py-4 text-right">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        />
                        <span className="font-semibold text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.unit}</td>
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      ৳{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
