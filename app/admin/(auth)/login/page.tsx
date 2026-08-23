import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | Kundu Agro and Fisheries",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <LoginForm />
      </div>
    </main>
  );
}
