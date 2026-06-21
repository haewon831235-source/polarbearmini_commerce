import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service-role Supabase client. Bypasses RLS — used ONLY on the server for the
// admin dashboard (reads orders/visitors) and for writing payment + visitor
// logs whose tables have no public policies.
//
// SECURITY: the key is read from SUPABASE_SERVICE_ROLE_KEY (NOT NEXT_PUBLIC_*),
// and this module is `server-only`, so it can never be bundled into the client.
// Never import this file from a client component.
//
// Returns null when the env vars are absent (e.g. local mock mode), so callers
// can degrade gracefully instead of crashing the storefront.
export function getSupabaseServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
