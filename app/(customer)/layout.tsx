import { LanguageProvider } from "../components/language-context";
import { CartProvider } from "../components/cart-context";
import { CustomerHeader } from "./customer-header";
import { CustomerFooter } from "./customer-footer";
import { CartDrawer } from "../components/cart-drawer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-gray-50/30">
          <CustomerHeader />
          <main className="flex-1">{children}</main>
          <CustomerFooter />
          <CartDrawer />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
