// Navigate the active remote-debugging Chrome tab to a URL and screenshot it.
// Usage: node goto.mjs <url> <outPath>
import puppeteer from "puppeteer-core";

const url = process.argv[2];
const outPath = process.argv[3] || "/tmp/cdp_shot.png";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const pages = await browser.pages();
const httpPages = pages.filter((p) => p.url().startsWith("http"));
const page = httpPages[httpPages.length - 1] || pages[0];

await page.setViewport({ width: 1440, height: 1600 });

if (url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2500));
}

console.log("URL:", page.url());
console.log("TITLE:", await page.title());
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);

await browser.disconnect();
