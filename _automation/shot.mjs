// Connect to the remote-debugging Chrome and screenshot the active page.
// Usage: node shot.mjs <outPath> [urlSubstringToPick]
import puppeteer from "puppeteer-core";

const outPath = process.argv[2] || "/tmp/cdp_shot.png";
const pick = process.argv[3];

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const pages = await browser.pages();
const httpPages = pages.filter((p) => p.url().startsWith("http"));
const page =
  (pick && httpPages.find((p) => p.url().includes(pick))) ||
  httpPages[httpPages.length - 1] ||
  pages[0];

console.log("URL:", page.url());
console.log("TITLE:", await page.title());
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);

await browser.disconnect();
