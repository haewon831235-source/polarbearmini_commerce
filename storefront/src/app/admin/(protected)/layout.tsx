import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { signOutAction } from "../login/actions";

// Guards the whole protected admin subtree. requireAdmin() redirects to
// /admin/login when the visitor is not a signed-in allowlisted admin.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-semibold">
            Polaris Atelier 관리자
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground">
              개요
            </Link>
            <Link href="/admin/orders" className="hover:text-foreground">
              결제·주문
            </Link>
            <Link href="/admin/visitors" className="hover:text-foreground">
              방문자
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="hidden sm:inline">{admin.email}</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-md border border-border px-2 py-1 hover:bg-muted"
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
