"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// First-party visitor tracking: beacons a page-view to /api/track on every
// route change. Mirrors the PostHog provider's route-change detection but
// writes to our own page_view table. sendBeacon carries same-origin cookies
// (pbm_vid/pbm_sid) and survives unload.
function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const locale = pathname.split("/")[1] || null;
    const payload = JSON.stringify({ path: pathname, locale });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([payload], { type: "application/json" }),
        );
      } else {
        void fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      /* never let tracking break navigation */
    }
  }, [pathname, searchParams]);

  return null;
}

export function TrackProvider() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}
