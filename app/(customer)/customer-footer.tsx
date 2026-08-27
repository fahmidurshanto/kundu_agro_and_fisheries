"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../components/language-context";

export function CustomerFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Image
                src="/kundu_logo.png"
                alt="Kundu Agro logo"
                width={32}
                height={32}
                className="rounded-lg object-contain"
              />
              <h3 className="text-base font-bold text-gray-900">{t("brandName")}</h3>
            </div>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  {t("shop")}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-primary transition-colors">
                  {t("blogs")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  {t("adminPanel")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("featuredCategories")}
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-gray-600">
              <li>{t("freshFish")}</li>
              <li>{t("fishFeed")}</li>
              <li>{t("fertilizer")}</li>
              <li>{t("equipment")}</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Support
            </h4>
            <p className="mt-3 text-xs text-gray-600">
              Email: info@kunduagro.com
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Hotline: +880 1700-000000
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Dhaka & Khulna Division, Bangladesh
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Kundu Agro and Fisheries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
