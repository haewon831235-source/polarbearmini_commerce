// List all open pages/targets in the remote-debugging Chrome.
import puppeteer from "puppeteer-core";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const pages = await browser.pages();
console.log("total pages:", pages.length);
for (const p of pages) {
  let title = "?";
  try {
    title = await p.title();
  } catch {}
  console.log("-", JSON.stringify({ url: p.url(), title }));
}

// Also dump targets (includes popups/other_targets)
const targets = browser.targets();
console.log("targets:", targets.length);
for (const t of targets) {
  console.log("  T:", t.type(), "|", t.url());
}

await browser.disconnect();
