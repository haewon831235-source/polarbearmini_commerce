// Click the visible button/link whose trimmed text EXACTLY equals <text>.
// Usage: node click-exact.mjs "<text>" <outPath> [indexFromEnd]
import puppeteer from "puppeteer-core";

const text = process.argv[2];
const outPath = process.argv[3] || "/tmp/cdp_shot.png";
const fromEnd = parseInt(process.argv[4] || "0", 10); // 0 = first match

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

const r = await page.evaluate(({ t, fromEnd }) => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  let els = [...document.querySelectorAll("a,button,input[type=button],input[type=submit]")]
    .filter(vis)
    .filter((e) => ((e.innerText || e.value || "") + "").trim() === t);
  if (!els.length) return "not-found(" + t + ")";
  const el = fromEnd ? els[els.length - fromEnd] : els[0];
  el.click();
  return "clicked (" + els.length + " matches)";
}, { t: text, fromEnd });
console.log("click-exact:", text, "=>", r);

await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);
await browser.disconnect();
