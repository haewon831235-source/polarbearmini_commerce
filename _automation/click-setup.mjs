// Click the "설정" button in the row for polarisatelierkorea.com, then
// screenshot whatever page results (handles same-tab nav or popup window).
import puppeteer from "puppeteer-core";

const outPath = process.argv[2] || "/tmp/cdp_shot.png";
const DOMAIN = "polarisatelierkorea.com";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const before = new Set((await browser.pages()).map((p) => p));
const pages = await browser.pages();
const httpPages = pages.filter((p) => p.url().startsWith("http"));
const page = httpPages[httpPages.length - 1] || pages[0];
await page.setViewport({ width: 1440, height: 1600 });

const result = await page.evaluate((domain) => {
  const rows = [...document.querySelectorAll("tr")];
  const row = rows.find((r) => (r.innerText || "").includes(domain));
  if (!row) return "no-row";
  const btn = [...row.querySelectorAll("a,button,input,span")].find((b) =>
    ((b.innerText || b.value || "") + "").trim().includes("설정"),
  );
  if (!btn) return "no-setup-button";
  btn.click();
  return "clicked";
}, DOMAIN);

console.log("click result:", result);

// Wait for either navigation or a new popup tab.
await new Promise((r) => setTimeout(r, 3500));

const after = await browser.pages();
const newPages = after.filter((p) => !before.has(p));
const target =
  newPages.find((p) => p.url().startsWith("http")) ||
  after.filter((p) => p.url().startsWith("http")).pop() ||
  page;

await target.bringToFront().catch(() => {});
await target.setViewport({ width: 1440, height: 1600 }).catch(() => {});
await new Promise((r) => setTimeout(r, 1000));

console.log("active URL:", target.url());
console.log("active TITLE:", await target.title().catch(() => "?"));
await target.screenshot({ path: outPath });
console.log("SAVED:", outPath);

await browser.disconnect();
