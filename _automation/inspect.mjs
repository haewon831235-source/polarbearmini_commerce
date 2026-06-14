// Inspect elements matching a text on the total_set page: tag/id/class/onclick/href.
// Usage: node inspect.mjs "<text>"
import puppeteer from "puppeteer-core";

const text = process.argv[2] || "레코드 수정";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];

const found = await page.evaluate((t) => {
  const out = [];
  const all = [...document.querySelectorAll("*")];
  for (const e of all) {
    const own = [...e.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join("")
      .trim();
    if (own.includes(t)) {
      out.push({
        tag: e.tagName,
        id: e.id || null,
        cls: e.className || null,
        onclick: e.getAttribute("onclick"),
        href: e.getAttribute("href"),
        html: e.outerHTML.slice(0, 200),
      });
    }
  }
  // also list any button/a with onclick containing pop/edit/수정
  const handlers = [...document.querySelectorAll("a,button,input")]
    .filter((e) => /pop|edit|수정|modify|record/i.test((e.getAttribute("onclick") || "") + (e.getAttribute("href") || "")))
    .map((e) => ({ tag: e.tagName, id: e.id, onclick: e.getAttribute("onclick"), href: e.getAttribute("href") }));
  return { matches: out, handlers };
}, text);

console.log(JSON.stringify(found, null, 2));
await browser.disconnect();
