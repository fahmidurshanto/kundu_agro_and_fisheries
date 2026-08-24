import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { logout } from "./actions";
import { MobileNav } from "./mobile-nav";

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
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Admin panel
            </span>
          </div>

          {/* Desktop Nav — hidden on mobile */}
          <div className="hidden items-center gap-5 md:flex">
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/admin/users"
                className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Users
              </Link>
              <Link
                href="/admin/products/new"
                className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Add Product
              </Link>
            </nav>
            <form action={logout}>
              <button
                type="submit"
                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Log out
              </button>
            </form>
          </div>

          {/* Mobile Hamburger + Drawer — visible only on mobile */}
          <MobileNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
