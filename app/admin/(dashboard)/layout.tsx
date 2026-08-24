import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { LanguageProvider } from "@/app/components/language-context";
import { MobileNav } from "./mobile-nav";
import { HeaderNav } from "./header-nav";
import { BrandTitle } from "./brand-title";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE)?.value
  );
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Image
                src="/kunduAgro.png"
                alt="Kundu Agro and Fisheries logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <BrandTitle />
            </div>


            {/* Desktop Nav — hidden on mobile */}
            <HeaderNav />

            {/* Mobile Hamburger + Drawer — visible only on mobile */}
            <MobileNav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </div>
    </LanguageProvider>
  );
}

