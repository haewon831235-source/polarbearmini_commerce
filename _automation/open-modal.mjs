// Open the Gabia "records_modify" layer by clicking the real button (matched by
// onclick), then dump the modal's form fields and screenshot.
import puppeteer from "puppeteer-core";

const outPath = process.argv[2] || "/tmp/cdp_modal.png";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

const clicked = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button,a,input")].find((e) =>
    (e.getAttribute("onclick") || "").includes("recordModifyLayer") &&
    !(e.getAttribute("onclick") || "").includes("Close"),
  );
  if (!btn) return "no-button";
  btn.click();
  return "clicked";
});
console.log("open modal:", clicked);
await new Promise((r) => setTimeout(r, 1500));

// Dump form structure inside the visible modify layer.
const form = await page.evaluate(() => {
  const layer =
    document.querySelector("#records_modify") ||
    document.querySelector(".records_modify") ||
    document;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const inputs = [...layer.querySelectorAll("input,select,textarea")].map((e, i) => ({
    i,
    tag: e.tagName,
    type: e.type || null,
    name: e.name || null,
    id: e.id || null,
    cls: e.className || null,
    placeholder: e.getAttribute("placeholder") || null,
    value: e.value || null,
    visible: visible(e),
    options: e.tagName === "SELECT" ? [...e.options].map((o) => o.value + "=" + o.text) : undefined,
  }));
  const buttons = [...layer.querySelectorAll("a,button")]
    .filter((e) => visible(e))
    .map((e) => ({ text: (e.innerText || "").trim(), onclick: e.getAttribute("onclick") }))
    .filter((b) => b.text);
  return { layerFound: layer !== document, inputs, buttons };
});
console.log(JSON.stringify(form, null, 2));

await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);
await browser.disconnect();
