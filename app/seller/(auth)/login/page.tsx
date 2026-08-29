import type { Metadata } from "next";
import { LanguageProvider } from "@/app/components/language-context";
import { SellerLoginForm } from "./seller-login-form";

export const metadata: Metadata = {
  title: "Fish Seed Seller Login | Kundu Agro & Fisheries",
};

export default function SellerLoginPage() {
  return (
    <LanguageProvider>
      <main className="flex min-h-screen flex-1 items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-md">
          <SellerLoginForm />
        </div>
      </main>
    </LanguageProvider>
  );
}

