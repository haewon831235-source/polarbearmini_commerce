import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

// Read-only data access for the admin dashboard. Every query goes through the
// service-role client (the backing tables have no public RLS policy). Returns
// safe empty defaults when Supabase is not configured, so pages render a
// "준비중/no data" state instead of crashing.

export interface ShopOrderRow {
  id: string;
  payment_id: string;
  status: "started" | "paid" | "failed" | "error";
  error_reason: string | null;
  order_name: string | null;
  amount_minor: number | null;
  currency: string | null;
  locale: string | null;
  customer_name: string | null;
  customer_email: string | null;
  created_at: string;
}

export interface PageViewRow {
  id: string;
  visitor_id: string | null;
  path: string;
  locale: string | null;
  referrer: string | null;
  country: string | null;
  created_at: string;
}

export interface OverviewStats {
  configured: boolean;
  todayRevenueMinor: number;
  todayPaidCount: number;
  todayErrorCount: number;
  todayVisitors: number;
  todayPageViews: number;
}

function startOfTodayISO(): string {
  // KST (UTC+9) day boundary — the shop operates in Korea.
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  kst.setUTCHours(0, 0, 0, 0);
  return new Date(kst.getTime() - 9 * 60 * 60 * 1000).toISOString();
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const empty: OverviewStats = {
    configured: false,
    todayRevenueMinor: 0,
    todayPaidCount: 0,
    todayErrorCount: 0,
    todayVisitors: 0,
    todayPageViews: 0,
  };

  const supabase = getSupabaseServiceClient();
  if (!supabase) return empty;

  const since = startOfTodayISO();

  const [paid, errored, views] = await Promise.all([
    supabase
      .from("shop_order")
      .select("amount_minor")
      .eq("status", "paid")
      .gte("created_at", since),
    supabase
      .from("shop_order")
      .select("id", { count: "exact", head: true })
      .in("status", ["failed", "error"])
      .gte("created_at", since),
    supabase
      .from("page_view")
      .select("visitor_id")
      .gte("created_at", since),
  ]);

  const paidRows = (paid.data ?? []) as { amount_minor: number | null }[];
  const viewRows = (views.data ?? []) as { visitor_id: string | null }[];
  const uniqueVisitors = new Set(
    viewRows.map((v) => v.visitor_id).filter(Boolean),
  );

  return {
    configured: true,
    todayRevenueMinor: paidRows.reduce((s, r) => s + (r.amount_minor ?? 0), 0),
    todayPaidCount: paidRows.length,
    todayErrorCount: errored.count ?? 0,
    todayVisitors: uniqueVisitors.size,
    todayPageViews: viewRows.length,
  };
}

export async function getRecentOrders(limit = 100): Promise<{
  configured: boolean;
  rows: ShopOrderRow[];
}> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { configured: false, rows: [] };

  const { data } = await supabase
    .from("shop_order")
    .select(
      "id,payment_id,status,error_reason,order_name,amount_minor,currency,locale,customer_name,customer_email,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return { configured: true, rows: (data ?? []) as ShopOrderRow[] };
}

export async function getRecentPageViews(limit = 200): Promise<{
  configured: boolean;
  rows: PageViewRow[];
}> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { configured: false, rows: [] };

  const { data } = await supabase
    .from("page_view")
    .select("id,visitor_id,path,locale,referrer,country,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return { configured: true, rows: (data ?? []) as PageViewRow[] };
}
