import { verifySellerSession } from "@/lib/seller-session";
import { getSellerInquiries } from "@/lib/seller-store";

export const revalidate = 0;

export default async function InquiriesPage() {
  const seller = await verifySellerSession();
  const inquiries = await getSellerInquiries(seller?.id || "seller_101");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Farmer Orders & Inquiries
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Direct purchase requests from fish farmers across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  📍 {inq.district}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  {inq.farmerName}
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {new Date(inq.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-1.5 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Requested Species:</span>
                <span className="font-semibold text-gray-900">{inq.requestedSpecies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Quantity Needed:</span>
                <span className="font-semibold text-emerald-700">{inq.requestedQuantity}</span>
              </div>
            </div>

            {inq.message && (
              <p className="text-xs text-gray-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50">
                💬 "{inq.message}"
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <a
                href={`tel:${inq.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                📞 Call Farmer
              </a>
              <a
                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                💬 WhatsApp Chat
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
