// Click the first clickable element whose text contains <text>, then screenshot.
// Usage: node click-text.mjs "<text>" <outPath>
import puppeteer from "puppeteer-core";

const text = process.argv[2];
const outPath = process.argv[3] || "/tmp/cdp_shot.png";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const before = new Set(await browser.pages());
const pages = await browser.pages();
const httpPages = pages.filter((p) => p.url().startsWith("http"));
const page = httpPages[httpPages.length - 1] || pages[0];
await page.setViewport({ width: 1440, height: 1600 });

const result = await page.evaluate((t) => {
  const els = [...document.querySelectorAll("a,button,input[type=button],input[type=submit],span,li")];
  const el = els.find((e) => {
    const s = ((e.innerText || e.value || "") + "").trim();
    return s === t || s.includes(t);
  });
  if (!el) return "not-found";
  el.click();
  return "clicked";
}, text);

console.log("click:", text, "=>", result);
await new Promise((r) => setTimeout(r, 3000));

const after = await browser.pages();
const created = after.filter((p) => !before.has(p));
const target =
  created.find((p) => p.url().startsWith("http")) ||
  after.filter((p) => p.url().startsWith("http")).pop() ||
  page;
await target.bringToFront().catch(() => {});
await target.setViewport({ width: 1440, height: 1600 }).catch(() => {});
await new Promise((r) => setTimeout(r, 800));

console.log("URL:", target.url());
await target.screenshot({ path: outPath });
console.log("SAVED:", outPath);

await browser.disconnect();
