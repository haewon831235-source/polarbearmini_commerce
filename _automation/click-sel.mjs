// Click an element by CSS selector (optionally Nth visible), then screenshot.
// Usage: node click-sel.mjs "<selector>" <outPath> [indexFromEnd]
import puppeteer from "puppeteer-core";

const sel = process.argv[2];
const outPath = process.argv[3] || "/tmp/cdp_shot.png";
const fromEnd = parseInt(process.argv[4] || "0", 10);

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

const r = await page.evaluate(({ sel, fromEnd }) => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const els = [...document.querySelectorAll(sel)].filter(vis);
  if (!els.length) return "not-found(" + sel + ")";
  const el = fromEnd ? els[els.length - fromEnd] : els[0];
  el.click();
  return "clicked (" + els.length + " visible matches, picked " + (fromEnd ? "fromEnd " + fromEnd : "first") + ")";
}, { sel, fromEnd });
console.log("click-sel:", sel, "=>", r);

await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);
await browser.disconnect();
