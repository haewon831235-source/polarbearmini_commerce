import "server-only";

// PortOne config from env. storeId + channelKey are NOT secret (the browser
// SDK needs them). PORTONE_API_SECRET is server-only (payment verification).
// While these env vars are unset the checkout shows a "준비중" state; setting
// them (+ redeploy) flips the switch to live payments. No code change needed.

export interface PortoneClientConfig {
  storeId: string;
  channelKey: string;
}

export function getPortoneConfig(): PortoneClientConfig | null {
  const storeId = process.env.PORTONE_STORE_ID;
  const channelKey = process.env.PORTONE_CHANNEL_KEY;
  if (!storeId || !channelKey) return null;
  return { storeId, channelKey };
}

export function getPortoneApiSecret(): string | undefined {
  return process.env.PORTONE_API_SECRET;
}
