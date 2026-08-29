import { verifySellerSession } from "@/lib/seller-session";

export const revalidate = 0;

export default async function ProfilePage() {
  const seller = await verifySellerSession();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Hatchery Profile & Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your fish seed nursery registration and contact details.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-emerald-50 p-4 border border-emerald-100">
          <div>
            <span className="text-xs text-emerald-700 font-semibold block uppercase">
              Verification Status
            </span>
            <span className="text-sm font-bold text-emerald-900 mt-0.5 block">
              ✅ Verified Hatchery Partner
            </span>
          </div>
          <div>
            <span className="text-xs text-emerald-700 font-semibold block uppercase">
              Partner Rating
            </span>
            <span className="text-sm font-bold text-emerald-900 mt-0.5 block">
              ⭐ 4.9 / 5.0 (Top Supplier)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Hatchery Name
            </label>
            <input
              type="text"
              defaultValue={seller?.hatcheryName}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-900 font-medium"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Contact Owner Name
            </label>
            <input
              type="text"
              defaultValue={seller?.name}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-900 font-medium"
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                defaultValue={seller?.phone}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-900 font-medium"
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                District / Division
              </label>
              <input
                type="text"
                defaultValue={seller?.district}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-900 font-medium"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
