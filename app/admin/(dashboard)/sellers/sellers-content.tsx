"use client";

import { useState } from "react";
import Link from "next/link";
import { FishSeedSeller, SellerStatus } from "@/lib/seller-types";
import { useLanguage } from "@/app/components/language-context";
import { toggleSellerStatusAction, deleteSellerAction } from "./actions";

type SellersContentProps = {
  sellers: FishSeedSeller[];
};

export function SellersContent({ sellers }: SellersContentProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedSeller, setSelectedSeller] = useState<FishSeedSeller | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Filter sellers
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.hatcheryName.toLowerCase().includes(search.toLowerCase()) ||
      seller.name.toLowerCase().includes(search.toLowerCase()) ||
      seller.district.toLowerCase().includes(search.toLowerCase()) ||
      seller.fishTypes.some((ft) => ft.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || seller.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (seller: FishSeedSeller, nextStatus: SellerStatus) => {
    setIsUpdating(seller.id);
    await toggleSellerStatusAction(seller.id, nextStatus);
    setIsUpdating(null);
    if (selectedSeller?.id === seller.id) {
      setSelectedSeller({ ...selectedSeller, status: nextStatus });
    }
  };

  const handleDelete = async (sellerId: string) => {
    if (!confirm("Are you sure you want to remove this seller?")) return;
    setIsUpdating(sellerId);
    await deleteSellerAction(sellerId);
    setIsUpdating(null);
    if (selectedSeller?.id === sellerId) {
      setSelectedSeller(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("fishSeedSellersTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("fishSeedSellersSubtitle")}
          </p>
        </div>
        <Link
          href="/admin/sellers/new"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("addSeller")}
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by hatchery, name, district, or fish type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {["All", "Verified", "Pending", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === status
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers List / Table */}
      {filteredSellers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            🐟
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {t("noSellersFound")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noSellersFoundDesc")}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">{t("tableSeller")}</th>
                  <th className="px-6 py-4">{t("tableDistrict")}</th>
                  <th className="px-6 py-4">{t("tableFishTypes")}</th>
                  <th className="px-6 py-4">{t("tableCapacity")}</th>
                  <th className="px-6 py-4">{t("tableStatus")}</th>
                  <th className="px-6 py-4 text-right">{t("tableActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSellers.map((seller) => (
                  <tr
                    key={seller.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <button
                          onClick={() => setSelectedSeller(seller)}
                          className="font-semibold text-gray-900 hover:text-primary transition-colors text-left cursor-pointer"
                        >
                          {seller.hatcheryName}
                        </button>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>👤 {seller.name}</span>
                          <span>•</span>
                          <span>📞 {seller.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      📍 {seller.district}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {seller.fishTypes.map((ft, idx) => (
                          <span
                            key={idx}
                            className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800"
                          >
                            {ft}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {seller.capacityPerMonth}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          seller.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : seller.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            seller.status === "Verified"
                              ? "bg-emerald-600"
                              : seller.status === "Pending"
                              ? "bg-amber-600"
                              : "bg-gray-400"
                          }`}
                        />
                        {seller.status === "Verified"
                          ? t("statusVerified")
                          : seller.status === "Pending"
                          ? t("statusPending")
                          : t("statusInactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                      >
                        {t("view")}
                      </button>
                      {seller.status !== "Verified" && (
                        <button
                          disabled={isUpdating === seller.id}
                          onClick={() => handleToggleStatus(seller, "Verified")}
                          className="cursor-pointer text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-50"
                        >
                          {t("verify")}
                        </button>
                      )}
                      {seller.status === "Verified" && (
                        <button
                          disabled={isUpdating === seller.id}
                          onClick={() => handleToggleStatus(seller, "Inactive")}
                          className="cursor-pointer text-xs font-semibold text-amber-600 hover:underline disabled:opacity-50"
                        >
                          {t("suspend")}
                        </button>
                      )}
                      <button
                        disabled={isUpdating === seller.id}
                        onClick={() => handleDelete(seller.id)}
                        className="cursor-pointer text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  {t("sellerDetails")}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {selectedSeller.hatcheryName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div>
                  <span className="text-xs text-gray-500 block">{t("contactPerson")}</span>
                  <span className="font-medium text-gray-900">{selectedSeller.name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{t("phoneLabel")}</span>
                  <a
                    href={`tel:${selectedSeller.phone}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {selectedSeller.phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{t("district")}</span>
                  <span className="font-medium text-gray-900">{selectedSeller.district}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{t("capacityPerMonth")}</span>
                  <span className="font-medium text-gray-900">{selectedSeller.capacityPerMonth}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-1">{t("locationDetails")}</span>
                <p className="text-gray-700 bg-white border border-gray-100 p-2.5 rounded-lg">
                  {selectedSeller.locationDetails || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-1.5">{t("fishTypes")}</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeller.fishTypes.map((ft, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                    >
                      🐟 {ft}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {t("joinedDate")}: {new Date(selectedSeller.joinedDate).toLocaleDateString()}
                </span>
                <span className="text-xs font-semibold text-amber-600">
                  ⭐ Rating: {selectedSeller.rating} / 5.0
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={`https://wa.me/${selectedSeller.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                💬 WhatsApp Seller
              </a>
              <button
                onClick={() => setSelectedSeller(null)}
                className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
