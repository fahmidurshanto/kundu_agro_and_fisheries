"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/app/components/language-context";
import { useLanguage } from "@/app/components/language-context";
import { LanguageToggle } from "@/app/components/language-toggle";
import { logoutSellerAction } from "../actions";

type SellerLayoutProps = {
  children: React.ReactNode;
};

function SellerDashboardInner({ children }: SellerLayoutProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/seller", label: t("sellerDashboard") },
    { href: "/seller/products", label: "My Fish Seed Products" },
    { href: "/seller/inquiries", label: t("farmerInquiries") },
    { href: "/seller/profile", label: t("hatcheryProfile") },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Seller Portal Header Bar */}
      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/seller" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
                🐟
              </span>
              <div>
                <span className="text-base font-bold text-gray-900 block leading-none">
                  Padma Fish Seed Hatchery
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  {t("sellerPortal")}
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/seller"
                    ? pathname === "/seller"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <LanguageToggle />

            <form action={logoutSellerAction}>
              <button
                type="submit"
                className="cursor-pointer rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {t("logout")}
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default function SellerDashboardLayout({ children }: SellerLayoutProps) {
  return (
    <LanguageProvider>
      <SellerDashboardInner>{children}</SellerDashboardInner>
    </LanguageProvider>
  );
}
