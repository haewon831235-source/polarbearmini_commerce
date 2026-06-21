import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing, countryToLocale } from "./i18n/routing";
import { updateAdminSession } from "./lib/supabase/admin-auth";

// Next.js 16 renamed the `middleware` convention to `proxy` (nodejs runtime).
// We still drive locale routing with next-intl's middleware under the hood.
const handle = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // /admin is non-localized: bypass next-intl entirely and only refresh the
  // Supabase auth session. (The real access check lives in requireAdmin().)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateAdminSession(request);
  }

  // Geo-based default: if the visitor hasn't explicitly chosen a locale yet,
  // seed the NEXT_LOCALE cookie from their country so next-intl's detection
  // (cookie > Accept-Language > default) resolves to the regional locale.
  if (!request.cookies.has("NEXT_LOCALE")) {
    const country = request.headers.get("x-vercel-ip-country");
    const geoLocale = country ? countryToLocale[country] : undefined;
    if (geoLocale) {
      request.cookies.set("NEXT_LOCALE", geoLocale);
    }
  }

  return handle(request);
}

export const config = {
  // Skip Next internals, API routes, and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
