import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceClient } from "./service";

// Anon-key SSR auth client bound to the request cookie store. Used to read the
// signed-in admin in server components / the layout guard and by the login
// server actions. Returns null when Supabase env vars are absent (mock mode),
// so admin pages can degrade to "not configured" instead of crashing.
export async function getSupabaseAuthClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const store = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (toSet) => {
        // Cookie writes throw during a pure Server Component render; the proxy
        // (updateAdminSession) handles token-refresh writes instead.
        try {
          toSet.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* called from a Server Component — ignore */
        }
      },
    },
  });
}

export type AdminUser = { id: string; email: string | null };

// Guard for the protected admin subtree. Validates the JWT with the auth
// server (getUser, NOT getSession), then confirms the user is on the
// admin_user allowlist (checked via the service client, since that table has
// no public RLS policy). Redirects to /admin/login on any failure.
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await getSupabaseAuthClient();
  if (!supabase) redirect("/admin/login?e=not-configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const service = getSupabaseServiceClient();
  if (!service) redirect("/admin/login?e=not-configured");

  const { data: allow } = await service
    .from("admin_user")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!allow) {
    await supabase.auth.signOut();
    redirect("/admin/login?e=forbidden");
  }

  return { id: user.id, email: user.email ?? null };
}

// Proxy session refresh for /admin/* requests. Mirrors the canonical Supabase
// middleware pattern: writes refreshed tokens to both the request and the
// outgoing response so the session stays fresh. Must run instead of next-intl
// for admin paths (admin is non-localized).
export async function updateAdminSession(
  request: NextRequest,
): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured (mock mode): let the request through untouched.
  const response = NextResponse.next({ request });
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Triggers a token refresh if needed; result discarded (guarding happens in
  // requireAdmin at render time).
  await supabase.auth.getUser();

  return response;
}
