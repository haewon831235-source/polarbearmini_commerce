import { NextResponse, type NextRequest } from "next/server";
import { commerce } from "@/lib/commerce";
import { localeCurrency, locales, type Locale } from "@/i18n/routing";

// Lightweight catalog feed for the voice assistant widget. Returns the
// localized product list (title/subtitle/price/franchise) the client-side
// rule engine matches against. Kept off the static layout so the rest of the
// site's rendering mode is unaffected. Goes through the commerce interface —
// never touches Supabase directly (architecture guardrail).

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("locale") ?? "ko";
  const locale: Locale = (locales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : "ko";
  const currency = localeCurrency[locale];
  try {
    const products = await commerce.listProducts({ locale, currency });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
