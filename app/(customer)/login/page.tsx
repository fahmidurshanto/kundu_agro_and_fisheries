import type { Metadata } from "next";
import { CustomerLoginPage } from "./customer-login-page";

export const metadata: Metadata = {
  title: "Customer Login & Registration | Kundu Agro & Fisheries",
};

export default function LoginPage() {
  return <CustomerLoginPage />;
}
