import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing, countryToLocale } from "./i18n/routing";

// Next.js 16 renamed the `middleware` convention to `proxy` (nodejs runtime).
// We still drive locale routing with next-intl's middleware under the hood.
const handle = createMiddleware(routing);

export function proxy(request: NextRequest) {
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
