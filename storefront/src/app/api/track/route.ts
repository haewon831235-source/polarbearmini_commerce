import { cookies, headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

// First-party page-view logging. The storefront beacons here on every route
// change. Fire-and-forget: always returns 204, never blocks the visitor.
// No-ops silently when Supabase is not configured.

const VID = "pbm_vid"; // long-lived visitor id (~1y)
const SID = "pbm_sid"; // session id

function randomId(): string {
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  try {
    const store = await cookies();
    const hdrs = await headers();

    let visitorId = store.get(VID)?.value;
    if (!visitorId) {
      visitorId = randomId();
      store.set(VID, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    let sessionId = store.get(SID)?.value;
    if (!sessionId) {
      sessionId = randomId();
      store.set(SID, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // session-ish: 30 min
        maxAge: 60 * 30,
      });
    }

    const body = (await request.json().catch(() => ({}))) as {
      path?: string;
      locale?: string;
    };
    const path = (body.path ?? "").slice(0, 1024);
    if (!path) return new NextResponse(null, { status: 204 });

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      await supabase.from("page_view").insert({
        visitor_id: visitorId,
        session_id: sessionId,
        path,
        locale: body.locale ?? null,
        referrer: hdrs.get("referer"),
        country: hdrs.get("x-vercel-ip-country"),
        user_agent: hdrs.get("user-agent"),
      });
    }
  } catch {
    /* tracking must never surface an error to the visitor */
  }

  return new NextResponse(null, { status: 204 });
}
