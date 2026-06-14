// Click "레코드 추가" once, then dump the new row's input/select fields.
import puppeteer from "puppeteer-core";

const outPath = process.argv[2] || "/tmp/cdp_row.png";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

const r = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("a,button")].find((e) =>
    (e.getAttribute("onclick") || "").includes("addRecordEvent"),
  );
  if (!btn) return "no-add-button";
  btn.click();
  return "added";
});
console.log("add row:", r);
await new Promise((res) => setTimeout(res, 1200));

const fields = await page.evaluate(() => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  // Only inputs inside the modify layer rows (exclude the top filter selects)
  const all = [...document.querySelectorAll("input,select")].filter(vis);
  return all.map((e, i) => ({
    i,
    tag: e.tagName,
    type: e.type,
    name: e.name || null,
    cls: e.className || null,
    placeholder: e.getAttribute("placeholder") || null,
    value: e.value,
    options: e.tagName === "SELECT" ? [...e.options].map((o) => `${o.value}=${o.text}`) : undefined,
  }));
});
console.log(JSON.stringify(fields, null, 2));
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);
await browser.disconnect();
