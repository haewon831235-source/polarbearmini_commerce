// Fill the last editable DNS record row, then click its "확인" button.
// Usage: node fill-row.mjs <TYPE> <HOST> <VALUE> <outPath>
import puppeteer from "puppeteer-core";

const TYPE = process.argv[2];
const HOST = process.argv[3];
const VALUE = process.argv[4];
const outPath = process.argv[5] || "/tmp/cdp_fill.png";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

const setType = await page.evaluate((type) => {
  const setVal = (el, v) => {
    const proto = el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const sels = [...document.querySelectorAll('select[name="type"]')];
  if (!sels.length) return "no-type-select";
  const sel = sels[sels.length - 1];
  setVal(sel, type);
  return "type-set";
}, TYPE);
console.log("type:", setType);

// type change may re-render the value input — wait.
await new Promise((r) => setTimeout(r, 900));

const fill = await page.evaluate(({ host, value }) => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const setVal = (el, v) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("keyup", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  };
  const sels = [...document.querySelectorAll('select[name="type"]')];
  const sel = sels[sels.length - 1];
  // row container
  let row = sel.closest("tr");
  if (!row) {
    row = sel.parentElement;
    while (row && row.querySelectorAll('input[type="text"]').length < 2) row = row.parentElement;
  }
  if (!row) return "no-row";
  const texts = [...row.querySelectorAll('input[type="text"], input:not([type])')].filter(vis);
  if (texts.length < 2) return "fields=" + texts.length;
  // host first, value second
  setVal(texts[0], host);
  setVal(texts[1], value);
  return "filled host+value (" + texts.length + " text inputs)";
}, { host: HOST, value: VALUE });
console.log("fill:", fill);

await new Promise((r) => setTimeout(r, 500));

// Click 확인 within the last row.
const confirm = await page.evaluate(() => {
  const sels = [...document.querySelectorAll('select[name="type"]')];
  const sel = sels[sels.length - 1];
  let row = sel.closest("tr") || sel.parentElement;
  while (row && ![...row.querySelectorAll("a,button")].some((b) => (b.innerText || "").trim() === "확인")) {
    row = row.parentElement;
  }
  if (!row) return "no-confirm-row";
  const btn = [...row.querySelectorAll("a,button")].find((b) => (b.innerText || "").trim() === "확인");
  if (!btn) return "no-confirm-btn";
  btn.click();
  return "confirmed";
});
console.log("confirm:", confirm);

await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);
await browser.disconnect();
