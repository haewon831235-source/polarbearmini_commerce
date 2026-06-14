// Dump all visible clickable elements in the modify layer with text/value/onclick.
import puppeteer from "puppeteer-core";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];

const out = await page.evaluate(() => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  return [...document.querySelectorAll("a,button,input,span")]
    .filter(vis)
    .map((e) => ({
      tag: e.tagName,
      type: e.type || null,
      text: ((e.innerText || e.value || "") + "").trim().slice(0, 20),
      onclick: e.getAttribute("onclick"),
      cls: (e.className || "").slice(0, 40),
    }))
    .filter((o) => o.text === "확인" || o.text === "삭제" || /확인|삭제|save|check|confirm/i.test((o.onclick || "")));
});
console.log(JSON.stringify(out, null, 2));
await browser.disconnect();
