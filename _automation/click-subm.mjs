import puppeteer from "puppeteer-core";
const browser = await puppeteer.connect({ browserURL: "http://localhost:9222", defaultViewport: null });
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });
const r = await page.evaluate(() => {
  const subm = [...document.querySelectorAll("span")].filter((s) => (s.innerText || "").trim() === "확인" && /record_subm/.test(s.className));
  if (subm.length) {
    subm[0].click();
    return "clicked record_subm count=" + subm.length;
  }
  // fallback: any span '확인'
  const any = [...document.querySelectorAll("span")].filter((s) => (s.innerText || "").trim() === "확인");
  if (any.length) {
    any[0].click();
    return "clicked plain span 확인 count=" + any.length + " classes=" + any.map((s) => s.className).join("|");
  }
  return "no 확인 span found";
});
console.log(r);
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: process.argv[2] });
console.log("SAVED");
await browser.disconnect();
