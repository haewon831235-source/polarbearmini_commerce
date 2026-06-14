import puppeteer from "puppeteer-core";
const browser = await puppeteer.connect({ browserURL: "http://localhost:9222", defaultViewport: null });
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

const r = await page.evaluate(() => {
  const setVal = (el, v) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(el, v);
    for (const ev of ["input", "change", "keyup", "blur"]) el.dispatchEvent(new Event(ev, { bubbles: true }));
  };
  const inp = [...document.querySelectorAll('input[type="text"], input:not([type])')].find(
    (e) => /vercel-dns/.test(e.value),
  );
  if (!inp) return "no-cname-input";
  setVal(inp, "cname.vercel-dns.com.");
  return "set to " + inp.value;
});
console.log(r);
await new Promise((r) => setTimeout(r, 500));

// click 확인 (record_subm) on the editable row
const c = await page.evaluate(() => {
  const subm = [...document.querySelectorAll("span")].filter(
    (s) => (s.innerText || "").trim() === "확인" && /record_subm/.test(s.className),
  );
  if (!subm.length) return "no-확인";
  subm[0].click();
  return "확인 clicked";
});
console.log(c);
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: process.argv[2] });
console.log("SAVED");
await browser.disconnect();
