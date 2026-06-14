import type { CommerceProvider } from "./types";
import { supabaseCommerce } from "./supabase";
import { mockCommerce } from "./mock";

// Single entry point the UI imports. Phase A swaps this binding to a
// Medusa-backed provider; nothing else in the storefront changes.
//
// Until Supabase keys are configured in .env.local, fall back to an in-memory
// catalog so the prototype is fully browsable. The moment the Supabase env
// vars exist, this auto-switches to the real DB — no code change needed.
const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const commerce: CommerceProvider = hasSupabase
  ? supabaseCommerce
  : mockCommerce;

export const commerceBackend = hasSupabase ? "supabase" : "mock";

export * from "./types";
export { formatMoney } from "./money";
