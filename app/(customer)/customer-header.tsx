"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "../components/cart-context";
import { useLanguage } from "../components/language-context";
import { LanguageToggle } from "../components/language-toggle";
import { TranslationKey } from "@/lib/translations";

const navLinks: { href: string; key: TranslationKey }[] = [
  { href: "/", key: "home" },
  { href: "/products", key: "shop" },
  { href: "/orders", key: "myOrders" },
  { href: "/blogs", key: "blogs" },
  { href: "/admin", key: "adminPanel" },
];

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/kunduAgro.png"
            alt="Kundu Agro and Fisheries logo"
            width={38}
            height={38}
            className="rounded-xl shadow-sm transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {t("brandName")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions (Language Toggle + Cart Button) */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {/* Cart Icon Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
            className="relative flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200/80 p-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-100 bg-white px-4 py-3 md:hidden space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
